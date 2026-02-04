import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { MusicService } from './core/services/music.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'JinxBackalleyGame';

  constructor(private musicService: MusicService) { }
}
