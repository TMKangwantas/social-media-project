import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

import { AuthSerivce } from './auth.service';
import { AuthResponseData } from './auth-response-data.model';
import { DataStorageService } from '../shared/data-storage.service';
import { Profile } from '../profile/profile.model';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent {
    isLoginMode = true;
    isLoading = false;
    error: string = null;
    profile: Profile;

    constructor(private authService: AuthSerivce, private dataStorageService: DataStorageService) {}

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
            authObs = this.authService.signup(email, password);
            this.profile = new Profile(
                '',
                form.value.firstName,
                form.value.lastName,
                email,
                form.value.city + ' ' + form.value.state,
                form.value.profileImagePath
            );
        }

        authObs.subscribe(
            response => {
                console.log(response);
                if (!this.isLoginMode) {
                    uid = response.localId;
                }
                this.isLoading = false;
            },
            errorMessage => {
                console.log(errorMessage);
                this.error = errorMessage;
                this.isLoading = false;
            },
            () => {
                if (!this.isLoginMode) {
                    this.profile.uid = uid;
                    this.dataStorageService.createProfile(this.profile);
                }
            }
        );
        
        form.reset();
    }

    login(email: string, password: string) {

    }
} 