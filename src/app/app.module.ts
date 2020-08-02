import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { ChatwindowComponent } from './chatwindow/chatwindow.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {UserService} from './user.service';
import {DataService} from './data.service';
import {WebsocketService} from './websocket.service';
import { FormsModule } from '@angular/forms';
import {SharedModule} from './shared.module';
import { HomeComponent } from './home/home.component';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SignupComponent,
    SigninComponent,
    ChatwindowComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule
  ],
  providers: [UserService,DataService,WebsocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
