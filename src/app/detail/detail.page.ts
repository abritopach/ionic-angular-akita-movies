import { Component, OnInit } from '@angular/core';

import { Movie } from '../models/movie.model';

import { MoviesQuery } from '../state/movie.query';

import { YoutubeApiService } from '../services/youtube-api-service';

import { Plugins, Capacitor } from '@capacitor/core';

import {default as iziToast, IziToastSettings} from 'izitoast';

import { ModalController } from '@ionic/angular';
import { YoutubeModalComponent } from '../modals/youtube-modal/youtube.modal';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  movie: Movie;
  videoId: string;
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

  constructor(private moviesQuery: MoviesQuery, private youtubeApiService: YoutubeApiService, private modalCtrl: ModalController) { }

  ngOnInit() {
    console.log('DetailPage::ngOnInit() | method called');
    console.log(this.moviesQuery.getActive());
    this.movie = this.moviesQuery.getActive();
  }

  watchTrailer() {
    console.log('DetailsPage::watchTrailer | method called');

    // Code to use Youtube Api Service: providers/youtube-api-service.ts
    this.youtubeApiService.searchMovieTrailer(this.movie.title)
    .subscribe(result => {
      if (result.items.length > 0) {
        console.log(result);
        const { videoId } = result.items[0].id;
        console.log('videoId', videoId);
        this.videoId = videoId;

        // Code to use capacitor-youtube-player plugin.
        console.log('DetailsPage::watchTrailer -> platform: ' + Capacitor.platform);
        if (Capacitor.platform === 'web') {
          this.presentModal();
        } else { // Native
          this.testYoutubePlayerPlugin();
        }
      }
    },
    error => {
      iziToast.show({
        color: 'red',
        title: 'Watch Trailer',
        icon: 'ico-error',
        message: 'Sorry, an error has occurred.',
        position: 'bottomLeft',
        transitionIn: 'flipInX',
        transitionOut: 'flipOutX',
        image: 'assets/avatar.png',
        imageWidth: 70,
        layout: 2,
      });
    });

  }

  async presentModal() {
    console.log('DetailsPage::presentModal | method called -> movie', this.movie);
    const componentProps = { modalProps: { item: this.movie, videoId: this.videoId}};
    const modal = await this.modalCtrl.create({
      component: YoutubeModalComponent,
      componentProps: componentProps
    });
    await modal.present();

    const {data} = await modal.onWillDismiss();
    if (data) {
      console.log('data', data);
    }
  }

  async testYoutubePlayerPlugin() {

    const { YoutubePlayer } = Plugins;

    const result = await YoutubePlayer.echo({value: 'hola' });
    console.log('result', result);

    const options = {width: 640, height: 360, videoId: this.movie.videoId};
    const playerReady = await YoutubePlayer.initialize(options);
  }

  onClickFavorite() {
    console.log('DetailsPage::onClickFavorite | method called');
    const newSettings: IziToastSettings = {title: 'Favorite movie', message: 'Favorite Movie added.', position: 'bottomLeft'};
    iziToast.success({...this.defaultIziToastSettings, ...newSettings});
    let favorites = [];
    if (localStorage.getItem('favorites') !== null) {
      favorites = JSON.parse(localStorage.getItem('favorites'));
    }
    favorites.push(this.movie);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }

}
