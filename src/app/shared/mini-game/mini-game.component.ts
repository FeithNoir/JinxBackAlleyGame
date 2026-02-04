import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiniGameService } from '@services/mini-game.service';
import { EventService } from '@services/event.service';

@Component({
  selector: 'app-mini-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mini-game.component.html',
  styleUrl: './mini-game.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MiniGameComponent {
  private miniGameService = inject(MiniGameService);
  private eventService = inject(EventService);

  // Link to service signals
  isActive = this.miniGameService.isActive;
  progress = this.miniGameService.progress;
  timer = this.miniGameService.timer;

  onInteractionClick(): void {
    if (this.isActive()) {
      this.miniGameService.increment(5);
      this.eventService.vibrate(50);
    }
  }

  close(): void {
    this.miniGameService.end(false);
  }
}
