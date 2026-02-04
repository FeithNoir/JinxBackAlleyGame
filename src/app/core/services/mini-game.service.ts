import { Injectable, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CharacterService } from '@services/character.service';

@Injectable({
    providedIn: 'root'
})
export class MiniGameService {
    private characterService = inject(CharacterService);

    // Signals
    private progressSignal = signal<number>(0);
    public progress = this.progressSignal.asReadonly();
    public progress$ = toObservable(this.progressSignal);

    private isActiveSignal = signal<boolean>(false);
    public isActive = this.isActiveSignal.asReadonly();
    public isActive$ = toObservable(this.isActiveSignal);

    private timerSignal = signal<number>(0);
    public timer = this.timerSignal.asReadonly();
    public timer$ = toObservable(this.timerSignal);

    private timerInterval: any;

    public start(duration: number = 10): void {
        if (this.isActiveSignal()) return;

        this.isActiveSignal.set(true);
        this.progressSignal.set(0);
        this.timerSignal.set(duration);

        this.timerInterval = setInterval(() => {
            const currentTimer = this.timerSignal();
            if (currentTimer <= 0) {
                this.end(false);
            } else {
                this.timerSignal.set(currentTimer - 1);
            }
        }, 1000);

        this.updateReaction();
    }

    public increment(amount: number = 5): void {
        if (!this.isActiveSignal()) return;

        const newProgress = Math.min(this.progressSignal() + amount, 100);
        this.progressSignal.set(newProgress);
        this.updateReaction();

        if (newProgress >= 100) {
            this.end(true);
        }
    }

    private updateReaction(): void {
        const p = this.progressSignal();
        let reaction = '';

        if (p < 30) {
            reaction = "Wait! What are you doing?";
        } else if (p < 70) {
            reaction = "Stop! That... that feels weird!";
        } else if (p < 100) {
            reaction = "I can't... concentrate! Stop it!";
        }

        if (reaction) {
            this.characterService.showReaction(reaction, 2000);
        }
    }

    public end(success: boolean): void {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        this.isActiveSignal.set(false);

        if (success) {
            this.characterService.showReaction("Uwah! You actually did it!", 5000);
        } else {
            this.characterService.showReaction("Hah! Too slow!", 3000);
        }
    }

    public reset(): void {
        this.isActiveSignal.set(false);
        this.progressSignal.set(0);
        this.timerSignal.set(0);
        if (this.timerInterval) clearInterval(this.timerInterval);
    }
}
