import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private isElectron: boolean = false;

    constructor() {
        this.isElectron = !!(window as any).electronAPI;
    }

    public async save(key: string, data: any): Promise<boolean> {
        try {
            // Validate data before saving
            if (!key || data === undefined) {
                console.error('StorageService: Invalid key or data');
                return false;
            }

            const serializedData = JSON.stringify(data);

            if (this.isElectron) {
                await (window as any).electronAPI.saveData({ [key]: data });
            } else {
                localStorage.setItem(key, serializedData);
            }

            return true;
        } catch (error) {
            console.error(`StorageService: Failed to save data for key "${key}"`, error);
            return false;
        }
    }

    public async load(key: string): Promise<any> {
        try {
            if (!key) {
                console.error('StorageService: Invalid key');
                return null;
            }

            if (this.isElectron) {
                const data = await (window as any).electronAPI.loadData();
                return data ? data[key] : null;
            } else {
                const data = localStorage.getItem(key);
                return data ? JSON.parse(data) : null;
            }
        } catch (error) {
            console.error(`StorageService: Failed to load data for key "${key}"`, error);
            return null;
        }
    }

    public getEnvironment(): 'web' | 'electron' {
        return this.isElectron ? 'electron' : 'web';
    }
}
