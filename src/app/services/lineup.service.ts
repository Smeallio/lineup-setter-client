import { Injectable, signal } from '@angular/core';
import { Player } from './../models/player.interface';
import { Position } from './../models/position.interface';
import {
  PlayerAssignment,
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
    const shuffledPositions = this.shuffle(positions);
    const benchIndices = this.evenlyDistubtedBenchSpots(totalSlots, benchCount);

    const slotList: string[] = new Array(totalSlots);
    let positionCursor = 0;
    for (let i = 0; i < totalSlots; i++) {
      if (benchIndices.has(i)) {
        slotList[i] = BENCH_LABEL;
      } else {
        slotList[i] = shuffledPositions[positionCursor].position;
        positionCursor++;
      }
    }

    const positionOrder = new Map<string, number>(
      positions.map((pos, index) => [pos.position, index])
    );
    const benchSortValue =  positions.length;

    const innings: LineupByInning[] = [];
    for (let inning = 1; inning <= numInnings; inning++) {
      const assignments: PlayerAssignment[] = shuffledPlayers.map(
        (player, offset) => {
          const position = slotList[(offset + inning - 1) % totalSlots];
          return {
            playerId: player.id,
            playerName: player.name,
            position,
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

  // Fisher-Yates shuffle algorithm to randomize the order of players and positions
  private shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Distibute bench spots evenly through the positions array that players are assigned against
  private evenlyDistubtedBenchSpots(total: number, count: number): Set<number> {
    const indices = new Set<number>();
    if (count <= 0) return indices;
    for (let i = 0; i < count; i++) {
      const index = Math.floor((i * total) / count);
      indices.add(index);
    }
    return indices;
  }
}
