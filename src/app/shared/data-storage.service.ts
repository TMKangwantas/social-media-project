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
            tap(
                response => {
                    let posts: Post[] = [];
                    for (let key in response) {
                        const post = response[key];
                        post.imagePaths = post.imagePaths == null ? [] : post.imagePaths;
                        post.likes = post.likes == null ? [] : post.likes;
                        post.comments = post.comments == null ? [] : post.comments;
                        post.databaseId = key;
                        posts.push(post);
                    }
                    this.postService.setPosts(posts, profilePostsOnly, uid);
                }
            )
        ).subscribe(
            response => {
                console.log(response);
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
        this.http.post(
            'https://social-media-project-b27ab.firebaseio.com/profiles.json',
            profile
        ).pipe(
            tap(
                response => {
                    profile.databaseId = response['name'];
                    this.profileService.addProfile(profile);
                    console.log(profile);
                }
            )
        ).
        subscribe(
            response => {
                console.log(response);
            }
        )
    }

    fetchProfiles() {
        this.http.get<{[key: string]: Profile}>(
            'https://social-media-project-b27ab.firebaseio.com/profiles.json'
        ).pipe(
            tap(
                response => {
                    let profiles: Profile[] = [];
                    for (let key in response) {
                        const profile = response[key];
                        profile.databaseId = key;
                        profile.postIds = profile.postIds == null ? [] : profile.postIds;
                        profiles.push(profile);
                    }
                    this.profileService.setProfiles(profiles);
                }
            )
        ).
        subscribe(
            response => {
                console.log(response);
            }
        )
    }

}