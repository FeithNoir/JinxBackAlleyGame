import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SceneService {
  private backgroundStyleSignal = signal<string>("url('background/bg-1.png')");
  public backgroundStyle = this.backgroundStyleSignal.asReadonly();

  constructor() { }

  public setBackground(style: string): void {
    this.backgroundStyleSignal.set(style);
  }
}
