import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { FriendService, Person } from 'src/app/services/friends.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css'],
})
export class NetworkComponent implements OnInit, OnDestroy {
  private user: User;
  loadedUsersList: string[] = [];
  loadingFriends: boolean;
  personsSubsription: Subscription;

  constructor(
    private frindService: FriendService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.frindService.dummy();
    this.loadUser();
    this.loadAllUsers();
  }

  private loadAllUsers() {
    this.loadingFriends = true;
    this.frindService.getAllFriendRequest(this.user.userId);
    this.frindService.personsSubject.subscribe((users) => {
      this.loadedUsersList = [...users];
      this.loadingFriends = false;
    });
  }

  private loadUser() {
    this.userService.user.pipe(take(1)).subscribe((user) => {
      this.user = user;
    });
  }

  ngOnDestroy(): void {}
}
