import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostComponent } from './post/post.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileDetailsComponent } from './profile/profile-details/profile-details.component';
import { AuthComponent } from './auth/auth.component';

const appRoutes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full'},
    { path: 'home', component: PostComponent },
    { path: 'profile', component: ProfileComponent, 
        children: [
            {path: ':uid', component: ProfileDetailsComponent}
        ] 
    },
    { path: 'auth', component: AuthComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})

export class AppRoutingModules {

}