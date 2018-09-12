import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Movie } from '../models/movie.model';
import { MoviesQuery } from '../state/movie.query';
import { MoviesStore } from '../state/movie.store';
import { MoviesService } from '../services/movies.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  currentYear = new Date().getFullYear();
  movies$: Observable<Movie[]>;
  iconView: String = 'apps';

  constructor(private moviesStore: MoviesStore, private moviesQuery: MoviesQuery, private moviesService: MoviesService) {
    console.log('HomePage::constructor() | method called');
  }

  ngOnInit() {
    console.log('HomePage::ngOnInit() | method called');
    this.movies$ = this.moviesQuery.selectAll();
    this.fetchMovies(0, 20);
  }

  fetchMovies(start: number, end: number) {
    console.log('HomePage::fetchMovies() | method called');
    if (this.moviesQuery.isPristine) {
      this.moviesService.getMovies(start, end).subscribe(movies => {
        this.moviesStore.set(movies);
      });
    }
  }

}
