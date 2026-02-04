import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private isElectron: boolean = false;

    constructor() {
        this.isElectron = !!(window as any).electronAPI;
    }

    public async save(key: string, data: any): Promise<void> {
        if (this.isElectron) {
            await (window as any).electronAPI.saveData({ [key]: data });
        } else {
            localStorage.setItem(key, JSON.stringify(data));
        }
    }

    public async load(key: string): Promise<any> {
        if (this.isElectron) {
            const data = await (window as any).electronAPI.loadData();
            return data ? data[key] : null;
        } else {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        }
    }

    public getEnvironment(): 'web' | 'electron' {
        return this.isElectron ? 'electron' : 'web';
    }
}
