import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '@services/loading.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loadingService.isLoading$ | async) {
      <div class="loading-overlay">
        <div class="loading-content">
          <div class="chaos-loader">
            <div class="purple-orb"></div>
            <div class="biri-biri"></div>
          </div>
          <h2 class="loading-text">RELOADING CHAOS...</h2>
          <div class="progress-track">
            <div class="progress-fill"></div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: var(--c-dark);
      z-index: 9999;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
    }

    .loading-content {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }

    .chaos-loader {
      position: relative;
      width: 100px;
      height: 100px;
      margin-bottom: 20px;
    }

    .purple-orb {
      width: 60px;
      height: 60px;
      background: var(--c-primary);
      border-radius: 50%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 30px var(--c-accent);
      animation: pulse 1s infinite alternate;
      border: 4px solid #000;
    }

    .biri-biri {
      position: absolute;
      width: 100%;
      height: 100%;
      border: 4px dashed var(--c-accent);
      border-radius: 50%;
      animation: rotate 0.5s linear infinite;
    }

    .loading-text {
      font-family: var(--font-comic);
      color: var(--c-accent);
      font-size: 2rem;
      text-shadow: 4px 4px 0px #000;
      letter-spacing: 4px;
      animation: flicker 0.2s infinite;
    }

    .progress-track {
      width: 300px;
      height: 20px;
      background: #111;
      border: 4px solid #000;
      box-shadow: 4px 4px 0px #000;
      position: relative;
      overflow: hidden;
    }

    .progress-fill {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 0;
      background: var(--c-action);
      animation: fill 0.8s ease-in-out forwards;
    }

    @keyframes pulse {
      from { transform: translate(-50%, -50%) scale(1); }
      to { transform: translate(-50%, -50%) scale(1.2); }
    }

    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes flicker {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.8; }
    }

    @keyframes fill {
      from { width: 0; }
      to { width: 100%; }
    }
  `]
})
export class LoadingComponent {
  public loadingService = inject(LoadingService);
}
