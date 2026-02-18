import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class EventService {
    // --- Vibration Effect ---
    private _isVibrating = signal<boolean>(false);
    public isVibrating = this._isVibrating.asReadonly();

    // --- Flash Effect ---
    private _isFlashing = signal<boolean>(false);
    public isFlashing = this._isFlashing.asReadonly();

    // --- Screen Shake Effect (alias for vibrate at screen level) ---
    private _isShaking = signal<boolean>(false);
    public isShaking = this._isShaking.asReadonly();

    public vibrate(duration: number = 200): void {
        this._isVibrating.set(true);
        setTimeout(() => this._isVibrating.set(false), duration);
    }

    public flash(): void {
        this._isFlashing.set(true);
        setTimeout(() => this._isFlashing.set(false), 300);
    }

    public shake(duration: number = 900): void {
        this._isShaking.set(true);
        setTimeout(() => this._isShaking.set(false), duration);
    }
}
