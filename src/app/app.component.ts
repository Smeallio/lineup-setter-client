import { Component, signal } from "@angular/core";
import { AuthService } from "./services/auth.service";
import { HeaderComponent } from "./components/header/header.component";
import { RosterComponent } from "./components/roster/roster.component";

@Component({
  selector: "app-root",
  imports: [HeaderComponent, RosterComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  title = "lineup-setter";

}
