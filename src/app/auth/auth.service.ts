import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthResponseData } from './auth-response-data.model';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AuthSerivce {
    constructor(private http: HttpClient) {}

    signup(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyB0Z7C9nIGqUzwkewTo4_6G1BWCJC-3frE',
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
            ).pipe(
                catchError(this.handleError)
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
}