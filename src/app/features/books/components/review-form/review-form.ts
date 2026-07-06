import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { ReviewService } from '../../services/review';
import { ReviewRequest } from '../../models/review.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../../auth/services/auth';

@Component({
  selector: 'app-review-form',
  imports: [ReactiveFormsModule],
  templateUrl: './review-form.html',
  styleUrl: './review-form.css',
})
export class ReviewForm {
  private fb = inject(FormBuilder);
  private reviewService = inject(ReviewService);

  private authService = inject(Auth);

  /*private usuarioId = this.authService.currentUserId()!;
  if(usuarioId: any) {
    this.errorMsg.set('Debe iniciar sesión para publicar una reseña.');
    return;
  }*/

  @Input({ required: true })
  libroId!: number;

  @Output()
  reviewCreated = new EventEmitter<void>();

  loading = signal(false);

  errorMsg = signal('');

  reviewForm = this.fb.group({
    calificacion: [5, [Validators.required, Validators.min(1), Validators.max(5)]],

    comentario: ['', [Validators.required, Validators.maxLength(1000)]],
  });

  guardar() {
    const usuarioId = this.authService.currentUserId();

    if (usuarioId == null) {
      this.errorMsg.set('Debe iniciar sesión para publicar una reseña.');
      return;
    }

    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();

      return;
    }

    this.loading.set(true);
    this.errorMsg.set('');

    const review: ReviewRequest = {
      usuarioId: usuarioId,

      libroId: this.libroId,

      calificacion: this.reviewForm.value.calificacion!,

      comentario: this.reviewForm.value.comentario!,
    };

    this.reviewService.create(review).subscribe({
      next: () => {
        this.loading.set(false);

        this.reviewForm.reset({
          calificacion: 5,
          comentario: '',
        });

        this.reviewCreated.emit();
      },

      error: (err) => {
        this.loading.set(false);

        this.errorMsg.set(err.error?.message ?? 'No se pudo registrar la reseña.');
      },
    });
  }
}
