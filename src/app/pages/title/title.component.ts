import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-title',
  standalone: true,
  imports: [],
  templateUrl: './title.component.html',
  styleUrl: './title.component.css'
})
export class TitleComponent {
  constructor(private router: Router) {}

  startGame() {
    this.router.navigate(['/game']);
  }
}
