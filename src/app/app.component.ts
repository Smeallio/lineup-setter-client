import { Component, effect } from '@angular/core';
import { AuthService } from './services/auth.service';
import { PlayerService } from './services/player.service';
import { PositionService } from './services/positions.service';
import { LineupService } from './services/lineup.service';
import { ConfirmService } from './services/confirm.service';
import { HeaderComponent } from './components/header/header.component';
import { RosterComponent } from './components/roster/roster.component';
import { PositionComponent } from './components/positions/positions.component';
import { LineupComponent } from './components/lineup/lineup.component';
import { ConfirmDialogComponent } from './components/confirm/confirm.component';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, RosterComponent, PositionComponent, LineupComponent, ConfirmDialogComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'lineup-setter';

  constructor(
    public authService: AuthService,
    public confirmService: ConfirmService,
    private playerService: PlayerService,
    private positionService: PositionService, 
    private lineupService: LineupService
  ) {
    effect(() => {
      if (this.authService.isLoggedIn()) {
        this.playerService.fetchPlayers().subscribe();
        this.positionService.fetchPositions().subscribe();
        this.lineupService.restoreLineupFromStorage();
      } else {
        this.playerService.clearPlayers();
        this.positionService.clearPositions();
        this.lineupService.clearLineupFromPage();
      }
    });
  }
}
