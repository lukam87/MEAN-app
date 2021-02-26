import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/core/auth.service';
import { mimeType } from '../core/mime-type.validator';
import { PostService } from '../core/post.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit, OnDestroy {
  mode = 'create';
  postId: any = '';
  post: any;
  submitBtn = 'Save Post';
  isLoading: boolean = false;
  postsForm: any;
  imagePreview: any = '';
  private authStatusSub: Subscription;

  constructor(
    private postService: PostService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });
  }

  ngOnInit(): void {
    this.createForm();
    this.createOrEditPost();
  }

  createForm() {
    this.postsForm = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, Validators.required),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });
  }

  private createOrEditPost() {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe((postData) => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath,
            creator: postData.creator,
          };
          this.postsForm.setValue({
            title: postData.title,
            content: postData.content,
            image: postData.imagePath,
          });
        });
        this.submitBtn = 'Edit Post';
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onImageUpPicked(event: Event | any) {
    const file = event.target.files[0];

    this.postsForm.patchValue({ image: file });
    this.postsForm.get('image').updateValueAndValidity();
    let reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postService.addPost(
        this.postsForm.value.title,
        this.postsForm.value.content,
        this.postsForm.value.image
      );
    } else {
      this.postService.updatePost(
        this.postId,
        this.postsForm.value.title,
        this.postsForm.value.content,
        this.postsForm.value.image
      );
    }
    this.postsForm.reset();
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
