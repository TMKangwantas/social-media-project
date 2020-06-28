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
  feed: Post[] = [];

  constructor(private postService: PostService, private profileService: ProfileService, private dataStorageService: DataStorageService,
              private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.subscription = this.postService.postsChanged.subscribe(
      (feed: Post[]) => {
        this.feed = feed;
      }
    );
    
    if (this.route.snapshot.routeConfig.path === "home") {
      this.feed = this.postService.getAllPosts();
      this.dataStorageService.fetchPosts();
    }
    else {
      this.postService.getProfilePosts(this.profileService.getCurrentUser());
    }
  }

  onProfileClick(uid: string) {
    this.profileService.setCurrentUser(uid);
    this.closeComments();
    this.router.navigate(['../profile', uid], {relativeTo: this.route});
    this.postService.getProfilePosts(this.profileService.getCurrentUser());
  }

  onLike(index: number, databaseId: string) {
    this.postService.likePost(index);
    this.dataStorageService.likePost(databaseId, this.postService.getLikes(index));
  }

  onComment(form: NgForm, databaseId: string, index: number) {
    if (!form.valid)
      return;

    const comment = new Comment(
      '123',
      'Erika',
      'Jay',
      form.value.comment
    )
    this.postService.commentPost(comment, index);
    this.dataStorageService.commentPost(databaseId, this.postService.getComments(index));
    form.reset();
  }

  onDeleteComment(postIndex: number, commentIndex: number, databaseId: string) {
    //TODO: Only allow owner of comments to delete comments,
    //for now, allow anyone to delete comments
    this.postService.deleteComment(postIndex, commentIndex);
    this.dataStorageService.commentPost(databaseId, this.postService.getComments(postIndex));
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
