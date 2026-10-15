import { Component, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PlayerService } from '../../services/player.service';
import { ConfirmService } from '../../services/confirm.service';

@Component({
  selector: 'app-roster',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './roster.component.html',
  styleUrl: './roster.component.scss',
})
export class RosterComponent implements OnInit {
  constructor(
    public playerService: PlayerService,
    private confirmService: ConfirmService
  ) {}

  ngOnInit(): void {
    this.playerService.fetchPlayers().subscribe();
  }

  showAddPlayer = signal(false);

  toggleAddPlayerForm(): void {
    this.showAddPlayer.set(!this.showAddPlayer());
  }

  newPlayerForm = new FormGroup({
    playerName: new FormControl('', Validators.required),
  });

  onAddPlayer(): void {
    if (this.newPlayerForm.valid) {
      const { playerName } = this.newPlayerForm.value;
      this.playerService.addPlayer({ name: playerName! }).subscribe({
        next: () => this.newPlayerForm.reset(),
        error: (err) => console.error('Error adding player:', err),
      });
    }
  }

  async onDeletePlayer(playerId: string): Promise<void> {
    const confirmed = await this.confirmService.ask(
      'Are you sure you want to remove this player?'
    );
    if (!confirmed) return;
    this.playerService.deletePlayer(playerId).subscribe({
      error: (err) => console.error('Error deleting player:', err),
    });
  }
}
