import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MusicService } from '@services/music.service';
import { SettingsComponent } from '@shared/settings/settings.component';
import { SettingsService } from '@services/settings.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SettingsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private musicService = inject(MusicService);
  protected settingsService = inject(SettingsService);
  title = 'JinxBackalleyGame';
}
