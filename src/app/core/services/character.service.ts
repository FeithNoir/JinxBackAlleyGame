import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CharacterProps } from '@interfaces/character-props.interface';

export const DEFAULT_JINX_PROPS: CharacterProps = {
    eyes: 'e-1',
    mouth: 'm-1',
    leftArm: 'left-1',
    rightArm: 'right-1',
    head: '',
    top: 'top-1',
    underwearTop: 'bandage-1',
    bottom: 'short-1',
    underwearBottom: 'sticker-1',
    stockings: 'stocking-1',
    feet: 'boots-1',
    effects: {},
};

export const OUTFIT_PRESETS: Record<string, Partial<CharacterProps>> = {
    normal: {
        head: '',
        top: 'top-1',
        underwearTop: 'bandage-1',
        bottom: 'short-1',
        underwearBottom: 'sticker-1',
        stockings: 'stocking-1',
        feet: 'boots-1'
    },
    cat: {
        head: 'cat-ears',
        top: 'cat-top',
        underwearTop: '',
        bottom: 'cat-bottom',
        underwearBottom: '',
        stockings: 'stocking-1',
        feet: 'boots-1'
    },
    naked: {
        head: '',
        top: '',
        underwearTop: '',
        bottom: '',
        underwearBottom: '',
        stockings: '',
        feet: ''
    }
};

export const EXPRESSION_PRESETS: Record<string, Partial<CharacterProps>> = {
    neutral: { eyes: 'e-1', mouth: 'm-1', effects: {} },
    happy: { eyes: 'e-2', mouth: 'm-2', effects: {} },
    mad: { eyes: 'e-3', mouth: 'm-3', effects: {} },
    nervous: { eyes: 'e-1', mouth: 'm-3', effects: { head: 'heat' } }
};

@Injectable({
    providedIn: 'root'
})
export class CharacterService {
    private characterProps = new BehaviorSubject<CharacterProps>(DEFAULT_JINX_PROPS);
    public characterProps$: Observable<CharacterProps> = this.characterProps.asObservable();

    private arcadeChaosLevel = new BehaviorSubject<number>(0);
    public arcadeChaosLevel$ = this.arcadeChaosLevel.asObservable();

    private mode = new BehaviorSubject<'history' | 'arcade'>('history');
    public mode$ = this.mode.asObservable();

    private reactionText = new BehaviorSubject<string>('');
    public reactionText$ = this.reactionText.asObservable();

    constructor() { }

    public setMode(mode: 'history' | 'arcade'): void {
        this.mode.next(mode);
    }

    public getMode(): 'history' | 'arcade' {
        return this.mode.getValue();
    }

    public setArcadeChaosLevel(level: number): void {
        const capped = Math.min(Math.max(level, 0), 100);
        this.arcadeChaosLevel.next(capped);
    }

    public getArcadeChaosLevel(): number {
        return this.arcadeChaosLevel.getValue();
    }

    public showReaction(text: string, duration: number = 3000): void {
        this.reactionText.next(text);
        setTimeout(() => {
            if (this.reactionText.getValue() === text) {
                this.reactionText.next('');
            }
        }, duration);
    }

    public applyPreset(type: 'outfit' | 'expression', id: string): void {
        const presets = type === 'outfit' ? OUTFIT_PRESETS : EXPRESSION_PRESETS;
        const preset = presets[id];
        if (preset) {
            this.updateProps(preset);
        }
    }

    public updateProps(newProps: Partial<CharacterProps>): void {
        const current = this.characterProps.getValue();
        this.characterProps.next({ ...current, ...newProps });
    }

    public updateEffect(key: keyof Required<CharacterProps>['effects'], value: string): void {
        const current = this.characterProps.getValue();
        const effects = { ...current.effects, [key]: value === current.effects?.[key] ? '' : value };
        this.characterProps.next({ ...current, effects });
    }

    public toggleLayer(prop: keyof CharacterProps, value: string): void {
        const current = this.characterProps.getValue();
        const newValue = current[prop] === value ? '' : value;
        this.characterProps.next({ ...current, [prop]: newValue });
    }

    public setProps(props: CharacterProps): void {
        this.characterProps.next(props);
    }

    public getProps(): CharacterProps {
        return this.characterProps.getValue();
    }
}
