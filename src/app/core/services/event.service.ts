import { Injectable, signal, inject } from '@angular/core';
import { SettingsService } from '@services/settings.service';

@Injectable({
    providedIn: 'root'
})
export class EventService {
    // --- Vibration Effect ---
    private _isVibrating = signal<boolean>(false);
    public isVibrating = this._isVibrating.asReadonly();

    // --- Flash Effect ---
    private _flashColor = signal<string | null>(null);
    public flashColor = this._flashColor.asReadonly();

    // --- Screen Shake Effect (alias for vibrate at screen level) ---
    private _isShaking = signal<boolean>(false);
    public isShaking = this._isShaking.asReadonly();

    private settings = inject(SettingsService);

    public vibrate(duration: number = 200): void {
        const s = this.settings.settings();
        if (s.vibration && 'vibrate' in navigator) {
            try { navigator.vibrate(Math.min(duration, 200)); } catch { /* no soportado */ }
        }
        if (s.reducedMotion) return; // sin sacudidas con movimiento reducido
        this._isVibrating.set(true);
        setTimeout(() => this._isVibrating.set(false), duration);
    }

    public flash(color: string = 'rgba(255, 255, 255, 0.8)'): void {
        if (this.settings.settings().reducedMotion) return; // evita destellos (fotosensibilidad)
        this._flashColor.set(color);
        setTimeout(() => this._flashColor.set(null), 300);
    }

    public shake(duration: number = 900): void {
        if (this.settings.settings().reducedMotion) return;
        this._isShaking.set(true);
        setTimeout(() => this._isShaking.set(false), duration);
    }
}
