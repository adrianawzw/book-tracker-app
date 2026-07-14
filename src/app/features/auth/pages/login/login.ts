import { Component, inject, signal } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private auth = inject(Auth);
  private router = inject(Router);

  email = '';
  password = '';
  errorMsg = signal('');
  loading = signal(false);

  submit() {
    this.errorMsg.set('');
    if (!this.email.trim() || !this.password) return;
    this.loading.set(true);
    this.auth.login(this.email.trim(), this.password)
      .pipe(switchMap(() => this.auth.loadMe()))
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/lists']);
        },
        error: () => {
          this.loading.set(false);
          this.errorMsg.set('Credenciales inválidas.');
        },
      });
  }
}