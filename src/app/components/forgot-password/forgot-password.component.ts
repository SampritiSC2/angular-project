import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  error: boolean;
  errorMessage: string;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      dob: new FormControl(null, Validators.required),
    });
  }

  handleSubmit() {
    const email = this.forgotPasswordForm.value['email'];
    const dob = this.forgotPasswordForm.value['dob'];

    this.userService.findUserByEmail(email).subscribe((res: User[]) => {
      if (res.length === 0) {
        this.error = true;
        this.errorMessage = 'Invalid Email';
        this.forgotPasswordForm.reset();
      } else {
        console.log(res);
        const result = this.checkDobMatch(dob, res[0].dob);

        if (result) {
          this.router.navigate(['/reset-password']);
        } else {
          this.error = true;
          this.errorMessage = 'Invalid DOB';
        }
      }
    });
  }

  private checkDobMatch(enteredDob: string, resDob: string) {
    const d1 = new Date(enteredDob);
    const d2 = new Date(resDob);

    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() &&
      d2.getDate()
    );
  }
}
