import { Component, OnInit, OnDestroy } from '@angular/core';

import { Post } from '../shared/post.model';
import { PostService } from './post.service';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { Comment } from '../shared/comment.model';
import { ActivatedRoute } from '@angular/router';

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

  constructor(private postService: PostService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.subscription = this.postService.postsChanged.subscribe(
      (feed: Post[]) => {
        this.feed = feed;
      }
    );
    
    const urlPath = this.route.snapshot.routeConfig.path;

    if (urlPath === "home") {
      this.feed = this.postService.getAllPosts();
    }
    else {
      this.feed = this.postService.getProfilePosts();
    }
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
