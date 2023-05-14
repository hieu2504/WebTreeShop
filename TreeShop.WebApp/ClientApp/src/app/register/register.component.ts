import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../core/services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../core/services/notification.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
form!: FormGroup;
title!: string;
action!: string;
pageSizeOptions: number[] = [10, 25, 50, 100];
pageSize = this.pageSizeOptions[0];
users: any;

constructor(
  private dataService: DataService,
  public dialog: MatDialog,
  private notification: NotificationService,
  private formBuilder: FormBuilder,
  private spinner: NgxSpinnerService
) {
  this.form = this.formBuilder.group({
    id: '',
    userName: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
    password: ['', Validators.compose([Validators.required,Validators.maxLength(50), Validators.minLength(6)])],
    fullName: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
    phoneNumber: '',
    email: ['', Validators.compose([Validators.email, Validators.maxLength(50)])],
    image: '',
    createdDate: '',
    createdBy: '',
    updatedBy: '',
    updatedDate: '',
    address:['', Validators.compose([Validators.required, Validators.maxLength(250)])],
    confirmPassword:['', Validators.compose([Validators.required,Validators.maxLength(50), Validators.minLength(6)])],
    //emId:['', Validators.compose([Validators.required])]
  },{
    validator: this.ConfirmPasswordValidator("password", "confirmPassword")
  });

}

ngOnInit() {
  // set initial selection
  // this.bankMultiCtrl.setValue([this.appUsers[1]]);

}

ngAfterViewInit() {

}

ngOnDestroy() {

}



// openDialog(action: string, item?: any, config?: MatDialogConfig) {
//   this.action = action;
//   if (action == 'create') {
//     this.title = 'Thêm mới';
//   } else {

//     this.title = 'Chỉnh sửa';
//     console.log(item)
//     this.form.controls["password"].setValidators([Validators.minLength(6), Validators.maxLength(50)]);
//     this.form.controls['id'].setValue(item.id);
//     this.form.controls['userName'].setValue(item.userName);
//     this.form.controls['fullName'].setValue(item.fullName);
//     this.form.controls['image'].setValue(item.image);
//     this.form.controls['email'].setValue(item.email);
//     this.form.controls['phoneNumber'].setValue(item.phoneNumber);
//     this.form.controls['createdDate'].setValue(item.createdDate);
//     this.form.controls['updatedDate'].setValue(item.updatedDate);

//     this.getRoleByUserID(item.id);


//   }
//   const dialogRef = this.dialog.open(this.dialogTemplate, {
//     width: '750px',
//   });
//   dialogRef.afterClosed().subscribe((result) => {
//     this.onReset();
//   });
// }



f = (controlName: string) => {
  return this.form.controls[controlName];
};

addData() {
  if (this.form.invalid) {
    return;
  }

  if (this.action == 'create') {
    this.spinner.show();

    let user = {
      userName: this.form.controls['userName'].value,
      fullName: this.form.controls['fullName'].value,
      passwordHash: this.form.controls['password'].value,
      phoneNumber: this.form.controls['phoneNumber'].value,
      email: this.form.controls['email'].value,
      image: this.form.controls['image'].value != '' ? this.form.controls['image'].value : null,
      type: 1
    }
    this.dataService.post('ApplicationUser/create', user).subscribe(data => {

      this.spinner.hide();
      this.notification.printSuccessMessage('Thêm mới thành công');
      this.onReset();

    }, err => {
      this.spinner.hide();
      this.notification.printErrorMessage(err.error.message);
    });
  } else if (this.action == 'edit') {
    this.spinner.show();

    let user = {
      id: this.form.controls['id'].value,
      userName: this.form.controls['userName'].value,
      fullName: this.form.controls['fullName'].value,
      passwordHash: this.form.controls['password'].value,
      phoneNumber: this.form.controls['phoneNumber'].value,
      email: this.form.controls['email'].value,
      image: this.form.controls['image'].value != '' ? this.form.controls['image'].value : null,
      type: 1
    }
    this.dataService.post('ApplicationUser/update', user).subscribe(data => {
      this.spinner.hide();
      this.notification.printSuccessMessage('Chỉnh sửa thành công');
      this.onReset();

    }, err => {
      this.spinner.hide();
      this.notification.printErrorMessage(err.error.message);
    });
  }
}

onReset() {
  this.action == '';
  this.dialog.closeAll();
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
