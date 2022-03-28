import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {GeneralOverview} from "../model/general-overview";
import {GeneralOverviewService} from "../service/general-overview.service";
import {NotificationService} from "../service/notification.service";
import {ActivatedRoute, Params} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {NotificationType} from "../enum/notification-type.enum";
import {AuthenticationService} from "../service/authentication.service";

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  public nameGroup: string = '';
  public generalOverviews: Array<GeneralOverview> = new Array<GeneralOverview>();

  constructor(private generalOverviewService: GeneralOverviewService,
              private notificationService: NotificationService,
              private route: ActivatedRoute,
              private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.getAllGroupTopics('1');
  }

  public sort(iSortingCode: string):void {
      this.getAllGroupTopics(iSortingCode);
  }

  private getAllGroupTopics(iSortingCode: string){
    this.route.params.subscribe((params: Params) => {
      this.nameGroup = params['group'];
      this.subscriptions.push(
        this.generalOverviewService.getAllGroupTopics(this.nameGroup, iSortingCode).subscribe(
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
