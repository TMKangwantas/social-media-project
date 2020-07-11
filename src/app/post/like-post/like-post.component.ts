import { Component, OnInit, Input } from '@angular/core';
import { Post } from 'src/app/shared/post.model';
import { PostService } from '../post.service';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { ProfileService } from 'src/app/profile/profile.service';

@Component({
  selector: 'app-like-post',
  templateUrl: './like-post.component.html',
  styleUrls: ['./like-post.component.scss']
})
export class LikePostComponent implements OnInit {
  @Input() post: Post;
  @Input() index: number;
  @Input() uid: string;
  @Input() onHome: boolean;

  constructor(private postService: PostService, private profileService: ProfileService, private dataStorageService: DataStorageService) { }

  ngOnInit() {
  }

  onLike() {
    this.postService.likePost(this.post.databaseId, this.uid, this.onHome, this.profileService.getCurrentUser());
    this.dataStorageService.likePost(this.post.databaseId, this.postService.getLikes(this.post.databaseId));
  }

}
