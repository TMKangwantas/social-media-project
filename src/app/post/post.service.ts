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

    likePost(index: number) {
        const currentPost = this.feed[index].likes;

        if (!currentPost.includes('Erika Jay')) {      //Obviously will change later 
            currentPost.push('Erika Jay');
        }
        else {
            currentPost.splice(currentPost.indexOf('Erika Jay'), 1);
        }
        this.postsChanged.next(this.feed.slice());
    }

    closeComments() {
      this.feed.map(p => p.showComments = false);
    }

    commentPost(comment: Comment, index: number) {
        this.feed[index].comments.push(comment);
        this.postsChanged.next(this.feed.slice());
    }

    deletePost(index: number) {
        delete this.feed[index];
        this.postsChanged.next(this.feed.slice());
    }

    deleteComment(postIndex: number, commentIndex: number) {
        this.feed[postIndex].comments.splice(commentIndex, 1);
    }
}