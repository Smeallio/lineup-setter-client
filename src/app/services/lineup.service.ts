import { Injectable, signal } from '@angular/core';
import { Player } from './../models/player.interface';
import { Position } from './../models/position.interface';
import {
  PlayerAssignment,
  Slot,
  LineupByInning,
  FullLineup,
} from './../models/lineup.interface';

const STORAGE_KEY = 'current_lineup';
const BENCH_LABEL = 'Bench';

@Injectable({ providedIn: 'root' })
export class LineupService {
  lineup = signal<FullLineup | null>(this.loadLineupFromStorage());

  generateLineup(
    players: Player[],
    positions: Position[],
    numInnings: number
  ): FullLineup {
    if (players.length < positions.length) {
      throw new Error('There must be at least as many players as positions.');
    }

    const totalSlots = players.length;
    const benchCount = totalSlots - positions.length;
    const shuffledPlayers = this.shuffle(players);
    const slotList = this.buildSlotList(positions, benchCount);

    const positionOrder = new Map<string, number>(
      positions.map((pos, index) => [pos.position, index])
    );
    const benchSortValue = positions.length;

    const innings: LineupByInning[] = [];
    for (let inning = 1; inning <= numInnings; inning++) {
      const assignments: PlayerAssignment[] = shuffledPlayers.map(
        (player, offset) => {
          const slot = slotList[(offset + inning - 1) % totalSlots];
          return {
            playerId: player.id,
            playerName: player.name,
            position: slot.position,
            field: slot.field,
          };
        }
      );

      assignments.sort((a, b) => {
        const orderA = positionOrder.get(a.position) ?? benchSortValue;
        const orderB = positionOrder.get(b.position) ?? benchSortValue;
        return orderA - orderB;
      });

      innings.push({ inning, assignments });
    }

    const lineup: FullLineup = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      innings,
    };

    this.lineup.set(lineup);
    this.saveLineupToStorage(lineup);

    return lineup;
  }

  clearLineup(): void {
    this.lineup.set(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  private saveLineupToStorage(lineup: FullLineup): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lineup));
  }

  private loadLineupFromStorage(): FullLineup | null {
    const savedLineup = localStorage.getItem(STORAGE_KEY);
    return savedLineup ? JSON.parse(savedLineup) : null;
  }

  public restoreLineupFromStorage(): void {
    this.lineup.set(this.loadLineupFromStorage());
  }

  clearLineupFromPage(): void {
    this.lineup.set(null);
  }

  // Fisher-Yates shuffle algorithm to randomize the order of players and positions
  private shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private buildSlotList(positions: Position[], benchCount: number): Slot[] {
    const infield: Slot[] = this.shuffle(
      positions.filter((p) => p.field === 'infield')
    ).map((p) => ({ position: p.position, field: 'infield' }));

    const outfield: Slot[] = this.shuffle(
      positions.filter((p) => p.field === 'outfield')
    ).map((p) => ({ position: p.position, field: 'outfield' }));

    const bench: Slot[] = Array.from({ length: benchCount }, () => ({
      position: BENCH_LABEL,
      field: 'bench',
    }));

    const groups = [infield, outfield, bench]
      .filter((group) => group.length > 0)
      .sort((a, b) => a.length - b.length);

    const total = positions.length + benchCount;
    const slots: (Slot | undefined)[] = new Array(total);

    for (const group of groups) {
      const openIndices: number[] = [];
      for (let i = 0; i < total; i++) {
        if (!slots[i]) {
          openIndices.push(i);
        }
      }
      group.forEach((slot, index) => {
        const targetIndex =
          openIndices[Math.floor((index * openIndices.length) / group.length)];
        slots[targetIndex] = slot;
      });
    }
    return slots as Slot[];
  }
}
