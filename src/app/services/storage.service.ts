import { Injectable } from '@angular/core';
import { TokenInfo } from '../interfaces/tokenInfo';

const USER_KEY = 'auth-user';

@Injectable({
providedIn: 'root'
})
export class StorageService {

    constructor() {}

    clean(): void {
        window.sessionStorage.clear();
    }

    setSessionInfo(tokenInfo: TokenInfo) {
        window.sessionStorage.setItem("USER", JSON.stringify(tokenInfo));
    }

    getSessionInfo() {
        const user = window.sessionStorage.getItem("USER");
        if (user) {
            return JSON.parse(user);
        }
        return null;
    }

    isLoggedIn(): boolean {
        const logingInfo = window.sessionStorage.getItem("USER");
        if (logingInfo) {
            return true;
        }
        return false;
    }

}