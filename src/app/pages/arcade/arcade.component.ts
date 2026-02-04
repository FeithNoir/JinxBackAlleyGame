import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterService, DEFAULT_JINX_PROPS } from '../../core/services/character.service';
import { CharacterComponent } from '../../shared/character/character.component';
import { CharacterProps } from '../../core/interfaces/character-props.interface';
import { Subscription } from 'rxjs';
import { EventService } from '../../core/services/event.service';

@Component({
  selector: 'app-arcade',
  standalone: true,
  imports: [CommonModule, CharacterComponent],
  templateUrl: './arcade.component.html',
  styleUrl: './arcade.component.css'
})
export class ArcadeComponent implements OnInit, OnDestroy {
  characterProps: CharacterProps | undefined;
  arcadeChaos = 0;
  private subs = new Subscription();

  constructor(
    private characterService: CharacterService,
    private eventService: EventService
  ) { }

  ngOnInit(): void {
    this.characterService.setMode('arcade');

    this.subs.add(
      this.characterService.characterProps$.subscribe(props => {
        this.characterProps = props;
      })
    );

    this.subs.add(
      this.characterService.arcadeChaosLevel$.subscribe(level => {
        this.arcadeChaos = level;
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onInteract(part: string): void {
    const chaos = this.arcadeChaos;
    let mood = '';
    if (chaos <= 30) mood = 'annoyed';
    else if (chaos <= 70) mood = 'nervous';
    else mood = 'happy';

    const reactions: Record<string, Record<string, string>> = {
      'head': {
        'annoyed': 'No me toques el pelo...',
        'nervous': '¿Eh? ¿Qué haces?',
        'happy': 'Hehe, se siente bien...'
      },
      'top': {
        'annoyed': 'Manten tus manos lejos.',
        'nervous': 'Uff, hace calor aquí...',
        'happy': 'Me gusta cuando haces eso.'
      },
      'bottom': {
        'annoyed': '¡Hey! Cuidado.',
        'nervous': 'S-si sigues así...',
        'happy': 'Mmm... no te detengas.'
      }
    };

    const text = reactions[part]?.[mood] || '...';
    this.characterService.showReaction(text);

    // Expression shifts
    if (mood === 'annoyed') this.characterService.applyPreset('expression', 'mad');
    else if (mood === 'nervous') this.characterService.applyPreset('expression', 'nervous');
    else if (mood === 'happy') this.characterService.applyPreset('expression', 'happy');

    // Visual effects matching history mode
    this.eventService.vibrate(300);
    if (chaos > 50) {
      this.eventService.flash();
    }
  }
}
