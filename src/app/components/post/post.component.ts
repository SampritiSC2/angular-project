import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Post } from 'src/app/models/post.model';
import { FileUploadService } from 'src/app/services/fileUpload.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  @Input() post: Post;
  @Output() onHandleDelete = new EventEmitter<string>();
  loadingImage: boolean = false;
  imageUrl: SafeUrl;

  constructor(
    private fileUploadService: FileUploadService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadingImage = true;
    this.fileUploadService
      .getUploadedFile(this.post.postImageId)
      .subscribe((res) => {
        this.loadingImage = false;
        this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(res);
      });
  }

  deleteHandler(id: string) {
    this.onHandleDelete.emit(id);
  }
}
