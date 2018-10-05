import { Genre } from './../models/movie.model';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';

import { MovieModalComponent } from '../modals/movie-modal/movie.modal';
import { FilterMoviePopoverComponent } from '../popovers/filter-movie.popover';
import { FavoritesMoviesModalComponent } from '../modals/favorites-movies-modal/favorites.movies.modal';

import { NgSelectModule } from '@ng-select/ng-select';

import { StarRatingModule } from 'angular-star-rating';

import { GenreCarouselComponent } from '../components/genre-carousel/genre-carousel.component';

@NgModule({
  imports: [
    CommonModule,
    NgSelectModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ]),
    StarRatingModule.forRoot()
  ],
  declarations: [HomePage, MovieModalComponent, FilterMoviePopoverComponent, FavoritesMoviesModalComponent, GenreCarouselComponent],
  entryComponents: [MovieModalComponent, FilterMoviePopoverComponent, FavoritesMoviesModalComponent, GenreCarouselComponent]
})
export class HomePageModule {}
