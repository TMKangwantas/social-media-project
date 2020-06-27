import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthResponseData } from './auth-response-data.model';
import { throwError, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';
import { DataStorageService } from '../shared/data-storage.service';
import { Profile } from '../profile/profile.model';

@Injectable({providedIn: 'root'})
export class AuthSerivce {
    user = new Subject<User>();

    constructor(private http: HttpClient, private dataStorageService: DataStorageService) {}

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
                        const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
                        const user = new User(
                            resData.email, 
                            resData.localId, 
                            resData.idToken, 
                            expirationDate
                        );
                        this.user.next();
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
            catchError(this.handleError)
        );
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

    private handleAuthentication(email: string, token: string, expiresIn: number) {

    }
}