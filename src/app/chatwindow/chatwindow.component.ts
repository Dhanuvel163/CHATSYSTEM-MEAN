import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { WebsocketService } from '../websocket.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-chatwindow',
  templateUrl: './chatwindow.component.html',
  styleUrls: ['./chatwindow.component.scss']
})
export class ChatwindowComponent implements OnInit {
  username;
  user1;
  chatsArray;
  untouched=true;
  container: HTMLElement; 
  chatroom;
  message: String;
  messageArray;
  isTyping = false;
  constructor(
    private webSocketService: WebsocketService,
    private user: UserService,
    private data:DataService
    )
  {  
     this.username=this.data.getuser().username;
     console.log(this.data.getuser(),'jggfu')
  }

  allusers;
  async ngOnInit(){
    let response=await this.user.get('http://localhost:3000/allusers');
    console.log(response)
    if(response['success']){
      this.allusers=response['message']
    }
  }

  sendMessage() {
    this.webSocketService.sendMessage({room: this.chatroom, user: this.username, message: this.message});
    this.message = '';
  }

  typing() {
      this.webSocketService.typing({room: this.chatroom, user: this.username});
  }

  async changeuser(user){
    this.untouched=false;
      this.user1=user;
      if(this.user1<this.username){
        this.chatroom =this.user1+'-'+this.username;
      }else{
        this.chatroom =this.username+'-'+this.user1;
      }
      this.webSocketService.joinRoom({user:this.username, room: this.chatroom});

    this.webSocketService.newMessageReceived().subscribe(data => {
      this.messageArray.push(data);
      this.isTyping = false;
    });
  
    this.webSocketService.receivedTyping().subscribe(bool => {
      this.isTyping = bool.isTyping;
    });

   this.messageArray=await this.user.getChatRoomsChat(this.chatroom);
  }
}