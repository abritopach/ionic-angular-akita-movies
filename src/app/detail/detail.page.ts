import { Component, OnInit } from '@angular/core';

import { Movie } from '../models/movie.model';

import { MoviesQuery } from '../state/movie.query';
import { MoviesStore } from '../state/movie.store';

import { YoutubeApiService } from '../services/youtube-api-service';
import { MoviesService } from '../services/movies.service';

import { Plugins, Capacitor } from '@capacitor/core';

import {default as iziToast, IziToastSettings} from 'izitoast';

import { ModalController } from '@ionic/angular';
import { YoutubeModalComponent } from '../modals/youtube-modal/youtube.modal';
import { ShowCommentsModalComponent } from '../modals/show-comments-modal/show.comments.modal';
import { CommentModalComponent } from '../modals/comment-modal/comment.modal';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

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

  constructor(private moviesQuery: MoviesQuery, private youtubeApiService: YoutubeApiService, private modalCtrl: ModalController,
              private moviesStore: MoviesStore, private moviesService: MoviesService) { }

  ngOnInit() {
    console.log('DetailPage::ngOnInit() | method called');
  }

  watchTrailer() {
    console.log('DetailsPage::watchTrailer | method called');

    // Code to use Youtube Api Service: providers/youtube-api-service.ts
    this.youtubeApiService.searchMovieTrailer(this.moviesQuery.getActive().title)
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
    console.log('DetailsPage::presentModal | method called -> movie', this.moviesQuery.getActive());
    const componentProps = { modalProps: { item: this.moviesQuery.getActive(), videoId: this.videoId}};
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

    const options = {width: 640, height: 360, videoId: this.moviesQuery.getActive().videoId};
    const playerReady = await YoutubePlayer.initialize(options);
  }

  onClickFavorite() {
    console.log('DetailsPage::onClickFavorite | method called');
    let favorites = [];
    if (localStorage.getItem('favorites') !== null) {
      favorites = JSON.parse(localStorage.getItem('favorites'));
    }

    const exist = favorites.filter(item => {
      return item.title === this.moviesQuery.getActive().title;
    });

    if (exist.length === 0) {
      favorites.push(this.moviesQuery.getActive());
      localStorage.setItem('favorites', JSON.stringify(favorites));
      const newSettings: IziToastSettings = {title: 'Favorite movie', message: 'Favorite Movie added.', position: 'bottomLeft'};
      iziToast.success({...this.defaultIziToastSettings, ...newSettings});
    } else {
      const newSettings: IziToastSettings = {title: 'Favorite movie', message: 'The movie has already been added.', position: 'bottomLeft',
      color: 'red', icon: 'ico-error'};
      iziToast.show({...this.defaultIziToastSettings, ...newSettings});
    }
  }

  onClickLike() {
    console.log('DetailsPage::onClickLike | method called');
    if (typeof this.moviesQuery.getActive().likes === 'undefined') {
      this.moviesStore.update(this.moviesQuery.getActive().id, {
        likes: 0
      });
    }
    console.log(this.moviesQuery.getActive().likes);
    // moviesQuery.getActive()likes += 1;
    this.moviesStore.update(this.moviesQuery.getActive().id, {
      likes: this.moviesQuery.getActive().likes + 1
    });

    this.moviesService.editMovie(this.moviesQuery.getActive()).subscribe(movie => {
      console.log('movie', movie);
    });
  }

  async presentCommentModal() {
    console.log('DetailsPage::presentCommentModal');

    const componentProps = { modalProps: { title: 'Comment'}};

    const modal = await this.modalCtrl.create({
      component: CommentModalComponent,
      componentProps: componentProps
    });
    await modal.present();

    const {data} = await modal.onWillDismiss();
    if (data) {
      console.log('data', data);
    }
  }

  onClickComment() {
    console.log('DetailsPage::onClickComment');
    this.presentCommentModal();
  }

  async presentShowCommentsModal() {
    console.log('DetailsPage::presentShowCommentsModal');

    const componentProps = { modalProps: { title: 'Comments', movie: this.moviesQuery.getActive()}};

    const modal = await this.modalCtrl.create({
      component: ShowCommentsModalComponent,
      componentProps: componentProps
    });
    await modal.present();

    const {data} = await modal.onWillDismiss();
    if (data) {
      console.log('data', data);
    }
  }

  onClickShowComment() {
    console.log('DetailsPage::onClickShowComment');
    this.presentShowCommentsModal();
  }

}
