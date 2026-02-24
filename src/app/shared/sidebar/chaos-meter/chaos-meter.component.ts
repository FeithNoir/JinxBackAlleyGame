import { Component, input, ChangeDetectionStrategy, computed, output, effect, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-chaos-meter',
  standalone: true,
  imports: [],
  templateUrl: './chaos-meter.component.html',
  styleUrl: './chaos-meter.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChaosMeterComponent {
  chaosLevel = input<number>(0);
  milestoneReached = output<number>();

  private lastMilestone = 0;

  currentMilestone = computed(() => {
    const level = this.chaosLevel();
    if (level >= 100) return 100;
    if (level >= 75) return 75;
    if (level >= 50) return 50;
    if (level >= 25) return 25;
    return 0;
  });

  milestoneClass = computed(() => {
    const milestone = this.currentMilestone();
    if (milestone > 0) {
      return `milestone-${milestone}`;
    }
    return '';
  });

  constructor() {
    effect(() => {
      const current = this.currentMilestone();
      if (current > 0 && current > this.lastMilestone) {
        this.milestoneReached.emit(current);
        this.lastMilestone = current;
      } else if (current === 0) {
        // Reset lastMilestone if chaos drops below 25
        this.lastMilestone = 0;
      }
    });
  }
}
