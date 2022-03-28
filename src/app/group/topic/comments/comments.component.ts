import { Component, OnInit } from '@angular/core';
import {GeneralOverviewService} from "../../../service/general-overview.service";
import {NotificationService} from "../../../service/notification.service";
import {ActivatedRoute, Params} from "@angular/router";
import * as SockJS from "sockjs-client";
import {CompatClient, Stomp} from "@stomp/stompjs";
import {AuthenticationService} from "../../../service/authentication.service";
import {NgForm} from "@angular/forms";
import {Comments} from "../../../model/comments";
import {environment} from "../../../../environments/environment.prod";


@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {

  private host: string = environment.apiUrl;
  socket = new SockJS(`${this.host}/gs-guide-websocket`);
  private stompClient!: CompatClient;
  private idGeneralOverview: string = '0';
  public comments: Comments[] = new Array<Comments>();
  private commentsTest: Comments[] = new Array<Comments>();
  public presenceOfComments: boolean = false;
  private element!: HTMLElement;
  private idArrayComments: number[] = new Array();
  private username!: string
  private comment: Comments = new Comments();
  public commentNgModel!: string;
  public checkAuthentication: boolean = false;

  constructor(private generalOverviewService: GeneralOverviewService,
              private notificationService: NotificationService,
              private route: ActivatedRoute,
              private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
    if(this.authenticationService.isUserLoggedIn()) {
      this.checkAuthentication = true;
      this.idGeneralOverview = this.route.snapshot.params['id'];
      if (this.authenticationService.getUserFromLocalCache().role == "ROLE_SUPER_ADMIN"){
        if (this.authenticationService.getUsernameForAdmin() == null){
          this.username = this.authenticationService.getUserFromLocalCache().username;
        } else {
          this.username = this.authenticationService.getUsernameForAdmin();
        }
      } else this.username = this.authenticationService.getUserFromLocalCache().username;
      this.connect();
    }
  }

  private connect() {
    this.stompClient = Stomp.over(this.socket);
    const _this = this;
    this.stompClient.connect({}, function (frame: any) {
      console.log('Connected: ' + frame);
      _this.stompClient.subscribe('/topic/comment', function (payload) {
        _this.commentsTest = JSON.parse(payload.body).body;
        if (_this.commentsTest.length > 0) {
            _this.presenceOfComments = true;
          document.getElementsByName('com').forEach(el => {
            _this.element = <HTMLElement>el.children[0];
            _this.idArrayComments.push(+_this.element.id.substring(2));
          })
          console.log(_this.idArrayComments);
          if (_this.idArrayComments.length > 0) {
            let gT = _this.commentsTest;
            let iAC = _this.idArrayComments;
            let id = 0;
            let arrayOfComments: number = 0;
            for (let i = 0; i < gT.length; i++) {
              for (let j = 0; j < iAC.length; j++) {
                if (gT[i].id == iAC[j]) {
                  id = 0;
                  break;
                } else {
                  id = gT[i].id;
                }
              }
              if (id != 0) {
                arrayOfComments = id;
              }
            }
            console.log(arrayOfComments);
            _this.commentsTest.forEach(el => {
              if (el.id == arrayOfComments){
                _this.comments.push(el);
              }
            })

          } else {
            _this.comments = _this.commentsTest;
          }
        }
      });
    });
    setTimeout(() => {
      this.sendName();
    }, 1000)
  }

  public sendName() {
    this.stompClient.send(`/app/addComment/${this.idGeneralOverview}`, {}, JSON.stringify(this.comment));
  }

  public onAddNewComment(){
      this.comment.comment = this.commentNgModel;
      this.comment.user.username = this.username;
      this.sendName();
      this.commentNgModel = '';
  }

}
