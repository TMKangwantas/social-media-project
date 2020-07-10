import { Post } from '../shared/post.model';
import { Comment } from '../shared/comment.model';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class PostService {
    postsChanged = new Subject<Post[]>();
    private feed: Post[] = [];

    constructor() {}

    getAllPosts() {
      return this.feed;
    }

    getProfilePosts(uid: string) {
      this.postsChanged.next(this.feed.filter(p => p.uid === uid));
    }

    getLikes(postId: string) {
      return this.feed.find(p => p.databaseId === postId).likes;
    }

    getComments(postId: string) {
      return this.feed.find(p => p.databaseId === postId).comments;
    }

    setPosts(posts: Post[], profileOnly: boolean, uid: string) {
      this.feed = posts;
      if (profileOnly) {
        this.getProfilePosts(uid);
      }
      else {
        this.postsChanged.next(this.feed.slice());
      }
    }

    likePost(postId: string, uid: string, onHomePage: boolean, currentUser: string) {
        const currentPost = this.feed.find(p => p.databaseId === postId).likes;

        if (currentPost.includes(uid)) {
          currentPost.splice(currentPost.indexOf(uid), 1);
        }
        else {
          currentPost.push(uid);
        }

        if (onHomePage) {
          this.postsChanged.next(this.feed.slice());
        }
        else {
          this.getProfilePosts(currentUser);
        } 
    }

    closeComments() {
      this.feed.map(p => p.showComments = false);
    }

    commentPost(comment: Comment, postId: string, onHomePage: boolean, currentUser: string) {
        this.feed.find(p => p.databaseId === postId).comments.push(comment);
        
        if (onHomePage) {
          this.postsChanged.next(this.feed.slice());
        }
        else {
          this.getProfilePosts(currentUser);
        } 
    }

    deletePost(postId: string, onHomePage: boolean, currentUser: string) {
        this.feed = this.feed.filter(p => p.databaseId != postId);

        if (onHomePage) {
          this.postsChanged.next(this.feed.slice());
        }
        else {
          this.getProfilePosts(currentUser);
        }
    }

    deleteComment(postId: string, commentIndex: number) {
      this.feed.find(p => p.databaseId === postId).comments.splice(commentIndex, 1);
    }
}