import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { ReviewService } from '../../services/review';
import { Review } from '../../models/review.model';

@Component({
  selector: 'app-review-list',
  imports: [],
  templateUrl: './review-list.html',
  styleUrl: './review-list.css',
})
export class ReviewList implements OnInit {
  private reviewService = inject(ReviewService);

  @Input({ required: true })
  libroId!: number;

  reviews = signal<Review[]>([]);

  loading = signal(false);

  errorMsg = signal('');

  ngOnInit(): void {
    this.cargarResenas();
  }

  cargarResenas() {
    this.loading.set(true);

    this.reviewService.getByBook(this.libroId).subscribe({
      next: (data) => {
        this.reviews.set(data);

        this.loading.set(false);
      },

      error: () => {
        this.errorMsg.set('No se pudieron cargar las reseñas.');

        this.loading.set(false);
      },
    });
  }
}
