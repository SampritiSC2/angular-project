import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css'],
})
export class ProfileSettingsComponent implements OnInit, OnDestroy {
  selectedSection: string = 'profile';
  userSubscription: Subscription;
  isLoading: boolean;

  profileForm: FormGroup;
  passwordForm: FormGroup;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.profileForm = new FormGroup({
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      gender: new FormControl('male', Validators.required),
      dob: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
      phone: new FormControl(null),
      country: new FormControl(null),
      city: new FormControl(null),
    });
    this.initialiseProfileForm();
    this.initializePasswordForm();
  }

  onToggleSection(event: Event) {
    this.selectedSection = (event.target as HTMLInputElement).value;
  }

  private initialiseProfileForm() {
    this.isLoading = true;
    this.userSubscription = this.userService
      .findUserById()
      .subscribe((user) => {
        const date = this.getDateString(user.dob);
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          gender: user.gender,
          dob: date,
          email: user.email,
        });

        this.isLoading = false;
      });
  }

  private initializePasswordForm() {
    this.passwordForm = new FormGroup({
      password: new FormControl(null, Validators.required),
      confirmPassword: new FormControl(null, Validators.required),
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  handleUpdate() {
    this.isLoading = true;
    this.userService
      .updateUser(this.profileForm.value)
      .subscribe((responseData) => {
        this.isLoading = false;
        this.userService.updateExistingUserData();
      });
  }

  handlePasswordFormSubmit() {
    if (
      this.passwordForm.value['password'] ===
      this.passwordForm.value['confirmPassword']
    ) {
      this.userService
        .updateUser({
          password: this.passwordForm.value['password'],
        })
        .subscribe((res) => {
          this.passwordForm.reset();
        });
    } else {
      alert('Passwords dont match');
    }
  }

  private getDateString(dateString: string) {
    const dateObj = new Date(dateString);

    let year = dateObj.getFullYear();
    let date = dateObj.getDate().toString();
    let month = (dateObj.getMonth() + 1).toString();

    date = date.length === 1 ? '0' + date : date;
    month = month.length === 1 ? '0' + month : month;

    return year + '-' + month + '-' + date;
  }
}
