import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  constructor(private userService: UserService) {}

  loadedUsers: User[];

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe((res: User[]) => {
      console.log(res);
      this.loadedUsers = res;
    });
  }
}
