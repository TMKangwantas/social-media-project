import { Component, OnInit, Input, Output } from '@angular/core';
import { Post } from 'src/app/shared/post.model';
import { PostService } from '../post.service';
import { ProfileService } from 'src/app/profile/profile.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { NgForm } from '@angular/forms';
import { Comment } from 'src/app/shared/comment.model';
import { EventEmitter } from 'protractor';

@Component({
  selector: 'app-comment-post',
  templateUrl: './comment-post.component.html',
  styleUrls: ['./comment-post.component.css']
})
export class CommentPostComponent implements OnInit {
  @Input() post: Post;
  @Input() postIndex: number;

  constructor(private postService: PostService, private profileService: ProfileService, private dataStorageService: DataStorageService,
              private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
  }

  onProfileClick(uid: string) {
    this.profileService.setCurrentUser(uid);
    this.postService.closeComments();
    this.router.navigate(['../profile', uid], {relativeTo: this.route});
    this.postService.getProfilePosts(this.profileService.getCurrentUser());
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

}
