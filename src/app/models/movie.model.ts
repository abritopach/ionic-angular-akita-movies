import { ID } from '@datorama/akita';
​
export interface Movie {
    id: ID;
    title: string;
    year: number;
    director: string | null;
    cast: string | null;
    genre: string | null;
    notes: string | null;
    poster: string | null;
    videoId: string | null;
    genreImage: string | null;
    likes: number | 0;
    rate: number | 0;
}
​
export function createMovie({
  id = null, title = '', year = null, director = '', cast = ''
}: Partial<Movie>) {
  return {
    id,
    title,
    year,
    director,
    cast
  };
}
