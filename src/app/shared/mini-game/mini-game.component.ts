import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MiniGameService } from '@services/mini-game.service';
import { CharacterService } from '@services/character.service';
import { EventService } from '@services/event.service';

@Component({
  selector: 'app-mini-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mini-game.component.html',
  styleUrl: './mini-game.component.css'
})
export class MiniGameComponent implements OnInit, OnDestroy {
  private miniGameService = inject(MiniGameService);
  private characterService = inject(CharacterService);
  private eventService = inject(EventService);

  isActive = false;
  progress = 0;
  timer = 0;
  private subs = new Subscription();

  ngOnInit(): void {
    this.subs.add(
      this.miniGameService.isActive$.subscribe(active => {
        this.isActive = active;
      })
    );

    this.subs.add(
      this.miniGameService.progress$.subscribe(p => {
        this.progress = p;
      })
    );

    this.subs.add(
      this.miniGameService.timer$.subscribe(t => {
        this.timer = t;
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onInteractionClick(): void {
    if (this.isActive) {
      this.miniGameService.increment(5);
      this.eventService.vibrate(50);
    }
  }

  close(): void {
    this.miniGameService.end(false);
  }
}
