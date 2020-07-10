import { Component, OnInit, OnDestroy} from '@angular/core';

import { Post } from '../shared/post.model';
import { PostService } from './post.service';
import { Subscription } from 'rxjs';
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
  canPost: boolean = true;

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

    this.profileService.getProfileFromLocalStorage();

    this.onHome = this.route.snapshot.routeConfig.path === "home";
    
    if (this.onHome) {
      this.canPost = true;
      this.feed = this.postService.getAllPosts();
      this.dataStorageService.fetchPosts();
    }
    else {
      this.dataStorageService.fetchPosts(this.profileService.getCurrentUser(), true);
      this.postService.getProfilePosts(this.profileService.getCurrentUser());
      const userData: {
        email: string;
        id: string;
        _token: string;
        _tokenExpirationDate: string;
      } = JSON.parse(localStorage.getItem('userData'));

      if (this.profileService.getCurrentUser() == userData.id) {
        this.canPost = true;
      }
      else {
        this.canPost = false;
      }
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

  onDeletePost(postId: string) {
    this.postService.deletePost(postId, this.onHome, this.profileService.getCurrentUser());
    this.dataStorageService.deletePost(postId);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.userSub.unsubscribe();
  }

}
