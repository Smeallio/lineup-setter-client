import { Component, EventEmitter, Output, Signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../services/auth.service";

@Component({
    selector: "app-login-dialog",
    standalone: true,
    imports: [FormsModule],
    templateUrl: "./login.component.html",
})
export class LoginDialogComponent {
    username: string = "";
    password: string = "";

    @Output() loginSuccess = new EventEmitter<void>();

    constructor(private authService: AuthService) {}

    async login() {
        try {
            await this.authService.login(this.username, this.password);
            this.loginSuccess.emit();
        } catch (error) {
            console.error("Login failed", error);
        }
    }
}