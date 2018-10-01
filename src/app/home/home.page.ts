import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Movie } from '../models/movie.model';
import { MoviesQuery } from '../state/movie.query';
import { MoviesStore } from '../state/movie.store';
import { MoviesService } from '../services/movies.service';

import { Router } from '@angular/router';

import { InfiniteScroll, ModalController, PopoverController, LoadingController, ItemSliding } from '@ionic/angular';

import { MovieModalComponent } from '../modals/movie-modal/movie.modal';
import { FilterMoviePopoverComponent } from '../popovers/filter-movie.popover';

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

  constructor(private moviesStore: MoviesStore, private moviesQuery: MoviesQuery, private moviesService: MoviesService,
              private router: Router, private modalCtrl: ModalController, private popoverCtrl: PopoverController) {
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
        setTimeout( () => {
          this.showSkeleton = false;
        }, 2000);
        this.moviesStore.set(movies);
      });
    }
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

}
