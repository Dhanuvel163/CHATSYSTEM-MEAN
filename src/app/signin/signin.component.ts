import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Router} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {UserService} from '../user.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  registerForm: FormGroup;
  @ViewChild('pass')passel:ElementRef;
  passview=false;
  constructor(public formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private user:UserService,
    public router:Router) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      'name': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'password': ['', Validators.compose([Validators.required,Validators.minLength(6)]) ],
    });
  }
  passeye()
  {
    this.passview=true;
    this.passel.nativeElement.type='text';
  }
  passnoteye()
  {
    this.passview=false;
    this.passel.nativeElement.type='password';
  }
  async onRegisterFormSubmit(value) {
    if (this.registerForm.valid) {
      var signup=await this.user.post('http://localhost:3000/chat/login',value);
      if(signup['success'])
      {
        localStorage.setItem('token',signup['token']);
        this
        .snackBar
        .open('You are successfully signed in !!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
        
        this.router.navigateByUrl('/chat');
      }
      else
      {
        this.snackBar.open(signup['message'], '×', { panelClass: 'error', verticalPosition: 'top', duration: 3000 });
      }
    }
  }
}
