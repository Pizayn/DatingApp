import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  photoUrl:string;

  constructor(public authService: AuthService,private alertify: AlertifyService,
    private router : Router) { }
   


  ngOnInit() {
    this.authService.currentPhotoUrl.subscribe(photoUrl=>this.photoUrl=photoUrl)
  }
  login(){
    this.authService.login(this.model).subscribe(next =>{
      this.alertify.success('logged in succesfully');
    },error=> {
      this.alertify.error(error);
    },()=>{
      this.router.navigate(['/members']);
    });
  }
  loggedIn(){
   // const token=localStorage.getItem('token');
   // return !!token; //token varsa true yoksa false döncek
   return this.authService.loggedIn();
  }
  logOut(){
    localStorage.removeItem('token');
    this.alertify.message('logged out');
    this.authService.decodedToken=null;
    this.authService.user=null;
    this.alertify.message('log out');
    this.router.navigate(['/home']);

  }

}
