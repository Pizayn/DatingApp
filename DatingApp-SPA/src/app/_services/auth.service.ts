import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';
import {JwtHelperService} from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import {BehaviorSubject} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.apiUrl + 'auth/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  user: User;
  photoUrl = new BehaviorSubject<string>('../../assets/user.png');
  //photourlnin default olarak bir değeri var ve login olduğunda kullanıcının fotoğrafı varsa next komutu ile o photoyu almış oluruz
  currentPhotoUrl = this.photoUrl.asObservable();
 
   
  constructor(private http: HttpClient) { }
  changeMemberPhoto(photoUrl: string ) {
    this.photoUrl.next(photoUrl);
  }

  login(model: any) {
    return this.http.post(this.baseUrl + 'login', model)
      .pipe( map((response: any) => {
        const user = response;
        if (user) {
          localStorage.setItem('token', user.token);
          localStorage.setItem('user', JSON.stringify(user.user)); //nesneyi json'a çevirir
          this.decodedToken = this.jwtHelper.decodeToken(user.token);
          this.user = user.user;
          this.changeMemberPhoto(this.user.photoUrl);
        }
      }));
  } 
  register(user:User){
    return this.http.post(this.baseUrl+'register', user);

  }
  loggedIn(){
    const token=localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }
 
  
}
