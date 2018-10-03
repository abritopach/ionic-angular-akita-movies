import { Component, OnInit, ViewChild } from '@angular/core';

import { Observable } from 'rxjs';

import { Movie } from '../models/movie.model';
import { MoviesQuery } from '../state/movie.query';
import { MoviesStore } from '../state/movie.store';
import { MoviesService } from '../services/movies.service';

import { Router } from '@angular/router';

import { ModalController, PopoverController, LoadingController, ItemSliding, InfiniteScroll, Content } from '@ionic/angular';

import { MovieModalComponent } from '../modals/movie-modal/movie.modal';
import { FilterMoviePopoverComponent } from '../popovers/filter-movie.popover';
import { FavoritesMoviesModalComponent } from '../modals/favorites-movies-modal/favorites.movies.modal';

import {default as iziToast, IziToastSettings} from 'izitoast';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  currentYear = new Date().getFullYear();
  movies$: Observable<Movie[]>;
  iconView: String = 'apps';

  defaultIziToastSettings: IziToastSettings = {
    color: 'green',
    title: '',
    icon: 'ico-success',
    message: '',
    position: 'bottomLeft',
    transitionIn: 'flipInX',
    transitionOut: 'flipOutX',
    image: 'assets/avatar.png',
    imageWidth: 70,
    layout: 2,
  };

  showSkeleton: Boolean = true;
  start: number;
  end: number;
  showScrollTop: Boolean = false;
  @ViewChild('infiniteScroll') infiniteScroll: InfiniteScroll;
  @ViewChild(Content) content: Content;

  constructor(private moviesStore: MoviesStore, private moviesQuery: MoviesQuery, private moviesService: MoviesService,
              private router: Router, private modalCtrl: ModalController, private popoverCtrl: PopoverController) {
    console.log('HomePage::constructor() | method called');
  }

  ngOnInit() {
    console.log('HomePage::ngOnInit() | method called');
    this.movies$ = this.moviesQuery.selectAll();
    this.start = 0;
    this.end = 20;
    this.fetchMovies(this.start, 20);
  }

  fetchMovies(start: number, end: number) {
    console.log('HomePage::fetchMovies() | method called');
    // if (this.moviesQuery.isPristine) {
      this.moviesService.getMovies(start, end).subscribe(movies => {
        console.log('movies', movies);
        setTimeout( () => {
          this.showSkeleton = false;
        }, 2000);
        console.log(this.infiniteScroll);
        if (this.infiniteScroll) {
          this.infiniteScroll.complete();
        }
        // this.moviesStore.set(movies);
        this.moviesStore.add(movies);
      });
    // }
  }

  viewMovieDetails(movie: Movie) {
    // this.moviesStore.selectedMovie(movie);
    /*
    this.moviesStore.update(state => ({
      selectedMovie: movie
    }));
    */
    this.moviesStore.setActive(movie.id);
    this.router.navigateByUrl(`/detail`);
  }

  async presentModal(componentProps: any, slidingItem?: ItemSliding) {
    const modal = await this.modalCtrl.create({
      component: MovieModalComponent,
      componentProps: componentProps
    });
    await modal.present();

    const {data} = await modal.onWillDismiss();
    console.log('presentModal', data);
    if (data) {
      console.log('data', data);
      if (data.option === 'edit') {
        slidingItem.close();
      }
    }
  }

  addMovie() {
    console.log('HomePage::addMovie() | method called');
    const componentProps = { modalProps: { title: 'Add Movie', buttonText: 'Add Movie'}, option: 'add'};
    this.presentModal(componentProps);
  }

  deleteMovie(movie: Movie, slidingItem: ItemSliding) {
    console.log('HomePage::deleteMovie() | method called');
    this.moviesStore.remove(movie.id);
    slidingItem.close();
    this.moviesService.deleteMovie(movie).subscribe(result => {
      console.log(result);
      const newSettings: IziToastSettings = {title: 'Delete movie', message: 'Movie deleted successfully.', position: 'bottomLeft'};
      iziToast.success({...this.defaultIziToastSettings, ...newSettings});
    });
  }

  editMovie(movie: Movie, slidingItem: ItemSliding) {
    console.log('HomePage::editMovie() | method called');
    const componentProps = { modalProps: { title: 'Edit Movie', buttonText: 'Edit Movie', movie: movie}, option: 'edit'};
    this.presentModal(componentProps, slidingItem);
  }

  async presentPopover(event) {
    // console.log('presentPopover');
    const popover = await this.popoverCtrl.create({
      component: FilterMoviePopoverComponent,
      event: event
    });

    await popover.present();

    const { data } = await popover.onWillDismiss();

    if (data) {
      console.log('data popover.onWillDismiss', data);
    }

  }

  doInfinite() {
    // console.log('Begin async operation');
    this.showSkeleton = true;
    this.start = this.end;
    this.end += 20;
    this.showScrollTop = true;
    this.fetchMovies(this.start, this.end);
  }

  changeView() {
    console.log('HomePage::changeView() | method called');
    this.iconView =  this.iconView === 'apps' ? 'list' : 'apps';
  }

  showFavoritesMovies() {
    console.log('HomePage::showFavoritesMovies() | method called');

    let favorites = [];
    if (localStorage.getItem('favorites') !== null) {
      favorites = JSON.parse(localStorage.getItem('favorites'));
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));

    const componentProps = { modalProps: { title: 'Favorites Movies', favoritesMovies: favorites}};
    this.presentFavoritesModal(componentProps);
  }

  async presentFavoritesModal(componentProps: any) {
    const modal = await this.modalCtrl.create({
      component: FavoritesMoviesModalComponent,
      componentProps: componentProps
    });
    await modal.present();

    const {data} = await modal.onWillDismiss();
    if (data) {
      console.log('data', data);
    }
  }

  scrollToTop() {
    this.content.scrollToTop();
  }

}
