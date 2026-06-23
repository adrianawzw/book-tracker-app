import { Component } from '@angular/core';

@Component({
  selector: 'app-book-detail',
  imports: [],
  templateUrl: './book-detail.html',
  styleUrl: './book-detail.css',
})
export class BookDetail {

  book: any;

  constructor() {
    this.book = history.state.book;
  }

}