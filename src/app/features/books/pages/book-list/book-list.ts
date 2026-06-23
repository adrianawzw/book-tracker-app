import { Component, inject } from '@angular/core';
import { Books } from '../../services/books';

@Component({
  selector: 'app-book-list',
  imports: [],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css',
})
export class BookList {

  private booksService = inject(Books);

  constructor() {

    this.booksService.searchBooks('angular')
      .subscribe(data => {
        console.log(data);
      });

  }

}