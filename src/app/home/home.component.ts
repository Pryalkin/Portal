import {Component, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Subscription} from "rxjs";
import {GeneralOverview} from "../model/general-overview";
import {GeneralOverviewService} from "../service/general-overview.service";
import {NotificationService} from "../service/notification.service";
import {ActivatedRoute, Params} from "@angular/router";
import {AuthenticationService} from "../service/authentication.service";
import {HttpErrorResponse} from "@angular/common/http";
import {NotificationType} from "../enum/notification-type.enum";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

private subscriptions: Subscription[] = [];
public generalOverviews: Array<GeneralOverview> = new Array<GeneralOverview>();

  constructor(private generalOverviewService: GeneralOverviewService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.getAllGroupTopicsForHome('1');
  }

  public check(i: string):void {
    this.getAllGroupTopicsForHome(i);
  }

  private getAllGroupTopicsForHome(i: string){
    this.route.params.subscribe((params: Params) => {
      this.subscriptions.push(
        this.generalOverviewService.getAllGroupTopicsForHome(i).subscribe(
          (response: Array<GeneralOverview>) => {
            console.log(response);
            this.generalOverviews = response;
          },
          (errorResponse: HttpErrorResponse) => {
            this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          }
        )
      );
    });
  }

private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occured. Please try again.');
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
