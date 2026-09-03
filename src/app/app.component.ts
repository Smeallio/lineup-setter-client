import { Component, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Player } from "./models/player.interface";

@Component({
  selector: "app-root",
  imports: [RouterOutlet],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  title = "lineup-setter";

}
