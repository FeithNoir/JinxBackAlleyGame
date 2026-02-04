import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    private isLoading = new BehaviorSubject<boolean>(false);
    public isLoading$ = this.isLoading.asObservable();

    public show(): void {
        this.isLoading.next(true);
    }

    public hide(): void {
        // Artificial small delay for smoother transition
        setTimeout(() => {
            this.isLoading.next(false);
        }, 800);
    }
}
