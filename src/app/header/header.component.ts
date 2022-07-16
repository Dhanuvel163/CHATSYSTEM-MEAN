import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(public data: DataService) {}

  ngOnInit(): void {}
  logout() {
    localStorage.removeItem('token');
  }
}
