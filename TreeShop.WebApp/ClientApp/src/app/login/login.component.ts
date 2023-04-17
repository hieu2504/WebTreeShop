import { Component, OnInit } from '@angular/core';
import { AuthenService } from '../core/services/authen.service';
import { NotificationService } from '../core/services/notification.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UrlConstants } from '../core/common/url.constants';
import { MessageConstants } from '../core/common/message.constants';
import { SystemConstants } from '../core/common/system.constants';

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


  constructor(private authenService: AuthenService,private notificationService: NotificationService, private router: Router, private httpClient:HttpClient) {
  }


  login(){
    if(!this.validate()){
      return;
    }
    this.preventAbuse = true;
    this.authenService.login(this.model).subscribe(data => {
      console.log(data);
        this.router.navigate([UrlConstants.HOME]); this.preventAbuse = false;

     },
      err => {
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

}
