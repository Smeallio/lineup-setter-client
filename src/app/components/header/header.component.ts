import { Component, signal } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { LoginDialogComponent } from "../login/login.component";

@Component({
    selector: "app-header",
    standalone: true,
    imports: [LoginDialogComponent],
    templateUrl: "./header.component.html",
    styleUrl: "./header.component.scss",
  })
  export class HeaderComponent {
    showLoginDialog = signal(false);

    constructor(public authService: AuthService) {}

    onLoginClick(): void {
        this.showLoginDialog.set(true);
    }

    onDialogClosed(): void {
        this.showLoginDialog.set(false);
    }

    onLogoutClick(): void {
        this.authService.logout();
    }
  }