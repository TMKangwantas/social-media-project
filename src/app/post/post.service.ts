import { Post } from '../shared/post.model';
import { Comment } from '../shared/comment.model';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { ProfileService } from '../profile/profile.service';

@Injectable({providedIn: 'root'})
export class PostService {
    postsChanged = new Subject<{[key: string]: Post}>();
    private feed: {[key: string] : Post} = {};

    constructor(private profileService: ProfileService) {}

    getAllPosts() {
      return this.feed;
    }

    getProfilePosts(uid: string) {
      const profilePosts = this.profileService.getProfilePosts(uid);
      if (profilePosts.length === 0) {
        this.postsChanged.next({});
      }
      else {
        var filteredPosts = Object.keys(this.feed).
        filter(key => profilePosts.includes(key)).
        reduce((newPosts, key) => {
          newPosts[key] = this.feed[key];
          return newPosts;
        }, {});
      this.postsChanged.next(filteredPosts);
      }
    }

    getLikes(postId: string) {
      return this.feed[postId].likes;
    }

    getComments(postId: string) {
      return this.feed[postId].comments;
    }

    setPosts(posts: {[key: string]: Post}) {
      this.feed = posts;
      this.postsChanged.next(this.feed);
    }

    addPost(post: Post, createdOnHomePage: boolean, uid: string = null) {
        // this.dataStorageService.storePost(post);
        // this.dataStorageService.fetchPosts();
        // if (createdOnHomePage) {
        //   this.postsChanged.next(this.feed);
        // }
        // else {
        //   this.getProfilePosts(uid);
        // }
    }

    likePost(key: string) {
        const currentPost = this.feed[key].likes;

        if (!currentPost.includes('Erika Jay')) {      //Obviously will change later 
            currentPost.push('Erika Jay');
        }
        else {
            currentPost.splice(currentPost.indexOf('Erika Jay'), 1);
        }
        this.postsChanged.next(this.feed);
    }

    commentPost(comment: Comment, key: string) {
        this.feed[key].comments.push(comment);
        this.postsChanged.next(this.feed);
    }

    deletePost(key: string) {
        delete this.feed[key];
        this.postsChanged.next(this.feed);
    }

    deleteComment(index: number, key: string) {
        this.feed[key].comments.splice(index, 1);
    }
}