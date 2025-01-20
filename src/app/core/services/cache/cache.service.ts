import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  protected getItem<T>(key: string): T | null {
    const data = localStorage.getItem(key);
    if (data != null) {
      try {
        return JSON.parse(data);
      } catch (error) {
        console.error('Parsing error:', error);
        return null;
      }
    }
    return null;
  }

  protected setItem(key: string, data: object | string) {
    if (typeof data === 'string') {
      localStorage.setItem(key, data);
    }
    localStorage.setItem(key, JSON.stringify(data));
  }

  protected removeItem(key: string) {
    localStorage.removeItem(key);
  }

  protected clear() {
    localStorage.clear();
  }
}
