import { Component, ViewEncapsulation, OnInit, OnDestroy, NgZone } from '@angular/core';
import { PopoverController } from '@ionic/angular';

import { Observable } from 'rxjs';

import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-filter-movie-popover',
  templateUrl: 'filter-movie.popover.html',
  styleUrls: ['./filter-movie.popover.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FilterMoviePopoverComponent implements OnInit, OnDestroy {

  range: any = {
    lower: 1900,
    upper: new Date().getFullYear()
  };

  /*
  filters: any = {
    years: {
      lower: 1900,
      upper: new Date().getFullYear()
    },
    genre: 'Action',
    rating: 0
  };
  */

  filterForm: FormGroup;

  customPopoverOptions: any = {
    header: 'Genre',
    subHeader: 'Select movie genre',
  };

  genres = [
    {id: 1, name: 'Action', image: 'assets/movies-genres/action.png'},
    {id: 2, name: 'Comedy', image: 'assets/movies-genres/comedy.png'},
    {id: 3, name: 'Crime', image: 'assets/movies-genres/crime.png'},
    {id: 4, name: 'Documentary', image: 'assets/movies-genres/documentary.png'},
    {id: 5, name: 'Drama', image: 'assets/movies-genres/drama.png'},
    {id: 6, name: 'Fantasy', image: 'assets/movies-genres/fantasy.png'},
    {id: 7, name: 'Film noir', image: 'assets/movies-genres/film noir.png'},
    {id: 8, name: 'Horror', image: 'assets/movies-genres/horror.png'},
    {id: 9, name: 'Romance', image: 'assets/movies-genres/romance.png'},
    {id: 10, name: 'Science fiction', image: 'assets/movies-genres/science fiction.png'},
    {id: 11, name: 'Westerns', image: 'assets/movies-genres/westerns.png'}
];

  constructor(private popoverCtrl: PopoverController, private zone: NgZone, private formBuilder: FormBuilder) {
    this.createForm();
  }

  createForm() {
    this.filterForm = this.formBuilder.group({
      rate: new FormControl(''),
      years: new FormControl(''),
      genre: new FormControl('')
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  filterMovies() {
    console.log(this.filterForm.value);
    this.popoverCtrl.dismiss();
  }

  clearFilterMovies() {
    this.filterForm.value.rate = 0;
    this.filterForm.value.years.lower = 1900;
    this.filterForm.value.years.upper = new Date().getFullYear();
    this.filterForm.value.genre = '';
    this.popoverCtrl.dismiss();
  }

}
