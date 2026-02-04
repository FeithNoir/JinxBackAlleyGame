import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class MusicService implements OnDestroy {
    private audio = new Audio();
    private currentTrack = new BehaviorSubject<string>('');
    public currentTrack$ = this.currentTrack.asObservable();

    private volume = new BehaviorSubject<number>(0.5);
    public volume$ = this.volume.asObservable();

    private isMuted = new BehaviorSubject<boolean>(false);
    public isMuted$ = this.isMuted.asObservable();

    private tracks: Record<string, string> = {
        title: 'music/title.mp3',
        main: 'music/main.mp3',
        arcade: 'music/arcade.mp3'
    };

    constructor(private router: Router) {
        this.audio.loop = true;
        this.audio.volume = this.volume.value;

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
        if (!source || this.currentTrack.value === trackKey) return;

        this.audio.pause();
        this.audio.src = source;
        this.audio.load();
        this.currentTrack.next(trackKey);

        // Play might be blocked by browser until user interaction
        this.audio.play().catch(err => console.warn('Audio playback blocked:', err));
    }

    public setVolume(val: number): void {
        const clamped = Math.max(0, Math.min(1, val));
        this.volume.next(clamped);
        if (!this.isMuted.value) {
            this.audio.volume = clamped;
        }
    }

    public toggleMute(): void {
        const muted = !this.isMuted.value;
        this.isMuted.next(muted);
        this.audio.volume = muted ? 0 : this.volume.value;
    }

    ngOnDestroy(): void {
        this.audio.pause();
        this.audio.src = '';
    }
}
