import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthResponseData } from './auth-response-data.model';
import { throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';
import { DataStorageService } from '../shared/data-storage.service';
import { Profile } from '../profile/profile.model';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;

    constructor(private http: HttpClient, private dataStorageService: DataStorageService,
                private router: Router) {}

    signup(profile: Profile, password: string) {
        let uid: string;
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyB0Z7C9nIGqUzwkewTo4_6G1BWCJC-3frE',
            {
                email: profile.email,
                password: password,
                returnSecureToken: true
            }
            ).pipe(
                catchError(this.handleError),
                tap(
                    resData => {
                        uid = resData.localId;
                        this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
                    },
                    error => {},
                    () => {
                        profile.uid = uid;
                        this.dataStorageService.createProfile(profile);
                    }
                )
            );
    }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyB0Z7C9nIGqUzwkewTo4_6G1BWCJC-3frE',
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(
            catchError(this.handleError),
            tap(
                resData => {
                    this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
                }
            )
        );
    }

    autoLogin() {
        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));

        if (!userData) {
            return;
        }
        
        const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));

        if (loadedUser.token) {
            this.user.next(loadedUser);
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

    logout() {
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.clear();

        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }

        this.tokenExpirationTimer = null;
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(
            () => {
                this.logout();
            }, expirationDuration);
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = "An unknown error has occurred!";

        if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage);
        }

        switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'This emails exists already!';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'This email does not exist!';
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'This password is not correct!';
                break;
        }

        return throwError(errorMessage);
    }

    private handleAuthentication(email: string, uid: string, token: string, expiresIn: number) {
        const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
        const user = new User(
            email, 
            uid, 
            token, 
            expirationDate
        );
        this.user.next(user);
        this.autoLogout(expiresIn * 1000);
        this.dataStorageService.fetchProfiles();
        localStorage.setItem('userData', JSON.stringify(user));
    }
}