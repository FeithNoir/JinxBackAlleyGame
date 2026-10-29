import { Component, input, output, ChangeDetectionStrategy, effect, signal, inject, DestroyRef, untracked } from '@angular/core';
import { SettingsService, TEXT_SPEED_MS } from '@services/settings.service';

@Component({
  selector: 'app-dialogues',
  standalone: true,
  imports: [],
  templateUrl: './dialogues.component.html',
  styleUrl: './dialogues.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    style: 'z-index: 2002; position: relative;' // Ensure it's above screen effects
  }
})
export class DialoguesComponent {
  private settings = inject(SettingsService);
  speaker = input<string>('');
  text = input<string>('');
  dialogueAdvance = output<void>();

  /** Texto visible (efecto máquina de escribir). */
  shown = signal<string>('');
  typing = signal<boolean>(false);
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.stop());
    effect(() => {
      const full = this.text();
      const s = untracked(() => this.settings.settings());
      this.stop();
      const ms = s.reducedMotion ? 0 : TEXT_SPEED_MS[s.textSpeed];
      if (!ms || !full) { this.shown.set(full); this.typing.set(false); return; }
      let i = 0;
      this.shown.set('');
      this.typing.set(true);
      this.timer = setInterval(() => {
        i = Math.min(full.length, i + 2);
        this.shown.set(full.slice(0, i));
        if (i >= full.length) { this.stop(); this.typing.set(false); }
      }, ms * 2);
    });
  }

  private stop(): void {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
  }

  advanceDialogue(): void {
    // Primer clic completa el texto; el segundo avanza
    if (this.typing()) {
      this.stop();
      this.shown.set(this.text());
      this.typing.set(false);
      return;
    }
    this.dialogueAdvance.emit();
  }
}
