import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Post } from 'src/app/shared/post.model';
import { PostService } from '../post.service';
import { ProfileService } from 'src/app/profile/profile.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { NgForm } from '@angular/forms';
import { Comment } from 'src/app/shared/comment.model';
import { Profile } from 'src/app/profile/profile.model';

@Component({
  selector: 'app-comment-post',
  templateUrl: './comment-post.component.html',
  styleUrls: ['./comment-post.component.scss']
})
export class CommentPostComponent implements OnInit {
  @Input() post: Post;
  @Input() postIndex: number;
  @Input() uid: string;
  @Input() onHome: boolean;
  @Output() profileClick = new EventEmitter<string>();

  constructor(private postService: PostService, private profileService: ProfileService, private dataStorageService: DataStorageService,
              private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
  }

  onProfileClick(uid: string) {
    this.profileClick.emit(uid);
  }

  onComment(form: NgForm) {
    if (!form.valid)
      return;

    const profile: Profile = this.profileService.getProfile(this.uid);

    const comment = new Comment(
      this.uid,
      profile.firstName,
      profile.lastName,
      form.value.comment
    )
    this.postService.commentPost(comment, this.post.databaseId, this.onHome, this.profileService.getCurrentUser());
    this.dataStorageService.commentPost(this.post.databaseId, this.postService.getComments(this.post.databaseId));
    form.reset();
  }

  onDeleteComment(index: number) {
    this.postService.deleteComment(this.post.databaseId, index);
    this.dataStorageService.commentPost(this.post.databaseId, this.postService.getComments(this.post.databaseId));
  }

}
