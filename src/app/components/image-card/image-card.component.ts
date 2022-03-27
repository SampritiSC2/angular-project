import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { FileUploadService } from 'src/app/services/fileUpload.service';
import { PostService } from 'src/app/services/posts.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-image-card',
  templateUrl: './image-card.component.html',
  styleUrls: ['./image-card.component.css'],
})
export class ImageCardComponent implements OnInit {
  profileImageUrl: SafeUrl = null;
  loadingImageUrl: boolean = false;
  user: User;
  @ViewChild('fileInput') fileInput: ElementRef;

  postsCount: Observable<number>;

  constructor(
    private userService: UserService,
    private fileUploadService: FileUploadService,
    private sanitizer: DomSanitizer,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    const url = localStorage.getItem('profileImageUrl');
    this.userService.user.pipe(take(1)).subscribe((user) => {
      this.user = user;
    });

    //Count posts
    this.postsCount = this.postService.getPostsByUserId(this.user.userId).pipe(
      map((res) => {
        return res.length;
      })
    );

    if (url) {
      this.loadingImageUrl = false;
      this.profileImageUrl = this.sanitizer.bypassSecurityTrustUrl(url);
    } else {
      this.displayProfilePicture(this.user.photoId);
    }
  }

  changeProfilePicture() {
    let fi = this.fileInput.nativeElement;
    if (fi.files && fi.files[0]) {
      let fileToUpload = fi.files[0];
      this.fileUploadService
        .uploadFile(fileToUpload)
        .subscribe((res: { uploadId: string }) => {
          this.displayProfilePicture(res.uploadId);

          this.userService.updateUserPhotoId(res.uploadId);
        });
    }
  }

  private displayProfilePicture(photoId: string) {
    this.loadingImageUrl = true;
    this.fileUploadService.getUploadedFile(photoId).subscribe((res) => {
      localStorage.setItem('profileImageUrl', res);
      this.loadingImageUrl = false;
      this.profileImageUrl = this.sanitizer.bypassSecurityTrustUrl(res);
    });
  }
}
