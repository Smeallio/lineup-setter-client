import { Component } from "@angular/core";
import { HeaderComponent } from "./components/header/header.component";
import { RosterComponent } from "./components/roster/roster.component";
import { PositionComponent } from "./components/positions/positions.component";

@Component({
  selector: "app-root",
  imports: [HeaderComponent, RosterComponent, PositionComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  title = "lineup-setter";

}
