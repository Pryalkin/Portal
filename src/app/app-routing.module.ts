import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {UserComponent} from "./user/user.component";
import {HomeComponent} from "./home/home.component";
import {ReviewComponent} from "./user/review/review.component";
import {GroupComponent} from "./group/group.component";
import {TopicComponent} from "./group/topic/topic.component";
import {AdministrationComponent} from "./user/administration/administration.component";
import {ViewReviewsComponent} from "./user/view-reviews/view-reviews.component";

const itemRoutes: Routes = [
  { path: 'viewReviews', component: ViewReviewsComponent},
  { path: 'review', component: ReviewComponent},
  { path: 'administration', component: AdministrationComponent}
];

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'group/:group', component: GroupComponent},
  {path: 'group/:group/:id', component: TopicComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'user/room', component: UserComponent},
  {path: 'user/room', component: UserComponent, children: itemRoutes},
  {path: '', redirectTo: '/', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
