import { Component, inject, signal } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  nombres = '';
  apellidos = '';
  email = '';
  password = '';
  errorMsg = signal('');
  successMsg = signal('');
  loading = signal(false);

  submit() {
    this.errorMsg.set('');
    this.successMsg.set('');

    if (!this.nombres.trim() || !this.apellidos.trim() || !this.email.trim() || !this.password) {
      this.errorMsg.set('Todos los campos son obligatorios.');
      return;
    }

    if (this.password.length < 6) {
      this.errorMsg.set('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    this.loading.set(true);

    this.auth.register({
      nombres: this.nombres.trim(),
      apellidos: this.apellidos.trim(),
      email: this.email.trim(),
      password: this.password,
      rol: 'ESTUDIANTE'
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMsg.set('¡Registro exitoso! Redirigiendo...');
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMsg.set(err.error?.message || 'Error al registrarse.');
      },
    });
  }
}