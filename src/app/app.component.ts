import { Component, signal } from "@angular/core";
import { AuthService } from "./services/auth.service";
import { HeaderComponent } from "./components/header/header.component";

@Component({
  selector: "app-root",
  imports: [HeaderComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  title = "lineup-setter";

}
