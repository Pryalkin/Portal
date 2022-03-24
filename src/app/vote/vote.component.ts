import {Component, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {GeneralOverview} from "../model/general-overview";
import {NotificationType} from "../enum/notification-type.enum";
import * as SockJS from "sockjs-client";
import {CompatClient, Stomp} from "@stomp/stompjs";
import {AuthenticationService} from "../service/authentication.service";
import {NotificationService} from "../service/notification.service";
import {ActivatedRoute} from "@angular/router";
import {GeneralOverviewService} from "../service/general-overview.service";
import {HttpErrorResponse} from "@angular/common/http";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css']
})
export class VoteComponent implements OnInit, OnDestroy {

  private stompClient!: CompatClient;
  authorisationFlag: boolean = false;
  private username!: string;
  private idGeneralOverview!: number;
  private generalOverview: GeneralOverview = new GeneralOverview();
  elementForLikeAndDislike?: HTMLElement;
  element?: HTMLElement;
  iElement?: HTMLElement;
  private subscriptions: Subscription[] = [];
  socket = new SockJS('http://localhost:8080/gs-guide-websocket');

  constructor( private authenticationService: AuthenticationService,
               private notificationService: NotificationService,
               private route: ActivatedRoute,
               private generalOverviewService: GeneralOverviewService) { }

  ngOnInit(): void {
    console.log('++++++11111111111111+++++++')
    console.log(document.getElementsByTagName('app-vote'));
    this.getAllReviewsFromPage();
    this.checkAuthentication();
    this.connect();
  }

  connect(){
    this.stompClient = Stomp.over(this.socket);
    const _this = this;
    this.stompClient.connect({}, function (frame: any) {
      console.log('Connected: ' + frame);
      _this.stompClient.subscribe('/topic/hi', function (payload) {
        console.log('VOTE');
       _this.generalOverview = JSON.parse(payload.body).body;
       _this.setRating(_this);
       _this.setLikeAdnDislike(_this);
       _this.setNumberOfComments(_this);
      });
    });
    setTimeout(() => {
      this.sendName(0);
    }, 1000)
  }

  public sendName(i: number) {
    console.log({id: this.idGeneralOverview, numberRating: i, username: this.username});
      this.stompClient.send("/app/addRating", {}, JSON.stringify(
        {id: this.idGeneralOverview, numberRating: i, username: this.username}));
  }

  public takeRating(i: string, event: any): void {
    if (this.authorisationFlag){
        this.subscriptions.push(
          this.generalOverviewService.getTopicGroup(event.path[3].id).subscribe(
            (response: GeneralOverview) => {
              if (+i > 0 && +i < 6){
                this.addRating(i, response);
              } else if (+i == 6 || +i == 7){
                this.addLikeAndDislike(i, response);
              }
            },
            (errorResponse: HttpErrorResponse) => {
              this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
            }
          )
        );
    } else {
      this.notificationService.notify(NotificationType.WARNING, 'Register to vote');
    }
  }



  private addLikeAndDislike(i: string, generalOverview: GeneralOverview){
    let flag: boolean = false;
    if (generalOverview.likeAndDislike.length == 0) {
      this.sendName(+i);
    } else {
      for (let j = 0; j < generalOverview.likeAndDislike.length; j++) {
        if (generalOverview.likeAndDislike[j].user.username == this.username) {
          flag = false;
          break;
        } else {
          flag = true;
        }
      }
      if (flag){
        this.sendName(+i);
      }  else {
        this.notificationService.notify(NotificationType.WARNING, 'You have already voted');
      }
    }
  }

  private addRating(i: string, generalOverview: GeneralOverview){
    let flag: boolean = false;
    if (generalOverview.rating.length == 0){
      this.sendName(+i);
    } else {
      for (let j = 0; j < generalOverview.rating.length; j++) {
        if (generalOverview.rating[j].user.username == this.username){
          flag = false;
          break;
        } else {
          flag = true;
        }
      }
      if (flag){
        this.sendName(+i);
      }  else {
        this.notificationService.notify(NotificationType.WARNING, 'You have already voted');
      }
    }
  }

