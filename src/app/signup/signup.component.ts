import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../user.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  registerForm: FormGroup;
  @ViewChild('pass') passel: ElementRef;
  @ViewChild('cpass') cpassel: ElementRef;
  passview = false;
  cpassview = false;
  loading=false;
  constructor(
    public formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private user: UserService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group(
      {
        name: [
          '',
          Validators.compose([Validators.required, Validators.minLength(3)]),
        ],
        password: [
          '',
          Validators.compose([Validators.required, Validators.minLength(6)]),
        ],
        confirmPassword: ['', Validators.compose([Validators.required])],
      },
      { validator: matchingPasswords('password', 'confirmPassword') }
    );
  }
  passeye() {
    this.passview = true;
    this.passel.nativeElement.type = 'text';
  }
  passnoteye() {
    this.passview = false;
    this.passel.nativeElement.type = 'password';
  }

  cpasseye() {
    this.cpassview = true;
    this.cpassel.nativeElement.type = 'text';
  }
  cpassnoteye() {
    this.cpassview = false;
    this.cpassel.nativeElement.type = 'password';
  }
  async onRegisterFormSubmit(value) {
    if (this.registerForm.valid) {
      this.loading=true;
      var signup = await this.user.post(
        environment.DATABASE + 'chat/register',
        value
      );
      this.loading=false;
      if (signup['success']) {
        localStorage.setItem('token', signup['token']);
        this.snackBar.open(
          'You registered successfully and signed in !!',
          '×',
          { panelClass: 'success', verticalPosition: 'top', duration: 3000 }
        );

        this.router.navigateByUrl('/chat');
      } else {
        this.snackBar.open(signup['message'], '×', {
          panelClass: 'error',
          verticalPosition: 'top',
          duration: 3000,
        });
      }
    }
  }
}

export function matchingPasswords(
  passwordKey: string,
  passwordConfirmationKey: string
) {
  return (group: FormGroup) => {
    let password = group.controls[passwordKey];
    let passwordConfirmation = group.controls[passwordConfirmationKey];
    if (password.value !== passwordConfirmation.value) {
      return passwordConfirmation.setErrors({ mismatchedPasswords: true });
    }
  };
}
