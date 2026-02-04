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
  protected backgroundStyle: string = "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('background/bg-1.png')";

  startGame(): void {
    this.router.navigate(['/game']);
  }

  startArcade(): void {
    this.router.navigate(['/game/arcade']);
  }
}
