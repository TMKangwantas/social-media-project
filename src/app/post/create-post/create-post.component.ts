import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

import { PostService } from '../post.service';
import { Post } from 'src/app/shared/post.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from 'src/app/profile/profile.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
  addImages = false;
  createPostForm: FormGroup

  constructor( private postService: PostService, private profileService: ProfileService,
                private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.initForm();
  }

  onSubmit(form: NgForm) {
    const imagePaths = [];

    for (let path of this.createPostForm.value['imagePaths']) {
      imagePaths.push(path['imagePath']);
    }

    console.log(imagePaths)

    const newPost = new Post(
      this.profileService.getUid(),
      this.createPostForm.value['postBody'],
      imagePaths,
      [],
      []
    );
    
    this.postService.addPost(newPost);

    console.log(newPost);
    this.onCancel();
  }

  onCancel() {
    this.createPostForm.reset();
    (<FormArray>this.createPostForm.get('imagePaths')).clear();
  }

  onAddImages() {
    (<FormArray>this.createPostForm.get('imagePaths')).push(
      new FormGroup({
        'imagePath': new FormControl('', Validators.required)
      })
    );
  }

  onDeleteImagePath(index: number) {
    (<FormArray>this.createPostForm.get('imagePaths')).removeAt(index);
  }

  private initForm() {
    let postBody = '';
    let imagePaths = new FormArray([]);
    this.createPostForm = new FormGroup({
      'postBody': new FormControl(postBody, Validators.required),
      'imagePaths': imagePaths
    });
  }

  get controls() {
    return (<FormArray>this.createPostForm.get('imagePaths')).controls;
  }

}
