import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Player } from './models/players';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'lineup-setter';

  players = signal<Player[]>(
    ['Stevie', 'John', 'Paul', 'George'].map((name, index) => ({
      id: index + 1,
      name,
    }))
  );

  ngOnInit() {
    console.log(this.players());
  }
}
