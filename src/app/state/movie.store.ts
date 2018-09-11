import { Injectable } from '@angular/core';
import { EntityState, EntityStore, Store, StoreConfig, transaction } from '@datorama/akita';
import { createMovie, Movie } from '../models/movie.model';

export interface MoviesState extends EntityState<Movie> {}
​
const initialState: Partial<Movie> = createMovie({id: null, title: '', year: null, director: '', cast: ''});
​
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'movies' })
export class MoviesStore extends EntityStore<MoviesState, Movie> {
  constructor() {
    super(initialState);
  }

  @transaction()
  fetchMovies() {
  }
}
