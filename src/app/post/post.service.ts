import { Post } from '../shared/post.model';
import { Comment } from '../shared/comment.model';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { ProfileService } from '../profile/profile.service';

@Injectable()
export class PostService {
    postsChanged = new Subject<Post[]>();
    private feed: Post[] = [];

    constructor(private profileService: ProfileService) {}

    getAllPosts() {
      return this.feed;
    }

    getProfilePosts(uid: string) {
      console.log(this.feed);
      this.postsChanged.next(this.feed.filter(p => p.uid === uid));
    }

    getLikes(index: number) {
      return this.feed[index].likes;
    }

    getComments(index: number) {
      return this.feed[index].comments;
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

        console.log(this.feed);

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

    deletePost(index: number) {
        delete this.feed[index];
        this.postsChanged.next(this.feed.slice());
    }

    deleteComment(postIndex: number, commentIndex: number) {
        this.feed[postIndex].comments.splice(commentIndex, 1);
    }
}