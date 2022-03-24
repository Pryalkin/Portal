import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {AuthenticationService} from "./service/authentication.service";
import {UserService} from "./service/user.service";
import {AuthInterceptor} from "./interceptor/auth.interceptor";
import {AuthenticationGuard} from "./guard/authentication.guard";
import {NotificationModule} from "./notification.module";
import {NotificationService} from "./service/notification.service";
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';
import {FormsModule} from "@angular/forms";
import { HomeComponent } from './home/home.component';
import { ReviewComponent } from './user/review/review.component';
import {GeneralOverviewService} from "./service/general-overview.service";
import { GroupComponent } from './group/group.component';
import { TopicComponent } from './group/topic/topic.component';
import {DatePipe} from "@angular/common";
import { VoteComponent } from './vote/vote.component';
import {CommentsComponent} from "./group/topic/comments/comments.component";
import { AdministrationComponent } from './user/administration/administration.component';
import { ViewReviewsComponent } from './user/view-reviews/view-reviews.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UserComponent,
    HomeComponent,
    ReviewComponent,
    GroupComponent,
    VoteComponent,
    TopicComponent,
    CommentsComponent,
    AdministrationComponent,
    ViewReviewsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NotificationModule
  ],
  providers: [NotificationService, AuthenticationGuard, AuthenticationService, UserService, GeneralOverviewService,
    DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule {}
