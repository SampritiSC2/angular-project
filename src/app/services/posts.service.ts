import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { exhaustMap } from 'rxjs/operators';
import { Post } from '../models/post.model';
import { User } from '../models/user.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiBaseUrl: string = 'https://nodejs-fb-app.herokuapp.com/';

  constructor(private userService: UserService, private http: HttpClient) {}

  public createPost(postData: any, userId: string) {
    const token = this.getToken();

    return this.http
      .post<{ message: string }>(
        this.apiBaseUrl + 'posts/createpost',
        postData,
        {
          headers: new HttpHeaders({
            Authorization: `Bearer ${token}`,
          }),
        }
      )
      .pipe(
        exhaustMap((res) => {
          return this.getPostsByUserId(userId);
        })
      );
  }

  public getPostsByUserId(userId: string) {
    const token = this.getToken();

    return this.http.post<Post[]>(
      this.apiBaseUrl + 'posts/findpostbyuserid',
      {
        id: userId,
      },
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
      }
    );
  }

  public deletePostById(postId: string, userId: string) {
    const token = this.getToken();
    return this.http
      .delete(this.apiBaseUrl + 'posts/' + postId, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
      })
      .pipe(
        exhaustMap((res) => {
          return this.getPostsByUserId(userId);
        })
      );
  }

  private getToken() {
    const user: User = JSON.parse(localStorage.getItem('userData'));
    return user.token;
  }
}
