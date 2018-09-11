import { Injectable } from '@angular/core';
import { QueryEntity, ID } from '@datorama/akita';
import { MoviesStore, MoviesState } from '../state/movie.store';
import { Movie } from '../models/movie.model';

@Injectable({ providedIn: 'root' })
export class MoviesQuery extends QueryEntity<MoviesState, Movie> {
  constructor(protected store: MoviesStore) {
    super(store);
  }
}
