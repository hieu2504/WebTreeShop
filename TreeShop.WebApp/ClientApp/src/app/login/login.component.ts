import { Component, OnInit } from '@angular/core';
import { AuthenService } from '../core/services/authen.service';
import { NotificationService } from '../core/services/notification.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UrlConstants } from '../core/common/url.constants';
import { MessageConstants } from '../core/common/message.constants';
import { SystemConstants } from '../core/common/system.constants';
import { NgxSpinnerService } from 'ngx-spinner';
import { UrlApiService } from '../core/services/url-api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  model: any ={};
  returlUrl: string |undefined;
  loginForm:any;
  preventAbuse = false;



  constructor(private authenService: AuthenService,private notificationService: NotificationService,
    private router: Router, private httpClient:HttpClient, private spinner: NgxSpinnerService, private _urlApi:UrlApiService) {
  }


  login(){
    if(!this.validate()){
      return;
    }
    this.spinner.show();
    this.preventAbuse = true;
    this.authenService.login(this.model).subscribe(data => {
      this.spinner.hide();
      debugger
      if(data.type == 1){
        const id = this.authenService.getLoggedInUser().id;
              let headers = new HttpHeaders()
                .set('content-type', 'application/json')

                .set('Access-Control-Allow-Origin', '*').delete("Authorization").append("Authorization", this.authenService.getLoggedInUser().access_token);
               this.httpClient.get(this._urlApi.getUrlApiDatabse() + 'AppUserRole/getuserroleid?userId=' + id,{ 'headers': headers }).subscribe((val: any) => {
                localStorage.setItem(SystemConstants.CURRENT_USER_ROLE, JSON.stringify(val));
                this.router.navigate([UrlConstants.HOME]); this.preventAbuse = false;
              });

      }else{
        // trang bán hàng
        this.router.navigate([UrlConstants.SHOPPING])
      }


     },
      err => {
        this.spinner.hide();
        if (err.status === 401) {
          this.notificationService.printErrorMessage(MessageConstants.SYS_ERROR_LOGIN_FAILSE);
        }
        else {
          this.notificationService.printErrorMessage(MessageConstants.SYS_ERROR_LOGIN_FAILSE);
        }
        this.preventAbuse = false;

      });
  }

  validate():boolean{
    if(this.model.username==undefined){
      return false;
    }
    else if(this.model.password==undefined){
      return false;
    }
    else
    return true;
  }


  ngOnInit(): void {
    localStorage.removeItem(SystemConstants.CURRENT_USER);
    localStorage.removeItem(SystemConstants.CURRENT_USER_ROLE);
  }

  register(){
    this.router.navigate([UrlConstants.REGISTER]);
  }

}
