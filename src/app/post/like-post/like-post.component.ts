import { Component, OnInit, Input } from '@angular/core';
import { Post } from 'src/app/shared/post.model';
import { PostService } from '../post.service';
import { DataStorageService } from 'src/app/shared/data-storage.service';

@Component({
  selector: 'app-like-post',
  templateUrl: './like-post.component.html',
  styleUrls: ['./like-post.component.css']
})
export class LikePostComponent implements OnInit {
  @Input() post: Post;
  @Input() index: number;

  constructor(private postService: PostService, private dataStorageService: DataStorageService) { }

  ngOnInit() {
  }

  onLike(index: number, databaseId: string) {
    this.postService.likePost(index);
    this.dataStorageService.likePost(databaseId, this.postService.getLikes(index));
  }

}
