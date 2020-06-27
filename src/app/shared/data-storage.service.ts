import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

import { PostService } from '../post/post.service';
import { Post } from './post.model';
import { ProfileService } from '../profile/profile.service';
import { Comment } from './comment.model';
import { Profile } from '../profile/profile.model';

@Injectable({providedIn: 'root'})
export class DataStorageService {
    constructor(private http: HttpClient, private postService: PostService, private profileService: ProfileService) {}

    createPost(post: Post, route: string, uid: string) {
        this.http.post(
            'https://social-media-project-b27ab.firebaseio.com/posts.json', 
            post
        ).pipe(
            tap(
                response => {
                    this.profileService.addPostToUser(uid, response['name']);
                },
                error => {},
                () => {
                    if (route === 'home') {
                        this.fetchPosts();
                      }
                      else {
                        this.fetchPosts(uid, true);
                      }
                }
            )
        ).subscribe(
            response => {
                console.log();
            }
        );
    }

    fetchPosts(uid: string = '', profilePostsOnly: boolean = false) {
        this.http.get<{[key: string]: Post}>(
            'https://social-media-project-b27ab.firebaseio.com/posts.json'
        ).pipe(
            map(
                posts => {
                    for (let post in posts) {
                        if (posts[post].imagePaths == null) {
                            posts[post].imagePaths = [];
                        }
                        if (posts[post].likes == null) {
                            posts[post].likes = [];
                        }
                        if (posts[post].comments == null) {
                            posts[post].comments = [];
                        }
                    }

                    if (profilePostsOnly) {
                        const profilePosts = this.profileService.getProfilePosts(uid);
                        posts = Object.keys(posts).
                        filter(key => profilePosts.includes(key)).
                        reduce((newPosts, key) => {
                            newPosts[key] = posts[key];
                            return newPosts;
                        }, {});
                    }
                    return posts;
                }
            )
        ).subscribe(
            response => {
                console.log(response);
                this.postService.setPosts(response);
            }
        );
    }

    updatePost(postId: string, post: Post) {
        this.http.put(
            'https://social-media-project-b27ab.firebaseio.com/posts/' + postId + '.json',
            post
        ).subscribe( 
            response => {
                console.log(response);
            }
        )
    }

    likePost(postId: string, likes: string[]) {
        this.http.put(
            'https://social-media-project-b27ab.firebaseio.com/posts/' + postId + '/likes.json',
            likes
        ).subscribe( 
            response => {
                console.log(response);
            }
        )
    }

    commentPost(postId: string, comments: Comment[]) {
        this.http.put(
            'https://social-media-project-b27ab.firebaseio.com/posts/' + postId + '/comments.json',
            comments
        ).subscribe( 
            response => {
                console.log(response);
            }
        )
    }

    // deleteComment(postId: string, commentIndex: number) {
    //     this.http.delete(
    //         'https://social-media-project-b27ab.firebaseio.com/posts/' + postId + '/comments/' + commentIndex + '.json' 
    //     ).subscribe(
    //         response => {
    //             console.log(response);
    //         }
    //     )
    // }

    createProfile(profile: Profile) {
        console.log(profile);
    }

}