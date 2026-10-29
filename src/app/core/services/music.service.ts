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
        this.audio.preload = 'none';
        // Persistencia de volumen / mute
        try {
            const saved = JSON.parse(localStorage.getItem('jinx.audio') ?? 'null');
            if (saved) { this.volumeSignal.set(saved.volume ?? 0.5); this.isMutedSignal.set(!!saved.muted); }
        } catch { /* ignore */ }
        this.audio.volume = this.isMutedSignal() ? 0 : this.volumeSignal();
        effect(() => {
            try { localStorage.setItem('jinx.audio', JSON.stringify({ volume: this.volumeSignal(), muted: this.isMutedSignal() })); } catch { /* ignore */ }
        });
        // Los navegadores bloquean el autoplay: reintenta en el primer gesto del usuario
        const unlock = () => {
            if (this.audio.src && this.audio.paused) this.audio.play().catch(() => { /* sin audio */ });
            window.removeEventListener('pointerdown', unlock);
            window.removeEventListener('keydown', unlock);
        };
        window.addEventListener('pointerdown', unlock);
        window.addEventListener('keydown', unlock);
        this.audio.addEventListener('error', () => console.info(`MusicService: pista no disponible (${this.audio.src}). public/ no está versionado.`));

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
        } else if (url.startsWith('/game')) { // antes '/history': esa ruta no existe y la música de juego nunca sonaba
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
        this.audio.play().catch(() => { /* autoplay bloqueado: se reintenta en el primer gesto */ });
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
