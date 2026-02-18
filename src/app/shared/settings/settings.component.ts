import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { SettingsService } from '@services/settings.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {
  private settingsService = inject(SettingsService);

  closeSettings(): void {
    this.settingsService.closeSettingsPanel();
  }
}
