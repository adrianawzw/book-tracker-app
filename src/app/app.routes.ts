import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/pages/dashboard/dashboard';
import { BookList } from './features/books/pages/book-list/book-list';
import { BookDetail } from './features/books/pages/book-detail/book-detail';
import { ListList } from './features/list/pages/list-list/list-list';
import { ListDetail } from './features/list/pages/list-detail/list-detail';
import { About } from './features/dashboard/pages/about/about';
import { Login } from './features/auth/pages/login/login';
import { Resources } from './features/dashboard/pages/resources/resources';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: Dashboard,
  },
  {
    path: 'about',
    component: About,
  },
  {
    path: 'resources',
    component: Resources,
  },
  {
    path: 'books',
    component: BookList,
  },
  {
    path: 'books/:id',
    component: BookDetail,
  },
  {
    path: 'lists',
    component: ListList,
  },
  {
    path: 'lists/:id',
    component: ListDetail,
  },
  {
    path: 'login',
    component: Login,
  },
];
