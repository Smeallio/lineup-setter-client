import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { PlayerService } from '../../services/player.service';
import { PositionService } from '../../services/positions.service';
import { LineupService } from '../../services/lineup.service';
import { ConfirmService } from '../../services/confirm.service';

@Component({
  selector: 'app-lineup',
  standalone: true,
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './lineup.component.html',
  styleUrl: './lineup.component.scss',
})
export class LineupComponent implements OnInit {
  constructor(
    public playerService: PlayerService,
    public positionService: PositionService,
    public lineupService: LineupService,
    private confirmService: ConfirmService
  ) {}

  ngOnInit(): void {
    register();
  }

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

  async onClearLineup(): Promise<void> {
    const confirmed = await this.confirmService.ask(
      'Are you sure you want to clear this lineup?'
    );
    if (!confirmed) return;
    this.lineupService.clearLineup();
  }
}
