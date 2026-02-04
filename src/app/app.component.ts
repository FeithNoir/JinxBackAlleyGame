import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MusicService } from '@services/music.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private musicService = inject(MusicService);
  title = 'JinxBackalleyGame';
}
