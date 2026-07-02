import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/components/navbar/navbar';
import { Footer } from './shared/components/footer/footer';
import { Auth } from './features/auth/services/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Book Tracker App');
  constructor() {
    const auth = inject(Auth);
    if (auth.isLoggedIn()) {
      auth.loadMe().subscribe();
    }
  }
}
