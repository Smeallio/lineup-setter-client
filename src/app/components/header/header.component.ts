import { Component, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { LineupService } from '../../services/lineup.service';
import { SignUpDialogComponent } from '../signup/signup.component';
import { LoginDialogComponent } from '../login/login.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SignUpDialogComponent, LoginDialogComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  showSignUpDialog = signal(false);
  showLoginDialog = signal(false);

  constructor(
    public authService: AuthService,
    private lineupService: LineupService
  ) {}

  onSignUpClick(): void {
    this.showSignUpDialog.set(true);
  }

  onLoginClick(): void {
    this.showLoginDialog.set(true);
  }

  onDialogClosed(): void {
    this.showLoginDialog.set(false);
    this.showSignUpDialog.set(false);
  }

  onLogoutClick(): void {
    this.authService.logout();
    this.lineupService.lineup.set(null);
  }
}
