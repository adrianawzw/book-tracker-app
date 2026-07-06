import { Component, inject } from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { Auth } from '../../../features/auth/services/auth';


@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private readonly router = inject(Router);
  private readonly auth = inject(Auth);

  isAuthPage = false;
  isLoggedIn = false;

  constructor() {
    this.isLoggedIn = this.auth.isLoggedIn();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isAuthPage = event.url.includes('/login') || event.url.includes('/register');
      this.isLoggedIn = this.auth.isLoggedIn();
    });
  }

  logout() {
    this.auth.logout();
  }
}