import { Component, OnInit } from '@angular/core';
import {User} from "../../model/user";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {NotificationService} from "../../service/notification.service";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {NotificationType} from "../../enum/notification-type.enum";
import {UserService} from "../../service/user.service";
import {AuthenticationService} from "../../service/authentication.service";

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.css']
})
export class AdministrationComponent implements OnInit {

  private subscriptions: Subscription[] = [];
  public users: User[] = new Array<User>();

  constructor(private router: Router, private userService: UserService,
              private notificationService: NotificationService,
              private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.getAllUsers();
  }

  public goToPage(username: string): void{
    this.authenticationService.setUsernameForAdmin(username);
    this.router.navigate(['/user/room'])
  }

  private getAllUsers() {
    this.subscriptions.push(
      this.userService.getUsers().subscribe(
        (response: User[]) => {
          this.users = response;
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    );
  }

  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occured. Please try again.');
    }
  }



}
