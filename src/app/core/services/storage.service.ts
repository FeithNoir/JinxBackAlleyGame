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

    /**
     * Versión síncrona para web. Evita promesas en el flujo normal del juego.
     * En Electron delega en save() y devuelve true (el guardado es asíncrono).
     */
    public saveSync(key: string, data: any): boolean {
        if (!key || data === undefined) {
            console.error('StorageService: Invalid key or data');
            return false;
        }

        if (this.isElectron) {
            void this.save(key, data);
            return true;
        }

        try {
            localStorage.setItem(key, JSON.stringify(data));
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

    /**
     * Versión síncrona para web. En Electron devuelve null; usar load().
     */
    public loadSync(key: string): any {
        if (!key) {
            console.error('StorageService: Invalid key');
            return null;
        }

        if (this.isElectron) return null;

        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`StorageService: Failed to load data for key "${key}"`, error);
            return null;
        }
    }

    public getEnvironment(): 'web' | 'electron' {
        return this.isElectron ? 'electron' : 'web';
    }
}
