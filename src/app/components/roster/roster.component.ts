import { Component, EventEmitter, OnInit, Output, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-roster',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './roster.component.html',
  styleUrl: './roster.component.scss',
})
export class RosterComponent implements OnInit {
  constructor(public playerService: PlayerService) {}

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

  onDeletePlayer(playerId: string): void {
    this.playerService.deletePlayer(playerId).subscribe({
      next: () => console.log(`Player with ID ${playerId} deleted.`),
      error: (err) => console.error('Error deleting player:', err),
    });
  }
}
