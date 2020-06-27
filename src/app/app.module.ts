import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { PostComponent } from './post/post.component';
import { CreatePostComponent } from './post/create-post/create-post.component';
import { PostService } from './post/post.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './profile/profile.component';
import { AppRoutingModules } from './app-routing.module';
import { ProfileDetailsComponent } from './profile/profile-details/profile-details.component';
import { ProfileService } from './profile/profile.service';
import { AuthComponent } from './auth/auth.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { LikePostComponent } from './post/like-post/like-post.component';
import { CommentPostComponent } from './post/comment-post/comment-post.component';
import { AuthInterceptorService } from './auth/auth-interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PostComponent,
    CreatePostComponent,
    ProfileComponent,
    ProfileDetailsComponent,
    AuthComponent,
    LoadingSpinnerComponent,
    LikePostComponent,
    CommentPostComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModules,
    HttpClientModule
  ],
  providers: [
    PostService,
    ProfileService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
