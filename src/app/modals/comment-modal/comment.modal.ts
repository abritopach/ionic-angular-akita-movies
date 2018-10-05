import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { MoviesService } from '../../services/movies.service';

import { MoviesQuery } from '../../state/movie.query';
import { MoviesStore } from '../../state/movie.store';

import {default as iziToast, IziToastSettings} from 'izitoast';

@Component({
  selector: 'app-comment-modal',
  templateUrl: 'comment.modal.html',
  styleUrls: ['./comment.modal.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CommentModalComponent implements OnInit {

  commentForm: FormGroup;

  modal: any = {
    title: '',
  };
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

  constructor(private modalCtrl: ModalController, private formBuilder: FormBuilder, private navParams: NavParams,
              private moviesService: MoviesService, private moviesQuery: MoviesQuery, private moviesStore: MoviesStore) {
    this.createForm();
  }

  createForm() {
    this.commentForm = this.formBuilder.group({
      comment: new FormControl('', Validators.required),
      rating: new FormControl('')
    });
  }


  ngOnInit() {
    this.modal = { ...this.navParams.data.modalProps};
  }

  dismiss() {
    // Using the injected ModalController this page
    // can "dismiss" itself and pass back data.
    // console.log('dismiss', data);
    this.modalCtrl.dismiss();
  }

  commentFormSubmit() {
    console.log('CommentModalComponent::commentFormSubmit | method called');
    // console.log(this.commentForm.value);

    let comments;
    if (typeof this.moviesQuery.getActive().comments === 'undefined') {
      comments = [];
    } else {
      comments = this.moviesQuery.getActive().comments;
    }

    if (typeof this.moviesQuery.getActive().rate === 'undefined') {

      this.moviesStore.update(this.moviesQuery.getActive().id, {
        rate: this.commentForm.value.rating,
        numVotes: 1
      });

    } else {

      this.moviesStore.update(this.moviesQuery.getActive().id, {
        rate: (this.moviesQuery.getActive().rate + this.commentForm.value.rating) / this.moviesQuery.getActive().numVotes,
        numVotes: this.moviesQuery.getActive().numVotes + 1
      });
    }

    comments = [...comments, this.commentForm.value.comment];
    this.moviesStore.update(this.moviesQuery.getActive().id, {
      comments: comments
    });

    this.moviesService.editMovie(this.moviesQuery.getActive()).subscribe(movie => {
      console.log('movie', movie);
      this.dismiss();
      const newSettings: IziToastSettings = {title: 'Add comment', message: 'Comment added.', position: 'bottomLeft'};
      iziToast.success({...this.defaultIziToastSettings, ...newSettings});
    });
  }

}
