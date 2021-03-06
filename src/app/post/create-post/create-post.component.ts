import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

import { PostService } from '../post.service';
import { Post } from 'src/app/shared/post.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from 'src/app/profile/profile.service';
import { Profile } from 'src/app/profile/profile.model';
import { DataStorageService } from 'src/app/shared/data-storage.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {
  addImages = false;
  createPostForm: FormGroup;
  currentUid: string;
  @Input() uid: string;

  constructor( private postService: PostService, private profileService: ProfileService, private dataStorageService: DataStorageService,
                private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.initForm();
  }

  onSubmit() {
    const imagePaths = [];

    for (let path of this.createPostForm.value['imagePaths']) {
      imagePaths.push(path['imagePath']);
      }
    const profile: Profile = this.profileService.getProfile(this.uid);

    const newPost = new Post( 
      profile.uid,
      profile.databaseId,
      profile.firstName,
      profile.lastName,
      this.createPostForm.value['postBody'],
      imagePaths
    );
    
    this.dataStorageService.createPost(newPost, this.route.routeConfig.path, profile.uid);
    
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
