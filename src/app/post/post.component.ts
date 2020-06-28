import { Component, OnInit, OnDestroy} from '@angular/core';

import { Post } from '../shared/post.model';
import { PostService } from './post.service';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { Comment } from '../shared/comment.model';
import { ActivatedRoute, Router} from '@angular/router';
import { ProfileService } from '../profile/profile.service';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  userSub: Subscription;
  comment: string;
  uid: string = '';
  feed: Post[] = [];
  onHome: boolean;

  constructor(private postService: PostService, 
              private profileService: ProfileService, 
              private dataStorageService: DataStorageService,
              private authService: AuthService,
              private route: ActivatedRoute, 
              private router: Router
            ) { }

  ngOnInit() {
    this.subscription = this.postService.postsChanged.subscribe(
      (feed: Post[]) => {
        this.feed = feed;
      }
    );

    this.userSub = this.authService.user.subscribe(
      user => {
        this.uid = user.id;
      }
    )

    if (this.profileService.getProfileCount() == 0) {
      this.dataStorageService.fetchProfiles();
    }

    this.onHome = this.route.snapshot.routeConfig.path === "home";
    
    if (this.onHome) {
      this.feed = this.postService.getAllPosts();
      this.dataStorageService.fetchPosts();
    }
    else {
      this.postService.getProfilePosts(this.profileService.getCurrentUser());
    }
  }

  onProfileClick(uid: string) {
    this.profileService.setCurrentUser(uid);
    this.postService.closeComments();
    this.router.navigate(['../profile', uid], {relativeTo: this.route});
    this.postService.getProfilePosts(this.profileService.getCurrentUser());
  }

  onShowComments(index: number) {
    this.feed[index].showComments = !this.feed[index].showComments;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.userSub.unsubscribe();
  }

}
