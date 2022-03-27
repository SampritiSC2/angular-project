import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.resetPasswordForm = new FormGroup({
      password: new FormControl(null, Validators.required),
      confirmPassword: new FormControl(null, Validators.required),
    });
  }

  handleSubmit() {
    const pass = this.resetPasswordForm.value['password'];
    const conPass = this.resetPasswordForm.value['confirmPassword'];

    if (pass === conPass) {
      this.userService
        .updateUser({
          password: pass,
        })
        .subscribe((res) => {
          this.router.navigate(['/']);
        });
    } else {
      alert('Passwords dont match');
    }
  }
}
