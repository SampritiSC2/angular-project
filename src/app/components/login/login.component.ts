import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  isLoading: boolean;
  error: string = null;
  loginForm: FormGroup;
  errorSubscription: Subscription;
  userSubscription: Subscription;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.createControls();

    this.errorSubscription = this.userService.errorSubject.subscribe(
      (error) => {
        this.isLoading = false;
        this.error = error;
      }
    );
  }

  handleLogin() {
    this.isLoading = true;
    const { email, password } = this.loginForm.value;
    this.userSubscription = this.userService.login(email, password).subscribe(
      (responseData) => {
        this.loginForm.reset();
        this.isLoading = false;
        this.router.navigate(['/home']);
      },
      (error) => {
        this.isLoading = false;
      }
    );
  }

  closeError() {
    this.error = null;
  }

  private createControls() {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.email, Validators.required]),
      password: new FormControl(null, Validators.required),
    });
  }

  ngOnDestroy(): void {
    this.errorSubscription.unsubscribe();
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
