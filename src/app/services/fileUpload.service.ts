import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { map, tap } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private apiBaseUrl: string = 'https://nodejs-fb-app.herokuapp.com/';
  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  public uploadFile(fileToUpload: any) {
    const token = this.getToken();
    let input = new FormData();
    input.append('picture', fileToUpload);

    return this.http.post(this.apiBaseUrl + 'files/uploadfile', input, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    });
  }

  public getUploadedFile(photoId: string) {
    const token = this.getToken();

    return this.http
      .get(this.apiBaseUrl + 'files/' + photoId, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
        responseType: 'blob',
      })
      .pipe(
        map((res) => {
          const blob = new Blob([res], { type: 'image/png' });
          const src = URL.createObjectURL(blob);
          return src;
        })
      );
  }

  private getToken() {
    const user: User = JSON.parse(localStorage.getItem('userData'));
    return user.token;
  }
}
