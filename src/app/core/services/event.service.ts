import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type GameEventType = 'VIBRATE' | 'FLASH' | 'SCREEN_SHAKE';

@Injectable({
    providedIn: 'root'
})
export class EventService {
    private eventsSubject = new Subject<{ type: GameEventType; payload?: any }>();
    public events$ = this.eventsSubject.asObservable();

    public emit(type: GameEventType, payload?: any): void {
        this.eventsSubject.next({ type, payload });
    }

    public vibrate(duration: number = 200): void {
        this.emit('VIBRATE', duration);
    }

    public flash(): void {
        this.emit('FLASH');
    }
}
