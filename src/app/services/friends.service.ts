import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { exhaustMap, map, tap } from 'rxjs/operators';
import { FriendRequest } from '../models/friend.model';
import { User } from '../models/user.model';

export interface Person {
  id: string;
  friendId: string;
  status: string;
  index: number;
}

@Injectable({
  providedIn: 'root',
})
export class FriendService {
  private apiBaseUrl: string = 'https://nodejs-fb-app.herokuapp.com/';
  persons: Set<string>;
  personsSubject = new Subject<Set<string>>();

  constructor(private http: HttpClient) {}

  public getAllFriendRequest(userId: string) {
    const token = this.getToken();

    this.http
      .get<FriendRequest[]>(this.apiBaseUrl + 'friends/', {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
      })
      .pipe(
        map((resp: FriendRequest[]) => {
          console.log(resp);
          this.persons = this.handleFriendRequestResponse(resp, userId);
          this.personsSubject.next(this.persons);
        })
      )
      .subscribe();
  }

  public dummy() {
    const token = this.getToken();
    this.http
      .get(this.apiBaseUrl + 'files/61e047561f3b7e0004020495', {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
        responseType: 'blob',
      })
      .subscribe((res) => {
        let blob = new Blob([res as BlobPart], { type: 'image/png' });
        let src = URL.createObjectURL(blob);
        console.log(src);
      });
  }

  public createFriendRequest(userId: string, friendId: string) {
    const token = this.getToken();
    return this.http
      .post(
        this.apiBaseUrl + 'friends/createrequest',
        {
          userId,
          friendId,
          status: 'Request Pending',
        },
        {
          headers: new HttpHeaders({
            Authorization: `Bearer ${token}`,
          }),
        }
      )
      .pipe(
        tap((res) => {
          this.persons.delete(friendId);
          this.personsSubject.next(this.persons);
        })
      );
  }

  public getAllFriends(userId: string) {
    const token = this.getToken();
    return this.http
      .get<FriendRequest[]>(this.apiBaseUrl + 'friends/', {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
      })
      .pipe(
        map((resp) => {
          return this.getFriends(resp, userId);
        })
      );
  }

  public getFullName() {}

  private getToken() {
    const user: User = JSON.parse(localStorage.getItem('userData'));
    return user.token;
  }

  private handleFriendRequestResponse(
    friendRequests: FriendRequest[],
    userId: string
  ) {
    const uniqueUsers = new Set<string>();
    for (let request of friendRequests) {
      if (
        request.userId !== userId &&
        request.status !== 'You are friend' &&
        request.status !== 'You are a friend' &&
        request.status !== 'You are friends'
      ) {
        uniqueUsers.add(request.userId);
      }
    }

    return uniqueUsers;
  }

  public updateFriendRequest() {
    const user: User = JSON.parse(localStorage.getItem('userData'));

    this.http
      .put(
        'https://nodejs-fb-app.herokuapp.com/friends/61e302eeba178a0004ff3f9b',
        {
          userId: user.userId,
          friendId: '612491697355270004df7fe1',
          status: 'You are friend',
        },
        {
          headers: new HttpHeaders({
            Authorization: `Bearer ${user.token}`,
          }),
        }
      )
      .subscribe((res) => {
        console.log(res);
      });
  }

  private getFriends(requests: FriendRequest[], userId: string) {
    const friends: { index: number; friendId: string }[] = [];

    for (let i = 0; i < requests.length; i++) {
      const request = requests[i];
      if (
        (request.status === 'You are friend' ||
          request.status === 'You are a friend' ||
          request.status === 'You are friends') &&
        request.userId === userId
      ) {
        friends.push({
          index: i + 1,
          friendId: request.friendId,
        });
      }
    }

    return friends;
  }
}
