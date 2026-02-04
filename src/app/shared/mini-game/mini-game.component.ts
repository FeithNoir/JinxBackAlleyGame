import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MiniGameService } from '../../core/services/mini-game.service';
import { CharacterService } from '../../core/services/character.service';
import { EventService } from '../../core/services/event.service';

@Component({
  selector: 'app-mini-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mini-game.component.html',
  styleUrl: './mini-game.component.css'
})
export class MiniGameComponent implements OnInit, OnDestroy {
  isActive = false;
  progress = 0;
  timer = 0;
  private subs = new Subscription();

  constructor(
    private miniGameService: MiniGameService,
    private characterService: CharacterService,
    private eventService: EventService
  ) { }

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
