import { HttpClient, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

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
  @ViewChild('dialog') dialogTemplate!: TemplateRef<any>;

  constructor(private formBuilder: FormBuilder, private dialog: MatDialog, private http: HttpClient) {

    this.form = this.formBuilder.group(
      {
        name: ['', Validators.required],
        code: ['', Validators.required,
        ],
        description: [''],
        ordering: [1,Validators.required],
        isActive: [true, Validators.required]
      }

    );
  }

  ngOnInit(): void {

  }

  public f = (controlName: string, errorName: string) =>{
    return this.form.controls[controlName].hasError(errorName);
  }

  onSubmit(): void {

    if (this.form.invalid) {
      return;
    }

    console.log(JSON.stringify(this.form.value, null, 2));
  }

  onReset(): void {
    this.form.reset();
  }

  openDialog(action: string, item?: any, config?: MatDialogConfig) {
    // this.model = {};
    // this.action = action;
    config = { width: '750px' }

    const dialogRef = this.dialog.open(this.dialogTemplate, config);
    dialogRef.afterClosed().subscribe(result => {
      this.onReset();
    });
  }
  addData(){

  }


  uploadFile = (files:any) => {
    if (files.length === 0) {
      return;
    }
    let filesToUpload : File[] = files;

    var pararms = {
      ImgID : "1",
      lstFiles : filesToUpload

    }

    const formData = new FormData();
    formData.append("ImgID", "1");
    Array.from(filesToUpload).map((file, index) => {
      return formData.append('lstFiles', file);
    });
  //  formData.append("lstFiles", filesToUpload[0]);
  //  formData.append("lstFiles", filesToUpload[1]);

debugger

    this.http.post('https://localhost:7248/api/Category/CreateNew1', formData, {reportProgress: true, observe: 'events'})
      .subscribe({
        next: (event:any) => {
        if (event.type === HttpEventType.UploadProgress)
          this.progress = Math.round(100 * event.loaded / event.total);
        else if (event.type === HttpEventType.Response) {
          this.message = 'Upload success.';
          // this.onUploadFinished.emit(event.body);
        }
      },
      error: (err: HttpErrorResponse) => console.log(err)
    });
  }
}
