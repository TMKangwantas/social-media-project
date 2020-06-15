import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { PostService } from '../post.service';
import { Post } from 'src/app/shared/post.model';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {

  constructor(private postService: PostService) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const newPost = new Post(
      'Erika Jay',
      form.value.post,
      [],
      [],
      []
    );

    console.log(newPost);
    this.postService.addPost(
      newPost
    );

    form.reset();
  }

}
