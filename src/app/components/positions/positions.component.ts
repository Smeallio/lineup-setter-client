import { Component, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PositionService } from '../../services/positions.service';
import { ConfirmService } from '../../services/confirm.service';

@Component({
  selector: 'app-positions',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './positions.component.html',
  styleUrl: './positions.component.scss',
})
export class PositionComponent implements OnInit {
  constructor(
    public positionService: PositionService,
    private confirmService: ConfirmService
  ) {}

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

  async onDeletePosition(positionId: string): Promise<void> {
    const confirmed = await this.confirmService.ask(
      'Are you sure you want to remove this position?'
    );
    if (!confirmed) return;
    this.positionService.deletePosition(positionId).subscribe({
      error: (err) => console.error('Error deleting position:', err),
    });
  }
}
