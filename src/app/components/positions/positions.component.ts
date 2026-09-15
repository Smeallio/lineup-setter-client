import { Component, EventEmitter, OnInit, Output, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PositionService } from '../../services/positions.service';

@Component({
  selector: 'app-positions',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './positions.component.html',
  styleUrl: './positions.component.scss',
})
export class PositionComponent implements OnInit {
  constructor(public positionService: PositionService) {}

  ngOnInit(): void {
    this.positionService.fetchPositions().subscribe();
  }

  showAddPosition = signal(false);

  toggleAddPositionForm(): void {
    this.showAddPosition.set(!this.showAddPosition());
  }

  newPositionForm = new FormGroup({
    positionName: new FormControl('', Validators.required),
  });

  onAddPosition(): void {
    if (this.newPositionForm.valid) {
      const { positionName } = this.newPositionForm.value;
      this.positionService.addPosition({ position: positionName! }).subscribe({
        next: () => this.newPositionForm.reset(),
        error: (err) => console.error('Error adding position:', err),
      });
    }
  }

  onDeletePosition(positionId: string): void {
    this.positionService.deletePosition(positionId).subscribe({
      next: () => console.log(`Position with ID ${positionId} deleted.`),
      error: (err) => console.error('Error deleting position:', err),
    });
  }
}
