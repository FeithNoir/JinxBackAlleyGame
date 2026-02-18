import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { SceneService } from '@services/scene.service';

@Component({
  selector: 'app-title',
  standalone: true,
  imports: [],
  templateUrl: './title.component.html',
  styleUrl: './title.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TitleComponent {
  private router = inject(Router);
  protected sceneService = inject(SceneService);
  

  startGame(): void {
    this.router.navigate(['/game']);
  }

  startArcade(): void {
    this.router.navigate(['/game/arcade']);
  }
}
