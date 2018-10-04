import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DetailPage } from './detail.page';

import { YoutubeModalComponent } from '../modals/youtube-modal/youtube.modal';
import { ShowCommentsModalComponent } from '../modals/show-comments-modal/show.comments.modal';
import { CommentModalComponent } from '../modals/comment-modal/comment.modal';

import { StarRatingModule } from 'angular-star-rating';

const routes: Routes = [
  {
    path: '',
    component: DetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    StarRatingModule.forRoot()
  ],
  declarations: [DetailPage, YoutubeModalComponent, ShowCommentsModalComponent, CommentModalComponent],
  entryComponents: [YoutubeModalComponent, ShowCommentsModalComponent, CommentModalComponent]
})
export class DetailPageModule {}
