import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { SystemConstants } from '../common/system.constants';
import { map } from "rxjs/operators";
import { LoggedInUser } from '../domain/loggedIn.user';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { UrlApiService } from './url-api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenService {
  user: any = null;
  stringArray = new BehaviorSubject<string[]>([]);
  constructor(
    private _http: HttpClient, private _urlApi:UrlApiService
  ) {
  }

  login(data: any) {
    let headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');

    return this._http.post(this._urlApi.getUrlApiDatabse() + 'ApplicationUser/login', data, { 'headers': headers })
      .pipe(
        map(res => {
          this.user = res;
          if (this.user) {
            localStorage.removeItem(SystemConstants.CURRENT_USER);
            localStorage.removeItem(SystemConstants.CURRENT_USER_ROLE);
            localStorage.setItem(SystemConstants.CURRENT_USER, JSON.stringify(this.user));
            //this.loadAllMenuUser(this.user);
            this.userRoleValue();
            return this.user;
          }
        }));
  }


  logout() {
    localStorage.removeItem(SystemConstants.CURRENT_USER);
    localStorage.removeItem(SystemConstants.CURRENT_USER_ROLE);
  }

  isUserAuthenticated(): boolean {
    let user = localStorage.getItem(SystemConstants.CURRENT_USER);
    if (user != null) {
      return true;
    }
    else
      return false;
  }

  getLoggedInUser(): LoggedInUser {
    let user: LoggedInUser | null;
    if (this.isUserAuthenticated()) {
      var userData = JSON.parse(localStorage.getItem(SystemConstants.CURRENT_USER) as string);
      user = new LoggedInUser(userData.id, userData.access_token, userData.username, userData.fullname, userData.email, userData.avatar, userData.image);

    }
    else {
      user = null;
    }
    return user!;
  }

  userRoleValue() {
    const id = this.getLoggedInUser().id;
    let headers = new HttpHeaders()
      .set('content-type', 'application/json')

      .set('Access-Control-Allow-Origin', '*').delete("Authorization").append("Authorization", this.getLoggedInUser().access_token);
    this._http.get(this._urlApi.getUrlApiDatabse() + 'AppUserRole/getuserroleid?userId=' + id,{ 'headers': headers }).subscribe((val: any) => {
      localStorage.setItem(SystemConstants.CURRENT_USER_ROLE, JSON.stringify(val));
    });
  }

  // loadAllMenuUser(user: any) {
  //   let headers = new HttpHeaders()
  //     .set('content-type', 'application/json')

  //     .set('Access-Control-Allow-Origin', '*').delete("Authorization").append("Authorization", this.getLoggedInUser().access_token);
  //   this._http.get(this._urlApi.getUrlApiDatabse() + 'appmenus/getmenuuser?id=' + user.id,{'headers': headers }).subscribe((data: any) => {
  //     localStorage.removeItem(SystemConstants.USER_MENUS);
  //     localStorage.setItem(SystemConstants.USER_MENUS, JSON.stringify(data));
  //     console.log('load menu');

  //   })
  // }


  get UserRole(): string[] {
    return JSON.parse(localStorage.getItem(SystemConstants.CURRENT_USER_ROLE) as string);
  }

}
