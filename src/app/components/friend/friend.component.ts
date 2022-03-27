import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { FriendRequest } from 'src/app/models/friend.model';
import { User } from 'src/app/models/user.model';
import { FriendService } from 'src/app/services/friends.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.css'],
})
export class FriendComponent implements OnInit {
  @Input() index: number;
  @Input() friendId: string;

  error: string = null;

  private user: User;

  constructor(
    private friendService: FriendService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.user.pipe(take(1)).subscribe((user) => {
      this.user = user;
    });
  }

  handleCreateRequest() {
    console.log(this.user.userId);
    this.friendService
      .createFriendRequest(this.user.userId, this.friendId)
      .subscribe((res) => {
        console.log(res);
      });
  }
}
