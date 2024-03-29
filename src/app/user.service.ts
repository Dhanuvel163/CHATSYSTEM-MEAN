import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}
  getHeaders() {
    const token = localStorage.getItem('token');
    return token ? new HttpHeaders().set('Authorization', token) : null;
  }
  getChatRoomsChat(chatRoom) {
    return this.http
      .get(environment.DATABASE + 'chatroom/' + chatRoom)
      .toPromise();
  }
  getuserchats(user) {
    return this.http.get(environment.DATABASE + 'chats/' + user).toPromise();
  }
  post(link: string, body: any) {
    return this.http
      .post(link, body, { headers: this.getHeaders() })
      .toPromise();
  }
  get(link) {
    return this.http.get(link, { headers: this.getHeaders() }).toPromise();
  }
}
