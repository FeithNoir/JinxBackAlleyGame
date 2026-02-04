import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-title',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './title.component.html',
  styleUrl: './title.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TitleComponent {
  private router = inject(Router);

  startGame(): void {
    this.router.navigate(['/game']);
  }

  startArcade(): void {
    this.router.navigate(['/game/arcade']);
  }
}
