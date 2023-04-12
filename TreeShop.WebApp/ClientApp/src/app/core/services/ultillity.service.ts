import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UrlConstants } from '../common/url.constants';
import { AuthenService } from './authen.service';

@Injectable({
  providedIn: 'root'
})
export class UltillityService {
  private _router: Router;
  constructor(router: Router, private http: HttpClient) {
    this._router = router;
  }

  navigate(path: string) {
    this._router.navigate([path]);
  }

  navigateToLogin() {
    this._router.navigate([UrlConstants.LOGIN]);
  }
}
