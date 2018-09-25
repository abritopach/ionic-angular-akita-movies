import { Injectable } from '@angular/core';
import { QueryEntity, ID, QueryConfig, Order } from '@datorama/akita';
import { MoviesStore, MoviesState } from '../state/movie.store';
import { Movie } from '../models/movie.model';

@QueryConfig({
  sortBy: 'year',
  sortByOrder: Order.DESC // Order.DESC
})

@Injectable({ providedIn: 'root' })
export class MoviesQuery extends QueryEntity<MoviesState, Movie> {
  constructor(protected store: MoviesStore) {
    super(store);
  }
}
