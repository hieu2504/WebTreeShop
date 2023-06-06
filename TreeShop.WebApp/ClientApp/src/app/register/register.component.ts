import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../core/services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../core/services/notification.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { UrlConstants } from '../core/common/url.constants';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
form!: FormGroup;
title!: string;
pageSizeOptions: number[] = [10, 25, 50, 100];
pageSize = this.pageSizeOptions[0];
users: any;

constructor(
  private dataService: DataService,
  private notification: NotificationService,
  private formBuilder: FormBuilder,
  private spinner: NgxSpinnerService,
  private router: Router
) {
  this.form = this.formBuilder.group({
    id: '',
    userName: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
    password: ['', Validators.compose([Validators.required,Validators.maxLength(50), Validators.minLength(6)])],
    fullName: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
    phoneNumber: ['', Validators.required],
    email: ['', Validators.compose([Validators.email, Validators.maxLength(50)])],
    image: '',
    address:['', Validators.compose([Validators.required, Validators.maxLength(250)])],
    confirmPassword:['', Validators.compose([Validators.required,Validators.maxLength(50), Validators.minLength(6)])],
    //emId:['', Validators.compose([Validators.required])]
  },{
    validator: this.ConfirmPasswordValidator("password", "confirmPassword")
  });

}

ngOnInit() {
}

ngAfterViewInit() {

}

ngOnDestroy() {

}

f = (controlName: string) => {
  return this.form.controls[controlName];
};

addData() {
  if (this.form.invalid) {
    return;
  }
    this.spinner.show();

    let user = {
      userName: this.form.controls['userName'].value,
      fullName: this.form.controls['fullName'].value,
      passwordHash: this.form.controls['password'].value,
      phoneNumber: this.form.controls['phoneNumber'].value,
      email: this.form.controls['email'].value,
      image: this.form.controls['image'].value != '' ? this.form.controls['image'].value : null,
      type: 0,
      address: this.form.controls['address'].value
    }
    this.dataService.postShop('ApplicationUser/create-custommer', user).subscribe(data => {

      this.spinner.hide();
      this.notification.printSuccessMessage('Đăng ký thành công');
      this.router.navigate([UrlConstants.LOGIN])
      this.onReset();

    }, err => {
      this.spinner.hide();
      if(err.error[0].code=="DuplicateUserName"){
        this.notification.printErrorMessage("Tài khoản đã tồn tại");
      }else{
        this.notification.printErrorMessage(err.error[0].code);
      }

    });


}

onReset() {
  this.form.reset();
}

imagePreview(e: any) {
  const file = (e.target as HTMLInputElement).files![0];
  const reader = new FileReader();
  reader.onload = () => {
    let base64String = reader.result as string;
    let img = base64String.split('base64,')[1];
    this.form.controls['image'].setValue(img);
  }
  reader.readAsDataURL(file);

}

clearImage() {
  this.form.controls['image'].setValue('');
}

ConfirmPasswordValidator(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    let control = formGroup.controls[controlName];
    let matchingControl = formGroup.controls[matchingControlName]
    if (
      matchingControl.errors &&
      !matchingControl.errors['confirmPasswordValidator']
    ) {
      return;
    }
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ confirmPasswordValidator: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}

}
