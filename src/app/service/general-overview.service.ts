import { Injectable } from '@angular/core';
import {User} from "../model/user";
import {Observable} from "rxjs";
import {GeneralOverview} from "../model/general-overview";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../../environments/environment.prod";
import {Overview} from "../model/overview";
import {Tags} from "../model/tags";
import {CustomHttpResponse} from "../model/custom-http-response";

@Injectable({
  providedIn: 'root'
})
export class GeneralOverviewService {
  public host: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public deleteGeneralReview(formData: FormData): Observable<CustomHttpResponse>{
    return this.http.post<CustomHttpResponse>
    (`${this.host}/overview/delete`, formData);
  }

  public save(formData: FormData): Observable<GeneralOverview>{
    return this.http.post<GeneralOverview>
    (`${this.host}/overview/save`, formData);
  }

  public getAllTags(): Observable<Array<Tags>>{
    return this.http.get<Array<Tags>>
    (`${this.host}/overview/tags`);
  }

  public getAllUserReview(username: string, i: string): Observable<Array<GeneralOverview>>{
    return this.http.get<Array<GeneralOverview>>
    (`${this.host}/group/user/${username}/${i}`);
  }

  public getAllGroupTopicsForHome(i: string): Observable<Array<GeneralOverview>>{
    return this.http.get<Array<GeneralOverview>>
    (`${this.host}/group/${i}`);
  }

  public getAllGroupTopics(group: string, i: string): Observable<Array<GeneralOverview>>{
    return this.http.get<Array<GeneralOverview>>
    (`${this.host}/group/${group}/${i}`);
  }

  public getTopicGroup(idGeneralOverview: string): Observable<GeneralOverview>{
    return this.http.get<GeneralOverview>(`${this.host}/group/topic/${idGeneralOverview}`);
  }

  public addRating(formData: FormData): Observable<GeneralOverview>{
    return this.http.post<GeneralOverview>(`${this.host}/overview/rating`, formData);
  }

  public getComments(idGeneralOverview: string): Observable<GeneralOverview>{
    return this.http.get<GeneralOverview>(`${this.host}/group/comments/${idGeneralOverview}`);
  }

  public createOverviewFormData(overview: Overview, tags: Tags[], images: File[], username: string): FormData{
    const formData = new FormData();
    formData.append('group', overview.group);
    formData.append('topic', overview.topic);
    formData.append('grade', overview.grade);
    formData.append('advantages', overview.advantages);
    formData.append('disadvantages', overview.disadvantages);
    formData.append('tags1', tags[0].tag);
    formData.append('tags2', tags[1].tag);
    formData.append('tags3', tags[2].tag);
    formData.append('image1', images[0]);
    formData.append('image2', images[1]);
    formData.append('image3', images[2]);
    formData.append('username', username);
    return formData;
  }

  public addRatingFormData(rating: string, username: string, id: string): FormData{
    const formData = new FormData();
    formData.append('rating', rating);
    formData.append('username', username);
    formData.append('id', id);
    return formData;
  }

  public getFormId(id: number){
    const formData = new FormData();
    formData.append('id', id.toString());
    return formData;
  }

  public getFormForDelete(idDelete: number[]): FormData{
    const formData = new FormData();
    formData.append('ids', JSON.stringify(idDelete));
    return formData;
  }
}
