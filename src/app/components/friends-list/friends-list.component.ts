import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { FriendService } from 'src/app/services/friends.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.css'],
})
export class FriendsListComponent implements OnInit {
  loadedFriends: { friendId: string; index: number }[];
  user: User;

  constructor(
    private friendService: FriendService,
    private userService: UserService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadUser();

    this.friendService.updateFriendRequest();

    this.friendService.getAllFriends(this.user.userId).subscribe((res) => {
      this.loadedFriends = res;
    });
  }

  private loadUser() {
    this.userService.user.pipe(take(1)).subscribe((user) => {
      this.user = user;
    });
  }
}
