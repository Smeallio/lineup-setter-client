import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Player, AddPlayerRequest } from '../models/player.interface';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  private readonly API_URL = environment.apiUrl;

  players = signal<Player[]>([]);

  constructor(private http: HttpClient) {}

  fetchPlayers() {
    return this.http.get<Player[]>(`${this.API_URL}/players`).pipe(
      tap((players) => {
        this.players.set(players);
      })
    );
  }

  addPlayer(player: AddPlayerRequest) {
    return this.http.post<Player>(`${this.API_URL}/players`, player).pipe(
      tap((newPlayer) => {
        this.players.update((currentPlayers) => [...currentPlayers, newPlayer]);
      })
    );
  }

  deletePlayer(playerId: string) {
    return this.http.delete(`${this.API_URL}/players/${playerId}`).pipe(
      tap(() => {
        this.players.update((currentPlayers) =>
          currentPlayers.filter((player) => player.id !== playerId)
        );
      })
    );
  }
}
