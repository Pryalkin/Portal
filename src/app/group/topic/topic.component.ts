import {Component, NgModule, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {GeneralOverview} from "../../model/general-overview";
import {HTTP_INTERCEPTORS, HttpClientModule, HttpErrorResponse} from "@angular/common/http";
import {NotificationType} from "../../enum/notification-type.enum";
import {GeneralOverviewService} from "../../service/general-overview.service";
import {NotificationService} from "../../service/notification.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.css']
})
export class TopicComponent implements OnInit, OnDestroy {

  private idGeneralOverview: string = '';
  private subscriptions: Subscription[] = [];
  public generalOverview: GeneralOverview = new GeneralOverview();

  constructor(private generalOverviewService: GeneralOverviewService,
              private notificationService: NotificationService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getTopicGroup();
  }

  private getTopicGroup(): void{
    this.route.params.subscribe((params: Params) => {
      this.idGeneralOverview = params['id'];
      this.subscriptions.push(
        this.generalOverviewService.getTopicGroup(this.idGeneralOverview).subscribe(
          (response: GeneralOverview) => {
            this.generalOverview = response;
          },
          (errorResponse: HttpErrorResponse) => {
            this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          }
        )
      );
    });
  }

  public takeRating(i: number): void {

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
