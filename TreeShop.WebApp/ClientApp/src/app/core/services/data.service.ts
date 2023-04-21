import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { SystemConstants } from './../common/system.constants';
import { AuthenService } from './authen.service';
import { NotificationService } from './notification.service';
import { UltillityService } from './ultillity.service';
import { Observable } from 'rxjs';
import { MessageConstants } from './../common/message.constants';
import { map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { UrlApiService } from './url-api.service';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  //private headers: HttpHeaders;
  constructor(private _http: HttpClient, private _router: Router, private _authenService: AuthenService,
    private _notificationService: NotificationService, private _utilityService: UltillityService, private _urlApi:UrlApiService) { }

  get(url: string) {
    let headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*').delete("Authorization").append("Authorization", this._authenService.getLoggedInUser().access_token);
    return this._http.get(this._urlApi.getUrlApiDatabse() + url, { 'headers': headers }).pipe(map(extractData => extractData));
  }

  post(uri: string, data?: any) {
    let headers = new HttpHeaders()
      .set('content-type', 'application/json')

      .set('Access-Control-Allow-Origin', '*').delete("Authorization").append("Authorization", this._authenService.getLoggedInUser().access_token);
    return this._http.post(this._urlApi.getUrlApiDatabse() + uri, data, { 'headers': headers}).pipe(map(extractData => extractData));
  }
  put(uri: string, data?: any) {
    let headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('responseType', 'text')
      .set('Access-Control-Allow-Origin', '*').delete("Authorization").append("Authorization",  this._authenService.getLoggedInUser().access_token);
    return this._http.put(this._urlApi.getUrlApiDatabse() + uri, data, { 'headers': headers },).pipe(map(extractData => extractData));
  }
  delete(uri: string, key: string, id: string) {
    let headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*').delete("Authorization").append("Authorization",  this._authenService.getLoggedInUser().access_token);
    return this._http.delete(this._urlApi.getUrlApiDatabse() + uri + "/?" + key + "=" + id, { 'headers': headers })
      .pipe(map(extractData => extractData));
  }
  deleteById(uri: string) {
    let headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*').delete("Authorization").append("Authorization", this._authenService.getLoggedInUser().access_token);
    return this._http.delete(this._urlApi.getUrlApiDatabse() + uri, { 'headers': headers })
      .pipe(map(extractData => extractData));
  }
  postFile(uri: string, data?: any) {
    let newHeader = new HttpHeaders();
    newHeader.append("Authorization", this._authenService.getLoggedInUser().access_token);
    return this._http.post(this._urlApi.getUrlApiDatabse() + uri, data, { 'headers': newHeader })
      .pipe(map(extractData => extractData));
  }

  public handleError(error: any) {
    if (error.status == 401) {
      localStorage.removeItem(SystemConstants.CURRENT_USER);
      localStorage.removeItem(SystemConstants.CURRENT_USER_ROLE);
      this._notificationService.printErrorMessage(MessageConstants.AUTH_LOGIN);
      this._utilityService.navigateToLogin();
      return throwError(MessageConstants.AUTH_LOGIN);
    }
    else {
      let errMsg = error.error.Message ? error.error.Message :
        error.status ? `${error.status} - ${error.statusText}` : 'Lỗi hệ thống';
      this._notificationService.printErrorMessage(errMsg);
      return throwError(errMsg);
    }

  }
}
