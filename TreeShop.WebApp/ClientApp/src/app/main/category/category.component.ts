import { HttpClient, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DataService } from 'src/app/core/services/data.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  // form: FormGroup = new FormGroup({
  //   fullname: new FormControl(''),
  //   username: new FormControl(''),
  //   email: new FormControl(''),
  //   password: new FormControl(''),
  //   confirmPassword: new FormControl(''),
  //   acceptTerms: new FormControl(false),
  // });
  // submitted = false;
  form: FormGroup;
  progress!: number ;
  message!: string ;
  title: string = "Thêm mới";
  @ViewChild('dialog') dialogTemplate!: TemplateRef<any>;
  formData = new FormData();
  filesToUpload: File[] = [];
  preventAbuse = false;
  action = 'create';
  constructor(private formBuilder: FormBuilder, private dialog: MatDialog, private http: HttpClient, private dataService: DataService, private notificationService: NotificationService) {

    this.form = this.formBuilder.group(
      {
        name: ['', Validators.required],
        code: ['', Validators.required,
        ],
        description: [''],
        ordering: [1,Validators.required],
        isActive: [true, Validators.required],
      }

    );
  }

  ngOnInit(): void {

  }

  public f = (controlName: string, errorName: string) =>{
    return this.form.controls[controlName].hasError(errorName);
  }



  onReset(): void {
    this.action == '';
    this.form.reset();
    this.dialog.closeAll();
    this.form.controls['ordering'].setValue(1);
    this.form.controls['isActive'].setValue(true);
  }

  openDialog(action: string, item?: any, config?: MatDialogConfig) {
    // this.model = {};
    // this.action = action;
    config = { width: '750px', autoFocus: false }

    const dialogRef = this.dialog.open(this.dialogTemplate, config);
    dialogRef.afterClosed().subscribe(result => {
      this.onReset();
    });
    this.action = action;
    if(action == 'create'){
      this.title = "Thêm mới";
    }
  }
  addData(){
    if (this.form.invalid) {
      return;
    }
    debugger
    if(this.filesToUpload.length == 0){
      this.notificationService.printErrorMessage('Bắt buộc chọn ảnh!');
      return;
    }
    this.formData = new FormData();
    this.preventAbuse = true;
var a =  this.form.controls['code'].value;
    this.formData.append("Code", this.form.controls['code'].value);
    this.formData.append("Name", this.form.controls['name'].value);
    this.formData.append("Description", this.form.controls['description'].value);
    this.formData.append("Ordering", this.form.controls['ordering'].value);
    this.formData.append("IsActive", this.form.controls['isActive'].value);
    Array.from(this.filesToUpload).map((file, index) => {
      return this.formData.append('Files', file);
    });

    // this.model.name=this.form.controls['name'].value;
    // this.model.description=this.form.controls['description'].value;
    // this.model.status=this.form.controls['status'].value;
    // if(this.form.controls['image'].value == ''){
    //   this.form.controls['image'].setValue(null) ;
    // }
    // this.model.image=this.form.controls['image'].value;
    if (this.action == 'create') {
      this.dataService.postFile('Category/create', this.formData).subscribe(data => {
        this.notificationService.printSuccessMessage('Thêm mới thành công');
        this.preventAbuse = false;
        // this.loadData();
        this.onReset();
      }, (err:any) => {
        this.notificationService.printErrorMessage('Thêm mới thất bại!');
        this.notificationService.printErrorMessage(err.error.message);
        this.preventAbuse = false;
      });
    }
    else if (this.action == 'edit') {
      // this.dataService.put('productcategory/update', this.model).subscribe(data => {
      //   this.notificationService.printSuccessMessage('Chỉnh sửa thành công');
      //   this.preventAbuse = false;
      //   this.loadData();
      //   this.onReset();
      // }, (err:any) => {
      //   this.notificationService.printErrorMessage('Chỉnh sửa thất bại');
      //   this.notificationService.printErrorMessage(err.error.message);
      //   this.preventAbuse = false;
      // });
    }
  }


  uploadFile = (files:any) => {
    // if (files.length === 0) {
    //   return;
    // }
    this.filesToUpload = files;

    // var pararms = {
    //   ImgID : "1",
    //   lstFiles : filesToUpload

    // }

//     const formData = new FormData();
//     formData.append("ImgID", "1");
//     Array.from(filesToUpload).map((file, index) => {
//       return formData.append('lstFiles', file);
//     });
//   //  formData.append("lstFiles", filesToUpload[0]);
//   //  formData.append("lstFiles", filesToUpload[1]);

// debugger

    // this.http.post('https://localhost:7248/api/Category/CreateNew1', formData, {reportProgress: true, observe: 'events'})
    //   .subscribe({
    //     next: (event:any) => {
    //     if (event.type === HttpEventType.UploadProgress)
    //       this.progress = Math.round(100 * event.loaded / event.total);
    //     else if (event.type === HttpEventType.Response) {
    //       this.message = 'Upload success.';
    //       // this.onUploadFinished.emit(event.body);
    //     }
    //   },
    //   error: (err: HttpErrorResponse) => console.log(err)
    // });
  }
}
