import { Injectable, signal } from '@angular/core';

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

    public vibrate(duration: number = 200): void {
        this._isVibrating.set(true);
        setTimeout(() => this._isVibrating.set(false), duration);
    }

    public flash(color: string = 'rgba(255, 255, 255, 0.8)'): void {
        this._flashColor.set(color);
        setTimeout(() => this._flashColor.set(null), 300);
    }

    public shake(duration: number = 900): void {
        this._isShaking.set(true);
        setTimeout(() => this._isShaking.set(false), duration);
    }
}
