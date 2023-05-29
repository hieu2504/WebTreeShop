import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemConstants } from 'src/app/core/common/system.constants';
import { UrlConstants } from 'src/app/core/common/url.constants';
import { DataService } from 'src/app/core/services/data.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})
export class InformationComponent implements OnInit {
  form!: FormGroup;
  title!: string;
  pageSizeOptions: number[] = [10, 25, 50, 100];
  pageSize = this.pageSizeOptions[0];
  users: any;
  isChangePass: any = false;
  userInfo: any;
  constructor(
    private dataService: DataService,
    private notification: NotificationService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      userName: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      password: ['', Validators.compose([])],
      fullName: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      phoneNumber: ['', Validators.required],
      email: ['', Validators.compose([Validators.email, Validators.maxLength(50)])],
      image: '',
      address:['', Validators.compose([Validators.required, Validators.maxLength(250)])],
      confirmPassword:['', Validators.compose([])],
      oldpassword:['',Validators.compose([])],
      //emId:['', Validators.compose([Validators.required])]
    },{
      validator: this.ConfirmPasswordValidator("password", "confirmPassword")
    });

  }

  ngOnInit() {
    let current= localStorage.getItem(SystemConstants.CURRENT_USER_SHOP);
    this.userInfo=JSON.parse(current!) ;
    console.log(this.userInfo);

    this.form.controls['userName'].setValue(this.userInfo.username);
    this.form.controls['fullName'].setValue(this.userInfo.fullname);
    this.form.controls['image'].setValue(this.userInfo.image);
    this.form.controls['email'].setValue(this.userInfo.email);
    this.form.controls['phoneNumber'].setValue(this.userInfo.phonenumber);
    this.form.controls['address'].setValue(this.userInfo.address);
  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {

  }

  f = (controlName: string) => {
    return this.form.controls[controlName];
  };
  ChangePass(){
    if(this.isChangePass){
      this.form.controls["password"].setValidators([Validators.minLength(6), Validators.maxLength(50)]);
      this.form.controls["confirmPassword"].setValidators([Validators.minLength(6), Validators.maxLength(50)]);
      this.form.controls["oldpassword"].setValidators([Validators.minLength(6), Validators.maxLength(50)]);
    }else{
      this.form.controls["password"].setValidators([]);
      this.form.controls["confirmPassword"].setValidators([]);
      this.form.controls["oldpassword"].setValidators([]);
    }


  }

  addData() {
    debugger
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
        address: this.form.controls['address'].value,
        oldPassWord: this.form.controls['oldpassword'].value
      }
      this.dataService.postShop('ApplicationUser/update-custommer', user).subscribe(data => {

        this.spinner.hide();
        this.notification.printSuccessMessage('Sửa thành công');
        debugger
        this.userInfo.username = this.form.controls['userName'].value;
        this.userInfo.fullname = this.form.controls['fullName'].value;
        this.userInfo.image = this.form.controls['image'].value;
        this.userInfo.email = this.form.controls['email'].value;
        this.userInfo.phonenumber = this.form.controls['phoneNumber'].value;
        this.userInfo.address = this.form.controls['address'].value;
        localStorage.setItem(SystemConstants.CURRENT_USER_SHOP,JSON.stringify(this.userInfo));

        this.router.navigate([UrlConstants.SHOPPING])
        this.onReset();

      }, err => {
        this.spinner.hide();
          this.notification.printErrorMessage(err.error);

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
