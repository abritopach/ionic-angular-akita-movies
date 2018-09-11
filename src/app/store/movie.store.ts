import { Store, StoreConfig } from '@datorama/akita';
import { createMovie, Movie } from '../models/movie.model';
​
const initialState: Movie = createMovie();
​
@StoreConfig({ name: 'movie' })
export class MovieStore extends Store<Movie> {
  constructor() {
    super(initialState);
  }
}
