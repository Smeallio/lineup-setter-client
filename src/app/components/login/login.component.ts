import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginDialogComponent {
  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  errorMessage: string | null = null;

  @Output() loginSuccess = new EventEmitter<void>();
  @Output() closeLogin = new EventEmitter<void>();

  constructor(private authService: AuthService) {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.login(username!, password!).subscribe({
        next: () => {
          this.loginSuccess.emit();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Login failed. Please try again.';
        },
      });
    }
  }

  onClose(): void {
    this.closeLogin.emit();
  }

}