  private setNumberOfComments(_this: VoteComponent){

  }

  private setLikeAdnDislike(_this: VoteComponent){
    if (_this.generalOverview.likeAndDislike.length != 0){
      let sumLike: number = 0;
      let sumDislike: number = 0;
      _this.generalOverview.likeAndDislike.forEach(el => {
        if (el.l1ke){
          sumLike++;
        }
        if (el.dislike) {
          sumDislike++;
        }
      })
      document.getElementById(_this.generalOverview.id.toString())?.childNodes.forEach(el => {
        el.childNodes[1].childNodes.forEach(e => {
          if(e.nodeName == 'SPAN'){
            this.elementForLikeAndDislike = <HTMLElement>e;
            if (this.elementForLikeAndDislike.getAttribute('name') == 'like'){
             this.elementForLikeAndDislike.innerText = sumLike.toString();
             this.generalOverview.likeAndDislike.forEach(el =>{
             })
            } else if (this.elementForLikeAndDislike.getAttribute('name') == 'dislike'){
              this.elementForLikeAndDislike.innerText = sumDislike.toString();
            }
          }
          if (e.nodeName == 'I'){
            let iElementForLikeAndDislike = <HTMLElement>e;
            this.generalOverview.likeAndDislike.forEach(element =>{
              if (iElementForLikeAndDislike.className == "bi bi-hand-thumbs-up"){
                if (element.l1ke && element.user.username == this.username){
                  iElementForLikeAndDislike.className = 'bi bi-hand-thumbs-up-fill';
                  iElementForLikeAndDislike.style.color = 'green';
                }
              }
              if (iElementForLikeAndDislike.className == "bi bi-hand-thumbs-down") {
                if (element.dislike && element.user.username == this.username) {
                  iElementForLikeAndDislike.className = 'bi bi-hand-thumbs-down-fill';
                  iElementForLikeAndDislike.style.color = 'red';
                }
              }
            })
          }
        })
      })
    }
  }

  private setRating(_this: VoteComponent): void{
    if (_this.generalOverview.rating.length > 0) {
      let sumRatings: number = 0;
      _this.generalOverview.rating.forEach(el => {
        sumRatings += el.rating;
      })
      let i = 0;
      document.getElementById(_this.generalOverview.id.toString())?.childNodes.forEach(el => {
        el.childNodes[0].childNodes.forEach(e => {
          i=i+0.99;
          if (e.nodeName == 'I'){
            if (i < (sumRatings / _this.generalOverview.rating.length)) {
              _this.iElement = <HTMLElement>e;
              _this.iElement.className = 'bi bi-star-fill';
              _this.iElement.style.color = 'yellow';
            }
          }
        })
        _this.element = <HTMLElement>el.childNodes[0].lastChild;
        _this.element.innerText = ' Рейтинг: ' + (sumRatings / _this.generalOverview.rating.length).toFixed(1).toString();
      })
    }
  }

  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occured. Please try again.');
    }
  }

  private checkAuthentication(): void {
    if (this.authenticationService.getUserFromLocalCache().role == "ROLE_SUPER_ADMIN"){
      if (this.authenticationService.getUsernameForAdmin() == null){
        this.username = this.authenticationService.getUserFromLocalCache().username;
        this.authorisationFlag = true;
      } else {
        this.username = this.authenticationService.getUsernameForAdmin();
        this.authorisationFlag = true;
      }
    } else if (this.authenticationService.isUserLoggedIn()){
      this.username = this.authenticationService.getUserFromLocalCache().username;
      this.authorisationFlag = true;
    } else this.authorisationFlag = false;
  }


  private getAllReviewsFromPage(): void{
    if (this.route.snapshot.params['id'] == undefined) {
      for (let j = 0; j < document.getElementsByTagName('app-vote').length; j++) {
        if (document.getElementsByTagName('app-vote')[j].id != "")
          this.idGeneralOverview = Number(document.getElementsByTagName('app-vote')[j].id);
      }
    } else {
      this.idGeneralOverview = +this.route.snapshot.params['id'];
    }
  }

  ngOnDestroy(): void {
    this.socket.close();
  }

}
