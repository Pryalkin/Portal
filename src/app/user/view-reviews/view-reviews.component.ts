import {Component, OnDestroy, OnInit} from '@angular/core';
import {GeneralOverview} from "../../model/general-overview";
import {GeneralOverviewService} from "../../service/general-overview.service";
import {NotificationService} from "../../service/notification.service";
import {ActivatedRoute} from "@angular/router";
import {AuthenticationService} from "../../service/authentication.service";
import {Subscription} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {NotificationType} from "../../enum/notification-type.enum";
import {NgForm} from "@angular/forms";
import {CustomHttpResponse} from "../../model/custom-http-response";
import * as SockJS from "sockjs-client";
import {environment} from "../../../environments/environment.prod";

@Component({
  selector: 'app-view-reviews',
  templateUrl: './view-reviews.component.html',
  styleUrls: ['./view-reviews.component.css']
})
export class ViewReviewsComponent implements OnInit, OnDestroy {

  public host: string = environment.apiUrl;
  public generalOverviews: Array<GeneralOverview> = new Array<GeneralOverview>();
  private subscriptions: Subscription[] = [];
  private username!: string;
  public filterCheck: boolean = false;
  public valueForSort!: string;
  private valuesToDeleteGeneralOverview: number[] = new Array();
  public removedElement: HTMLElement[] = new Array();
  public mainBlockRemovedElement: HTMLElement[] = new Array();
  socket = new SockJS(`${this.host}/gs-guide-websocket`);

  constructor(private generalOverviewService: GeneralOverviewService,
              private notificationService: NotificationService,
              private route: ActivatedRoute,
              private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.checkAuthentication();
    this.getAllUserReview('1');
  }

  public restoreGeneralOverview(idReview: number): void{
    let deleteBlockElement: HTMLElement;
    let deleteElement : HTMLElement;
    this.mainBlockRemovedElement.forEach(el => {
      if (+el.id.substring(9) == idReview){
        el.children[0].setAttribute('hidden', 'hidden');
        this.removedElement.forEach(e => {
          if (+e.id.substring(8) == idReview){
            el.append(e);
            deleteBlockElement = el;
            deleteElement = e;
          }
        })
      }
    })
    let indexBlock = this.mainBlockRemovedElement.indexOf(deleteBlockElement!);
    let indexElement = this.mainBlockRemovedElement.indexOf(deleteElement!);
    this.mainBlockRemovedElement.splice(indexBlock, 1);
    this.removedElement.splice(indexElement, 1);
    this.valuesToDeleteGeneralOverview.splice(this.valuesToDeleteGeneralOverview.indexOf(idReview), 1);
  }

  public deleteReview(valueToDeleteGeneralOverview: number ): void{
    this.valuesToDeleteGeneralOverview.push(valueToDeleteGeneralOverview);
    this.removedElement.push(<HTMLElement>document.getElementById('idReview' + valueToDeleteGeneralOverview));
    this.mainBlockRemovedElement.push(<HTMLElement>document.getElementById('mainBlock' + valueToDeleteGeneralOverview));
    document.getElementById('idReview' + valueToDeleteGeneralOverview)!.remove();
    document.getElementById('mainBlock' + valueToDeleteGeneralOverview)?.children[0].removeAttribute('hidden');
  }

  public sort(iSortingCode: string):void {
    this.valueForSort = iSortingCode;
    this.getAllUserReview(iSortingCode);
  }

  public filter(iSortingCode: string):void {
    if (+iSortingCode == 3){
      this.filterCheck = false;
    }
    if (+iSortingCode == 1){
      this.filterCheck = true;
    }
  }

  public groupFilter(ngForm: NgForm){
    this.subscriptions.push(
      this.generalOverviewService.getAllGroupTopics(ngForm.form.value.filter, this.valueForSort).subscribe(
        (response: Array<GeneralOverview>) => {
          this.generalOverviews = response;
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    );
  }

  private getAllUserReview(iSortingCode: string){
    this.filterCheck = false;
    const inputChecked: HTMLInputElement = <HTMLInputElement>(document.getElementById("btnradio10"));
    inputChecked.checked = true;
      this.subscriptions.push(
        this.generalOverviewService.getAllUserReview(this.username, iSortingCode).subscribe(
          (response: Array<GeneralOverview>) => {
            this.generalOverviews = response;
          },
          (errorResponse: HttpErrorResponse) => {
            this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          }
        )
      );
  }

  private checkAuthentication() {
    if (this.authenticationService.getUserFromLocalCache().role == "ROLE_SUPER_ADMIN"){
      if (this.authenticationService.getUsernameForAdmin() == null){
        this.username = this.authenticationService.getUserFromLocalCache().username;
      } else {
        this.username = this.authenticationService.getUsernameForAdmin();
      }
    } else {
      this.username = this.authenticationService.getUserFromLocalCache().username;
    }
  }

  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occured. Please try again.');
    }
  }

  ngOnDestroy(): void {
    this.socket.close();
    this.finalDeletionOfTheReview();
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private finalDeletionOfTheReview() {
    const formData = this.generalOverviewService.getFormForDelete(this.valuesToDeleteGeneralOverview);
    this.subscriptions.push(
      this.generalOverviewService.deleteGeneralReview(formData).subscribe(
        (response: CustomHttpResponse) => {
          this.sendNotification(NotificationType.SUCCESS, response.message);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    );
  }
}
