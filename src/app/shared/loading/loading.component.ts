import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { LoadingService } from '@services/loading.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingComponent {
  public loadingService = inject(LoadingService);
}
