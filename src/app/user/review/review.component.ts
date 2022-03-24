import {Component, OnDestroy, OnInit} from '@angular/core';
import {NotificationService} from "../../service/notification.service";
import {NotificationType} from "../../enum/notification-type.enum";
import {Subscription} from "rxjs";
import {GeneralOverviewService} from "../../service/general-overview.service";
import {Tags} from "../../model/tags";
import {GeneralOverview} from "../../model/general-overview";
import {AuthenticationService} from "../../service/authentication.service";
import {NgForm} from "@angular/forms";
import {Overview} from "../../model/overview";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit, OnDestroy  {
  private iTag: number = 0;
  private iFile: number = 0;
  showLoading: boolean = false;
  private subscriptions: Subscription[] = [];
  tag2: boolean = true;
  tag3: boolean = true;
  file2: boolean = true;
  file3: boolean = true;
  image1!: File;
  image2!: File;
  image3!: File;
  ImageName1!: string;
  ImageName2!: string;
  ImageName3!: string;
  overview: Overview = new Overview();
  tags: Tags[] = new Array<Tags>();
  images: File[] = new Array<File>();
  private username!: string;
  listOfAutocompleteTags: Tags[] = new Array();
  search: string = "";
  searchList: string[] = new Array();

  constructor(private notificationService: NotificationService, private generalOverviewService: GeneralOverviewService,
              private authenticationService: AuthenticationService) {}

  ngOnInit(): void {
    this.checkAuthentication();
    this.getAllTags();
  }

  public getValueFromInput() {
    this.searchList = new Array();
    console.log(this.search);
    if (this.search != "") {
      let min: number = 0;
      let max: number = this.listOfAutocompleteTags.length - 1;
      console.log("min: " + min);
      console.log("max: " + max);
      this.search.length;
      while (min <= max){
        let mid: number = Math.round((min + max) / 2);
        console.log("mid: " + mid);
        console.log("элемент для сравнения: " + this.listOfAutocompleteTags[mid].tag.substring(0, this.search.length));
        if (this.listOfAutocompleteTags[mid].tag.substring(0, this.search.length) > this.search){
          console.log(1)
          max = mid -1;
        } else if (this.listOfAutocompleteTags[mid].tag.substring(0, this.search.length) < this.search) {
          console.log(2)
          min = mid + 1;
        } else {
          console.log(3)
          this.searchList.push(this.listOfAutocompleteTags[mid].tag);
          if (this.listOfAutocompleteTags[mid-1].tag.substring(0, this.search.length) == this.search){
            this.searchList.push(this.listOfAutocompleteTags[mid-1].tag);
            if (this.listOfAutocompleteTags[mid-2].tag.substring(0, this.search.length) == this.search){
              this.searchList.push(this.listOfAutocompleteTags[mid-2].tag);
            }
          }
          if (this.listOfAutocompleteTags[mid+1].tag.substring(0, this.search.length) == this.search){
            this.searchList.push(this.listOfAutocompleteTags[mid+1].tag);
            if (this.listOfAutocompleteTags[mid+2].tag.substring(0, this.search.length) == this.search){
              this.searchList.push(this.listOfAutocompleteTags[mid+2].tag);
            }
          }
          break;
        }
        console.log(this.searchList);
      }
    }
    this.searchList.length == 0 ?  document.getElementById('divTag1')!.classList.add("mb-2") :  document.getElementById('divTag1')!.classList.remove("mb-2");
  }

  public valueForInput(valueForInput: string): void{
    this.search = valueForInput;
    this.searchList = new Array();
  }

  public onGeneralOverview(): void{
    this.showLoading = true;
  }

  public saveNewOverview(): void{
    if (!document.getElementById('new-overview-save')?.getAttribute('disabled')) {
    }
    document.getElementById('new-overview-save')?.click();
  }

  public onAddNewOverview(overviewForm: NgForm): void {
    this.overview.group = overviewForm.form.value.group;
    this.overview.topic = overviewForm.form.value.topic;
    this.overview.grade = overviewForm.form.value.grade;
    this.overview.advantages = overviewForm.form.value.advantages;
    this.overview.disadvantages = overviewForm.form.value.disadvantages;
    this.tags.push(new Tags(overviewForm.form.value.tag1));
    ((overviewForm.form.value.tag2) != null) ? this.tags.push(new Tags(overviewForm.form.value.tag2)) : this.tags.push(new Tags(""));
    ((overviewForm.form.value.tag3) != null) ? this.tags.push(new Tags(overviewForm.form.value.tag3)) : this.tags.push(new Tags(""));
    console.log(this.tags);
    this.images.push(this.image1);
    this.images.push(this.image2);
    this.images.push(this.image3);
    const formData = this.generalOverviewService.createOverviewFormData(this.overview, this.tags, this.images, this.username);
    this.subscriptions.push(
      this.generalOverviewService.save(formData).subscribe(
        (response: GeneralOverview) => {
          document.getElementById('new-overview-close')?.click();
          this.images.splice(0, this.images.length);
          this.tags.splice(0, this.tags.length);
          overviewForm.reset();
          this.showLoading = false;
          this.sendNotification(NotificationType.SUCCESS, `You have successfully created overview.`);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.showLoading = false;
        }
      )
    );
  }

  public onImage(event: any, i: number): void{
    if (i == 1) {
      this.image1 = event.target.files[0];
      this.ImageName1 = event.target.files[0].name;
    } else if (i == 2){
      this.image2 = event.target.files[0];
      this.ImageName2 = event.target.files[0].name;
    } else if (i == 3){
      this.image3 = event.target.files[0];
      this.ImageName3 = event.target.files[0].name;
    }
  }

  public addTag(){
    if (this.iTag < 2 && this.tag2){
      this.iTag++;
      this.tag2 = false;
    } else if (this.iTag < 2 && this.tag3){
      this.iTag++;
      this.tag3 = false;
    } else {
      this.notificationService.notify(NotificationType.WARNING, 'You can use maximum 3 tags');
    }
  }

  public deleteTag(i: number) {
    if (i == 2){
      this.tag2 = true;
      this.iTag--;
      const tag: HTMLInputElement = <HTMLInputElement>document.getElementById('inputTag2');
      tag.value = "";
    } else if (i == 3){
      this.tag3 = true;
      this.iTag--;
      const tag: HTMLInputElement = <HTMLInputElement>document.getElementById('inputTag3');
      tag.value = "";
    }
  }


  public addFile(){
    if (this.iFile < 2 && this.file2){
      this.iFile++;
      this.file2 = false;
    } else if (this.iFile < 2 && this.file3){
      this.iFile++;
      this.file3 = false;
    } else {
      this.notificationService.notify(NotificationType.WARNING, 'You can use maximum 3 images');
    }
  }

  public deleteFile(i: number) {
    if (i == 2){
      this.file2 = true;
      this.iFile--;
    } else if (i == 3){
      this.file3 = true;
      this.iFile--;
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
    this.subscriptions.forEach(sub => sub.unsubscribe());
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

  private getAllTags() {
    this.subscriptions.push(
      this.generalOverviewService.getAllTags().subscribe(
        (response: Tags[]) => {
          this.sortListOfAutocompleteTags(response);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    );
  }

  private sortListOfAutocompleteTags(listOfAutocompleteTags: Tags[]): void{
    this.listOfAutocompleteTags = listOfAutocompleteTags.sort((a, b) => {
      if (a.tag > b.tag) return 1;
      if (a.tag < b.tag) return -1;
      return 0;
    });
  }
}
