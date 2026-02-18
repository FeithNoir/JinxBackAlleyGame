import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { LoadingService } from '@services/loading.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [],
  templateUrl: './loading.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingComponent {
  public loadingService = inject(LoadingService);
}
