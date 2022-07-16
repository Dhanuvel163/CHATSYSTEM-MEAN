import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { WebsocketService } from '../websocket.service';
import { DataService } from '../data.service';
import { environment } from 'src/environments/environment';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { config } from 'process';

@Component({
  selector: 'app-chatwindow',
  templateUrl: './chatwindow.component.html',
  styleUrls: ['./chatwindow.component.scss'],
})
export class ChatwindowComponent implements OnInit {
  username;
  user1;
  chatsArray;
  untouched = true;
  container: HTMLElement;
  chatroom;
  message: String;
  messageArray;
  isTyping = false;
  loading=false;
  constructor(
    private webSocketService: WebsocketService,
    private user: UserService,
    private data: DataService,
    private route:Router,
    private mat:MatSnackBar
  ) {
    if(!this.data.isloggedin()){
      this.route.navigate(['/login'])
      this.mat.open("Please login to continue",null,{panelClass:['snack'],verticalPosition:'top',duration:2000})
    }
    this.username = this.data.getuser().username;
  }

  allusers;
  async ngOnInit() {
    this.loading=true;
    let response = await this.user.get(environment.DATABASE + 'allusers');
    this.loading=false;
    if (response['success']) {
      this.allusers = response['message'];
    }
  }

  sendMessage() {
    this.webSocketService.sendMessage({
      room: this.chatroom,
      user: this.username,
      message: this.message,
    });
    this.message = '';
  }

  typing() {
    this.webSocketService.typing({ room: this.chatroom, user: this.username });
  }

  async changeuser(user) {
    this.untouched = false;
    this.user1 = user;
    if (this.user1 < this.username) {
      this.chatroom = this.user1 + '-' + this.username;
    } else {
      this.chatroom = this.username + '-' + this.user1;
    }
    this.webSocketService.joinRoom({
      user: this.username,
      room: this.chatroom,
    });

    this.webSocketService.newMessageReceived().subscribe((data) => {
      // throttle(() => {
      //   this.user.getChatRoomsChat(this.chatroom).then((data) => {
      //     this.messageArray = data;
      //   });
      // }, 200);
      // this.messageArray.push(data);
      this.user.getChatRoomsChat(this.chatroom).then((data) => {
        this.messageArray = data;
      });
      this.isTyping = false;
    });

    this.webSocketService.receivedTyping().subscribe((bool) => {
      this.isTyping = bool.isTyping;
    });

    this.messageArray = await this.user.getChatRoomsChat(this.chatroom);
  }
}

// export const throttle = (fn, delay) => {
//   let last = 0;
//   return (...args) => {
//     const now = new Date().getTime();
//     if (now - last < delay) {
//       return;
//     }
//     last = now;
//     return fn(...args);
//   };
// };
