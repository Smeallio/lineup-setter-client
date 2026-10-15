import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-confirm',
  standalone: true,
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
})
export class ConfirmDialogComponent {
  @Input({ required: true }) message!: string;
  @Input() confirmLabel = 'Yes';
  @Input() cancelLabel = 'No';

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEscapeKey() {
    this.cancelled.emit();
  }
}
