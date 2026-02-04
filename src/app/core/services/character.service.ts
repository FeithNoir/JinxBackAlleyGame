import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
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
    private characterPropsSignal = signal<CharacterProps>(DEFAULT_JINX_PROPS);
    public characterProps = this.characterPropsSignal.asReadonly();
    public characterProps$ = toObservable(this.characterPropsSignal);

    private arcadeChaosLevelSignal = signal<number>(0);
    public arcadeChaosLevel = this.arcadeChaosLevelSignal.asReadonly();
    public arcadeChaosLevel$ = toObservable(this.arcadeChaosLevelSignal);

    private modeSignal = signal<'history' | 'arcade'>('history');
    public mode = this.modeSignal.asReadonly();
    public mode$ = toObservable(this.modeSignal);

    private reactionTextSignal = signal<string>('');
    public reactionText = this.reactionTextSignal.asReadonly();
    public reactionText$ = toObservable(this.reactionTextSignal);

    constructor() { }

    public setMode(mode: 'history' | 'arcade'): void {
        this.modeSignal.set(mode);
    }

    public getMode(): 'history' | 'arcade' {
        return this.modeSignal();
    }

    public setArcadeChaosLevel(level: number): void {
        const capped = Math.min(Math.max(level, 0), 100);
        this.arcadeChaosLevelSignal.set(capped);
    }

    public getArcadeChaosLevel(): number {
        return this.arcadeChaosLevelSignal();
    }

    public showReaction(text: string, duration: number = 3000): void {
        this.reactionTextSignal.set(text);
        setTimeout(() => {
            if (this.reactionTextSignal() === text) {
                this.reactionTextSignal.set('');
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
        this.characterPropsSignal.update(current => ({ ...current, ...newProps }));
    }

    public updateEffect(key: keyof Required<CharacterProps>['effects'], value: string): void {
        this.characterPropsSignal.update(current => {
            const effects = { ...current.effects, [key]: value === current.effects?.[key] ? '' : value };
            return { ...current, effects };
        });
    }

    public toggleLayer(prop: keyof CharacterProps, value: string): void {
        this.characterPropsSignal.update(current => {
            const newValue = (current as any)[prop] === value ? '' : value;
            return { ...current, [prop]: newValue };
        });
    }

    public setProps(props: CharacterProps): void {
        this.characterPropsSignal.set(props);
    }

    public getProps(): CharacterProps {
        return this.characterPropsSignal();
    }
}
