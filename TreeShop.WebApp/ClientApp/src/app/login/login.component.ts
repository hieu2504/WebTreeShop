import { Component, OnInit } from '@angular/core';
import { AuthenService } from '../core/services/authen.service';
import { NotificationService } from '../core/services/notification.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UrlConstants } from '../core/common/url.constants';
import { MessageConstants } from '../core/common/message.constants';
import { SystemConstants } from '../core/common/system.constants';
import { NgxSpinnerService } from 'ngx-spinner';

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
    private router: Router, private httpClient:HttpClient, private spinner: NgxSpinnerService) {
  }


  login(){
    if(!this.validate()){
      return;
    }
    this.spinner.show();
    this.preventAbuse = true;
    this.authenService.login(this.model).subscribe(data => {
      this.spinner.hide();
      if(data.type == 1){
        this.router.navigate([UrlConstants.HOME]); this.preventAbuse = false;
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
