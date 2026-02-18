import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    private isLoadingSignal = signal<boolean>(false);

    // Provide both signal and observable for transition
    public isLoading = this.isLoadingSignal.asReadonly();

    public show(): void {
        this.isLoadingSignal.set(true);
    }

    public hide(): void {
        // Artificial small delay for smoother transition
        setTimeout(() => {
            this.isLoadingSignal.set(false);
        }, 800);
    }
}
