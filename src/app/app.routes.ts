import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/pages/dashboard/dashboard';
import { BookList } from './features/books/pages/book-list/book-list';
import { BookDetail } from './features/books/pages/book-detail/book-detail';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: Dashboard
  },
  {
    path: 'books',
    component: BookList
  },
  {
    path: 'books/:id',
    component: BookDetail
  }
];