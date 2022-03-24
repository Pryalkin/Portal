import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "./service/authentication.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'portalapp';
  name: string = '';
  flag: boolean = false;

  constructor(private router: Router, private authenticationService: AuthenticationService) {}

  ngOnInit(): void {
    if(this.authenticationService.isUserLoggedIn()){
      this.name = this.authenticationService.getUserFromLocalCache().username;
      this.flag = true;
    } else {
      this.flag = false;
    }
  }

}
