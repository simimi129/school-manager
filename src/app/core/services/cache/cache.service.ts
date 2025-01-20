import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  getItem<T>(key: string): T | null {
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

  setItem(key: string, data: object | string) {
    if (typeof data === 'string') {
      localStorage.setItem(key, data);
    }
    localStorage.setItem(key, JSON.stringify(data));
  }

  removeItem(key: string) {
    localStorage.removeItem(key);
  }

  clear() {
    localStorage.clear();
  }
}
