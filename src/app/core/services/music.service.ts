import { Injectable, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { StorageService } from '@services/storage.service';

@Injectable({
    providedIn: 'root'
})
export class MusicService {
    private router = inject(Router);
    private storageService = inject(StorageService);

    private audio = new Audio();

    // Signals
    private currentTrackSignal = signal<string>('');
    private volumeSignal = signal<number>(0.5);
    private isMutedSignal = signal<boolean>(false);

    // Public Read-only Signals
    public currentTrack = this.currentTrackSignal.asReadonly();
    public volume = this.volumeSignal.asReadonly();
    public isMuted = this.isMutedSignal.asReadonly();

    // Compat Observables
    public currentTrack$ = toObservable(this.currentTrackSignal);
    public volume$ = toObservable(this.volumeSignal);
    public isMuted$ = toObservable(this.isMutedSignal);

    private tracks: Record<string, string> = {
        title: 'music/title.mp3',
        main: 'music/main.mp3',
        arcade: 'music/arcade.mp3'
    };

    constructor() {
        this.audio.loop = true;
        this.audio.volume = this.volumeSignal();

        // Detect route changes to switch music
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: any) => {
            this.handleRouteChange(event.urlAfterRedirects);
        });

        // Initial check
        this.handleRouteChange(this.router.url);
    }

    private handleRouteChange(url: string): void {
        if (url === '/' || url === '/title') {
            this.playTrack('title');
        } else if (url.includes('/arcade')) {
            this.playTrack('arcade');
        } else if (url.includes('/history')) {
            this.playTrack('main');
        }
    }

    public playTrack(trackKey: string): void {
        const source = this.tracks[trackKey];
        if (!source || this.currentTrackSignal() === trackKey) return;

        this.audio.pause();
        this.audio.src = source;
        this.audio.load();
        this.currentTrackSignal.set(trackKey);

        // Play might be blocked by browser until user interaction
        this.audio.play().catch(err => console.warn('Audio playback blocked:', err));
    }

    public setVolume(val: number): void {
        const clamped = Math.max(0, Math.min(1, val));
        this.volumeSignal.set(clamped);
        if (!this.isMutedSignal()) {
            this.audio.volume = clamped;
        }
    }

    public toggleMute(): void {
        const muted = !this.isMutedSignal();
        this.isMutedSignal.set(muted);
        this.audio.volume = muted ? 0 : this.volumeSignal();
    }

    ngOnDestroy(): void {
        this.audio.pause();
        this.audio.src = '';
    }
}
