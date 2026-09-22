import { Component, computed } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { PositionService } from '../../services/positions.service';
import { LineupService } from '../../services/lineup.service';

@Component({
  selector: 'app-lineup',
  standalone: true,
  imports: [],
  templateUrl: './lineup.component.html',
  styleUrl: './lineup.component.scss',
})
export class LineupComponent {
  constructor(
    public playerService: PlayerService,
    public positionService: PositionService,
    public lineupService: LineupService
  ) {}

  canGenerateLineup = computed(
    () =>
      this.playerService.players().length >=
      this.positionService.positions().length
  );

  onGenerateLineup(): void {
    if (!this.canGenerateLineup()) {
      alert(
        'There must be at least as many players as positions to generate a lineup.'
      );
      return;
    } else {
      this.lineupService.generateLineup(
        this.playerService.players(),
        this.positionService.positions(),
        7
      );
    }
  }
}
