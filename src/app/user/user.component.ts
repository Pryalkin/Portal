import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../service/authentication.service";
import {Router} from "@angular/router";
import {User} from "../model/user";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  public checkForAdmin: boolean = false;
  public username?: string;
  public user: User = new User();

  constructor(private router: Router, private authenticationService: AuthenticationService,) {}

  ngOnInit(): void {
    this.checkAuthentication();
    this.checkAdministration();
  }

  logOut(){
    this.authenticationService.logOut();
    document.location.replace("/");
  }

  logOutUser(){
    this.authenticationService.deleteUsernameForAdmin();
    this.router.navigate(['/user/room/administration'])
  }

  private checkAuthentication(): void{
    if(this.authenticationService.isUserLoggedIn()){
      this.user = this.authenticationService.getUserFromLocalCache();
      if (this.authenticationService.getUserFromLocalCache().role == "ROLE_SUPER_ADMIN"){
        this.checkForAdmin = true;
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  private checkAdministration() {
    if (this.authenticationService.getUsernameForAdmin() != null){
      this.username = this.authenticationService.getUsernameForAdmin();
    }
  }
}
