import { Component, OnInit } from '@angular/core';

import { Movie } from '../models/movie.model';

import { MoviesQuery } from '../state/movie.query';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  movie: Movie;

  constructor(private moviesQuery: MoviesQuery) { }

  ngOnInit() {
    console.log('DetailPage::ngOnInit() | method called');
    console.log(this.moviesQuery.getActive());
    this.movie = this.moviesQuery.getActive();
  }

}
