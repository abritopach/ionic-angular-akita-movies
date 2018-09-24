import { Injectable } from '@angular/core';
import { EntityState, EntityStore, Store, StoreConfig, transaction, ActiveState, getInitialActiveState } from '@datorama/akita';
import { createMovie, Movie } from '../models/movie.model';

export interface MoviesState extends EntityState<Movie> {
  selectedMovie: Movie;
}
​
// const initialState: Partial<Movie> = createMovie({id: null, title: '', year: null, director: '', cast: ''});
const initialState = {
  ...getInitialActiveState()
};

​
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'catalog' })
export class MoviesStore extends EntityStore<MoviesState, Movie> {
  constructor() {
    super(initialState);
  }

  /*
  selectedMovie(selectedMovie: Movie) {
    this.updateRoot({selectedMovie: selectedMovie});
  }

  @transaction()
  fetchMovies() {
  }
  */
}
