import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/pages/dashboard/dashboard';
import { BookList } from './features/books/pages/book-list/book-list';
import { BookDetail } from './features/books/pages/book-detail/book-detail';
import { ListList } from './features/list/pages/list-list/list-list';
import { ListDetail } from './features/list/pages/list-detail/list-detail';
import { About } from './features/dashboard/pages/about/about';
import { Login } from './features/auth/pages/login/login';
import { Resources } from './features/dashboard/pages/resources/resources';
import { Register } from './features/auth/pages/register/register';
import { authGuard } from './core/guards/auth.guard';
import { AuthorSearchComponent } from './features/authors/pages/author-search/author-search';
import { AuthorDetailComponent } from './features/authors/pages/author-detail/author-detail';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'about', component: About },
  { path: 'resources', component: Resources },
  { path: 'books', component: BookList },
  { path: 'books/:id', component: BookDetail, canActivate: [authGuard] },
  { path: 'authors', component: AuthorSearchComponent },
  { path: 'authors/:key', component: AuthorDetailComponent, canActivate: [authGuard] },
  { path: 'lists', component: ListList, canActivate: [authGuard] },
  { path: 'lists/:id', component: ListDetail, canActivate: [authGuard] },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
];