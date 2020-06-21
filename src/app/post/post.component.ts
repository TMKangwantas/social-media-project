import { Component, OnInit, OnDestroy, Input, OnChanges } from '@angular/core';

import { Post } from '../shared/post.model';
import { PostService } from './post.service';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { Comment } from '../shared/comment.model';
import { ActivatedRoute, Router} from '@angular/router';
import { ProfileService } from '../profile/profile.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit, OnDestroy {
  showComments = false;
  subscription: Subscription;
  comment: string;
  feed: Post[] = [];

  constructor(private postService: PostService, private profileService: ProfileService,
              private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.subscription = this.postService.postsChanged.subscribe(
      (feed: Post[]) => {
        this.feed = feed;
      }
    );

    if (this.route.snapshot.routeConfig.path === "home") {
      this.feed = this.postService.getAllPosts();
    }
    else {
          this.postService.getProfilePosts(this.profileService.getCurrentUser());
    }
  }

  onProfileClick(uid: string) {
    this.profileService.setCurrentUser(uid);
    this.router.navigate(['../profile', uid], {relativeTo: this.route});
    this.postService.getProfilePosts(this.profileService.getCurrentUser());
  }

  onLike(index: number) {
    this.postService.likePost(index);
  }

  onComment(form: NgForm, index: number) {
    if (!form.valid)
      return;

    const comment = new Comment(
      'uid',
      'Erika',
      'Jay',
      form.value.comment
    )
    this.postService.commentPost(comment, index);
    form.reset();
  }

  onShowComments() {
    this.showComments = !this.showComments;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
