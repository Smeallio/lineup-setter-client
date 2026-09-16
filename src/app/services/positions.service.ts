import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Position, AddPositionRequest } from '../models/position.interface';

@Injectable({ providedIn: 'root' })
export class PositionService {
  private readonly API_URL = environment.apiUrl;

  positions = signal<Position[]>([]);

  constructor(private http: HttpClient) {}

  clearPositions() {
    this.positions.set([]);
  }

  fetchPositions() {
    return this.http.get<Position[]>(`${this.API_URL}/positions`).pipe(
      tap((positions) => {
        this.positions.set(positions);
      })
    );
  }

  addPosition(position: AddPositionRequest) {
    return this.http.post<Position>(`${this.API_URL}/positions`, position).pipe(
      tap((newPosition) => {
        this.positions.update((currentPositions) => [...currentPositions, newPosition]);
      })
    );
  }

  deletePosition(positionId: string) {
    return this.http.delete(`${this.API_URL}/positions/${positionId}`).pipe(
      tap(() => {
        this.positions.update((currentPositions) =>
          currentPositions.filter((position) => position.id !== positionId)
        );
      })
    );
  }
}
