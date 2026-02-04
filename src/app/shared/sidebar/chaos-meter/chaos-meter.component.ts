import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-chaos-meter',
  imports: [],
  templateUrl: './chaos-meter.component.html',
  styleUrl: './chaos-meter.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChaosMeterComponent {
  @Input() chaosLevel: number = 0;
}
