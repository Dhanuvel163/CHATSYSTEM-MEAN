import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  getuser(){
    const token = localStorage.getItem('token');
    return jwt_decode(token).user; 
  }

  isloggedin()
  {
    if(localStorage.getItem('token'))
    {
      return true;
    }
    else
    {
      return false;
    }
  }
}
