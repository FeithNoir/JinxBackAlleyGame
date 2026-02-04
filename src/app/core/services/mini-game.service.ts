import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CharacterService } from '@services/character.service';

@Injectable({
    providedIn: 'root'
})
export class MiniGameService {
    private characterService = inject(CharacterService);

    private progress = new BehaviorSubject<number>(0);
    public progress$ = this.progress.asObservable();

    private isActive = new BehaviorSubject<boolean>(false);
    public isActive$ = this.isActive.asObservable();

    private timer = new BehaviorSubject<number>(0);
    public timer$ = this.timer.asObservable();

    private timerInterval: any;

    public start(duration: number = 10): void {
        if (this.isActive.getValue()) return;

        this.isActive.next(true);
        this.progress.next(0);
        this.timer.next(duration);

        this.timerInterval = setInterval(() => {
            const currentTimer = this.timer.getValue();
            if (currentTimer <= 0) {
                this.end(false);
            } else {
                this.timer.next(currentTimer - 1);
            }
        }, 1000);

        this.updateReaction();
    }

    public increment(amount: number = 5): void {
        if (!this.isActive.getValue()) return;

        const newProgress = Math.min(this.progress.getValue() + amount, 100);
        this.progress.next(newProgress);
        this.updateReaction();

        if (newProgress >= 100) {
            this.end(true);
        }
    }

    private updateReaction(): void {
        const p = this.progress.getValue();
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
        this.isActive.next(false);

        if (success) {
            this.characterService.showReaction("Uwah! You actually did it!", 5000);
        } else {
            this.characterService.showReaction("Hah! Too slow!", 3000);
        }
    }

    public reset(): void {
        this.isActive.next(false);
        this.progress.next(0);
        this.timer.next(0);
        if (this.timerInterval) clearInterval(this.timerInterval);
    }
}
