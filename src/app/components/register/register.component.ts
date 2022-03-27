import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  isLoading: boolean;
  message: string = null;
  error: string = null;
  userSubscription: Subscription;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.createControls();
  }

  handleSubmit() {
    this.isLoading = true;
    this.userSubscription = this.userService
      .register(this.registerForm.value)
      .subscribe(
        (responseData) => {
          console.log(responseData);

          this.isLoading = false;
          this.message = responseData.message;
          this.registerForm.reset();
        },
        (error) => {
          this.isLoading = false;
          this.error = error.message;
        }
      );
  }

  closeMessage() {
    this.message = null;
  }

  closeError() {
    this.error = null;
  }

  private createControls() {
    this.registerForm = new FormGroup({
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
      dob: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      gender: new FormControl('male', Validators.required),
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
