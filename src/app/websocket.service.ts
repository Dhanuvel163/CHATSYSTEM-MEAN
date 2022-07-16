import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private socket = io(environment.DATABASE);
  constructor() {}

  joinRoom(data) {
    this.socket.emit('join', data);
  }

  sendMessage(data) {
    this.socket.emit('message1', data);
  }

  newMessageReceived() {
    const observable = new Observable<{ user: String; message: String }>(
      (observer) => {
        this.socket.on('new message', (data) => {
          console.log(data);
          observer.next(data);
        });
        return () => {
          this.socket.disconnect();
        };
      }
    );
    return observable;
  }

  typing(data) {
    this.socket.emit('typing', data);
  }

  receivedTyping() {
    const observable = new Observable<{ isTyping: boolean }>((observer) => {
      this.socket.on('typing', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }
}
