import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  userSubscription: Subscription;
  user: User;
  userImmediate: User;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.user.subscribe((user) => {
      this.isAuthenticated = !!user;
    });

    this.userService.user.pipe(take(1)).subscribe((user) => {
      this.userImmediate = user;
    });
  }

  handleLogout() {
    this.userService.logout();
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
