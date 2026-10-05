import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup-dialog',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignUpDialogComponent {
  signupForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  errorMessage: string | null = null;

  @Output() signUpSuccess = new EventEmitter<void>();
  @Output() closeSignUp = new EventEmitter<void>();

  constructor(private authService: AuthService) {}

  onSubmit(): void {
    if (this.signupForm.valid) {
      const { name, email, password } = this.signupForm.value;
      this.authService.signup(name!, email!, password!).subscribe({
        next: () => {
          this.signUpSuccess.emit();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Sign up failed. Please try again.';
        },
      });
    }
  }

  onClose(): void {
    this.closeSignUp.emit();
  }

}
