import { Injectable, inject, signal, DestroyRef, effect } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { StorageService } from '@services/storage.service';
import { toSignal } from '@angular/core/rxjs-interop';

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

    private tracks: Record<string, string> = {
        title: 'music/title.mp3',
        main: 'music/main.mp3',
        arcade: 'music/arcade.mp3'
    };

    private routeUrl = toSignal(
        this.router.events.pipe(
            filter(e => e instanceof NavigationEnd),
            map(e => (e as NavigationEnd).urlAfterRedirects),
            startWith(this.router.url)
        )
    );

    constructor() {
        const destroyRef = inject(DestroyRef);
        this.audio.loop = true;
        this.audio.volume = this.volumeSignal();

        effect(() => {
            const url = this.routeUrl();
            if (url) {
                this.handleRouteChange(url);
            }
        });

        destroyRef.onDestroy(() => {
            this.audio.pause();
            this.audio.src = '';
        });
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
}
