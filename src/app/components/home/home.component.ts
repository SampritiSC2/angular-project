import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Post } from 'src/app/models/post.model';
import { User } from 'src/app/models/user.model';
import { FileUploadService } from 'src/app/services/fileUpload.service';
import { PostService } from 'src/app/services/posts.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public user: User;
  uploadForm: FormGroup;
  message: string = null;
  loading: boolean = false;
  postsSubscription: Subscription;
  addedPostsSubscription: Subscription;
  updatedPostsSubscription: Subscription;
  loadedPosts: Post[] = [];

  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(
    private userService: UserService,
    private postService: PostService,
    private uploadService: FileUploadService
  ) {}

  ngOnInit(): void {
    this.initialiseForm();

    this.userService.user.pipe(take(1)).subscribe((user) => {
      this.user = user;
      console.log(this.user);
    });

    this.loading = true;

    this.postsSubscription = this.postService
      .getPostsByUserId(this.user.userId)
      .subscribe((posts) => {
        console.log(posts);
        this.loadedPosts = posts;
        this.loading = false;
      });
  }

  closeAlert() {
    this.message = null;
  }

  // addFile(): void {
  //   let fi = this.fileInput.nativeElement;
  //   if (fi.files && fi.files[0]) {
  //     let fileToUpload = fi.files[0];
  //     this.uploadService.uploadFile(fileToUpload).subscribe((res) => {
  //       console.log(res);
  //     });
  //   }
  // }

  handlePostSubmit() {
    this.loading = true;
    const uploadData: any = {
      ...this.uploadForm.value,
      userId: this.user.userId,
      userName: this.user.firstName + ' ' + this.user.lastName,
      userPhotoId: this.user.photoId,
      postImageId: null,
      isActive: this.user.isActive,
      isAdmin: this.user.isAdmin,
    };

    let fi = this.fileInput.nativeElement;
    if (fi.files && fi.files[0]) {
      let fileToUpload = fi.files[0];
      this.uploadService.uploadFile(fileToUpload).subscribe((res: any) => {
        uploadData.postImageId = res.uploadId;
        this.addedPostsSubscription = this.postService
          .createPost(uploadData, this.user.userId)
          .subscribe((posts) => {
            console.log(posts);
            this.loadedPosts = posts;
            this.message = 'Post added Successfully';
            this.loading = false;

            // this.resetForm();
          });
      });
    }
  }

  private initialiseForm() {
    this.uploadForm = new FormGroup({
      post: new FormControl(null, Validators.required),
      profession: new FormControl('President'),
      file: new FormControl(null, Validators.required),
    });
  }

  private resetForm() {
    this.uploadForm.reset();
    // this.fileInput.nativeElement.value = '';
  }

  handleDelete(postId: string) {
    this.loading = true;
    this.updatedPostsSubscription = this.postService
      .deletePostById(postId, this.user.userId)
      .subscribe((updatedPosts) => {
        this.loadedPosts = updatedPosts;
        this.loading = false;
      });
  }

  ngOnDestroy(): void {
    this.postsSubscription.unsubscribe();
    if (this.updatedPostsSubscription) {
      this.updatedPostsSubscription.unsubscribe();
    }

    if (this.addedPostsSubscription) {
      this.addedPostsSubscription.unsubscribe();
    }
  }
}
