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
  declarations: [HomePage, MovieModalComponent, FilterMoviePopoverComponent, FavoritesMoviesModalComponent],
  entryComponents: [MovieModalComponent, FilterMoviePopoverComponent, FavoritesMoviesModalComponent]
})
export class HomePageModule {}
