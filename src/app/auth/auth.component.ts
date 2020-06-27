import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';
import { AuthResponseData } from './auth-response-data.model';
import { DataStorageService } from '../shared/data-storage.service';
import { Profile } from '../profile/profile.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent {
    isLoginMode = true;
    isLoading = false;
    error: string = null;
    profile: Profile;

    constructor(private authService: AuthService, private dataStorageService: DataStorageService,
                private router: Router) {}

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm) {
        if (!form.valid) {
            return;
        }

        const email = form.value.email;
        const password = form.value.password;
        
        let authObs: Observable<AuthResponseData>;
        let uid: string;

        this.isLoading = true;
        if (this.isLoginMode) {
            authObs = this.authService.login(email, password);
        }
        else {
            authObs = this.authService.signup(
                new Profile(
                    '',
                    form.value.firstName,
                    form.value.lastName,
                    email,
                    form.value.city + ' ' + form.value.state,
                    form.value.profileImagePath
                ),
                password
            );
        }

        authObs.subscribe(
            response => {
                console.log(response);
                this.isLoading = false;
                this.router.navigate(['/home']);
            },
            errorMessage => {
                console.log(errorMessage);
                this.error = errorMessage;
                this.isLoading = false;
            }
        );
        
        form.reset();
    }
} 