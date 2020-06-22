import { Component, OnInit, OnDestroy} from '@angular/core';

import { Post } from '../shared/post.model';
import { PostService } from './post.service';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { Comment } from '../shared/comment.model';
import { ActivatedRoute, Router} from '@angular/router';
import { ProfileService } from '../profile/profile.service';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  comment: string;
  feed: {[key: string]: Post} = {};

  constructor(private postService: PostService, private profileService: ProfileService, private dataStorageService: DataStorageService,
              private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.subscription = this.postService.postsChanged.subscribe(
      (feed: {[key: string]: Post}) => {
        this.feed = feed;
      }
    );
    
    if (this.route.snapshot.routeConfig.path === "home") {
      this.feed = this.postService.getAllPosts();
      this.dataStorageService.fetchPosts();
    }
    else {
      this.postService.getProfilePosts(this.profileService.getCurrentUser());
      this.dataStorageService.fetchPosts(this.profileService.getCurrentUser(), true);
    }
  }

  onProfileClick(uid: string) {
    this.profileService.setCurrentUser(uid);
    this.closeComments();
    this.router.navigate(['../profile', uid], {relativeTo: this.route});
    this.postService.getProfilePosts(this.profileService.getCurrentUser());
  }

  onLike(key: string) {
    this.postService.likePost(key);
    this.dataStorageService.likePost(key, this.postService.getLikes(key));
  }

  onComment(form: NgForm, key: string) {
    if (!form.valid)
      return;

    const comment = new Comment(
      '123',
      'Erika',
      'Jay',
      form.value.comment
    )
    this.postService.commentPost(comment, key);
    this.dataStorageService.commentPost(key, this.postService.getComments(key));
    form.reset();
  }

  onDeleteComment(index: number, key: string) {
    //TODO: Only allow owner of comments to delete comments,
    //for now, allow anyone to delete comments
    this.postService.deleteComment(index, key);
    this.dataStorageService.commentPost(key, this.postService.getComments(key));
  }

  onShowComments(index: number) {
    this.feed[index].showComments = !this.feed[index].showComments;
  }

  private closeComments() {
    for (let posts in this.feed) {
      this.feed[posts].showComments = false;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
