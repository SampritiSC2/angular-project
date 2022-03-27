import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, of, Subject, throwError } from 'rxjs';
import { catchError, exhaustMap, map, take, tap } from 'rxjs/operators';
import { User } from '../models/user.model';

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  gender: string;
  password: string;
}

export interface LoginResponse {
  createdDate: string;
  dob: string;
  email: string;
  firstName: string;
  gender: string;
  isActive: boolean;
  isAdmin: boolean;
  lastName: string;
  photoId: string;
  token: string;
  __v: number;
  _id: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user = new BehaviorSubject<User>(null);
  errorSubject = new Subject<string>();

  constructor(private http: HttpClient, private router: Router) {}

  private apiBaseUrl: string = 'https://nodejs-fb-app.herokuapp.com/';

  public register(registerData: RegisterRequest) {
    const dateString = this.getDobString(registerData.dob);
    const newUser = { ...registerData, dob: dateString };
    console.log(newUser);

    return this.http.post<{ message: string }>(
      this.apiBaseUrl + 'users/register',
      newUser
    );
  }

  public login(email: string, password: string) {
    return this.http
      .post<LoginResponse>(this.apiBaseUrl + 'users/authenticate', {
        email,
        password,
      })
      .pipe(
        tap((responseData) => {
          const user = new User(
            responseData.firstName,
            responseData.lastName,
            responseData.email,
            responseData.gender,
            responseData.dob,
            responseData.isAdmin,
            responseData.isActive,
            responseData.token,
            responseData.photoId,
            responseData._id
          );

          localStorage.setItem('userData', JSON.stringify(user));
          this.user.next(user);
        }),
        catchError((error: HttpErrorResponse) => {
          if (!error.error || !error.error.message) {
            return throwError(error);
          }

          this.errorSubject.next(error.error.message);
          return throwError(error);
        })
      );
  }

  public logout() {
    this.user.next(null);
    localStorage.removeItem('userData');
    localStorage.removeItem('profileImageUrl');
    this.router.navigate(['/login']);
  }

  public getAllUsers() {
    const token = this.getToken();

    return this.http.get(this.apiBaseUrl + 'users', {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    });
  }

  public findUserById() {
    return this.user.pipe(
      take(1),
      exhaustMap((user) => {
        console.log(user);
        return this.http.get<User>(this.apiBaseUrl + 'users/' + user.userId, {
          headers: new HttpHeaders({
            Authorization: `Bearer ${user.token}`,
          }),
        });
      })
    );
  }

  public findUserByGivenId(userId: string) {
    const token = this.getToken();

    return this.http.get<User>(this.apiBaseUrl + 'users/' + userId, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    });
  }

  public findUserByEmail(emailId: string) {
    // const token = this.getToken();
    return this.http.post(this.apiBaseUrl + 'users/finduserbyemail', {
      email: emailId,
    });
  }

  private getToken() {
    const user: User = JSON.parse(localStorage.getItem('userData'));
    return user.token;
  }

  public updateUserPhotoId(photoId: string) {
    this.user.pipe(take(1)).subscribe((user) => {
      this.http
        .post(
          this.apiBaseUrl + 'users/updateuserphotoId',
          {
            id: user.userId,
            photoId: photoId,
          },
          {
            headers: new HttpHeaders({
              Authorization: `Bearer ${user.token}`,
            }),
          }
        )
        .subscribe((responseData) => {
          console.log(responseData);
        });
    });
  }

  public updateUser(userData: any) {
    return this.user.pipe(
      take(1),
      exhaustMap((user) => {
        return this.http.put(
          this.apiBaseUrl + 'users/' + user.userId,
          userData,
          {
            headers: new HttpHeaders({
              Authorization: `Bearer ${user.token}`,
            }),
          }
        );
      })
    );
  }

  public autoLogin() {
    const loggedInUser: User = JSON.parse(localStorage.getItem('userData'));

    if (!loggedInUser) {
      this.user.next(null);
      this.router.navigate(['/login']);
      return;
    }

    this.user.next(loggedInUser);
  }

  public updateExistingUserData() {
    this.findUserById().subscribe((user) => {
      const currentUser = JSON.parse(localStorage.getItem('userData'));

      const updatedUser = {
        ...currentUser,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        dob: user.dob,
        gender: user.gender,
      };

      localStorage.setItem('userData', JSON.stringify(updatedUser));
      this.user.next(updatedUser);
    });
  }

  private getDobString(str: string) {
    const dateObj = new Date(str);

    let date = dateObj.getDate().toString();
    let month = (dateObj.getMonth() + 1).toString();

    date = date.length === 1 ? '0' + date : date;
    month = month.length === 1 ? '0' + month : month;

    const dateString = date + '/' + month + '/' + dateObj.getFullYear();
    return dateString;
  }
}
