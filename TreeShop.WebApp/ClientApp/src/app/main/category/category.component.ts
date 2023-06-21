import { SelectionModel } from '@angular/cdk/collections';
import { UrlConstants } from './../../core/common/url.constants';
import { HttpClient, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SystemConstants } from 'src/app/core/common/system.constants';
import { DataService } from 'src/app/core/services/data.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { PaginatorCustomService } from 'src/app/core/services/paginator-custom.service';
import { NgxSpinnerService } from 'ngx-spinner';

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
  form!: FormGroup;
  progress!: number ;
  message!: string ;
  title: string = "Thêm mới";
  @ViewChild('dialog') dialogTemplate!: TemplateRef<any>;
  formData = new FormData();
  filesToUpload: File[] = [];
  action = 'create';
  model: any;
  urlImage: any;

  displayedColumns: string[] = ['select', 'position', 'name', 'code', 'description', 'ordering', 'createdDate','updatedDate', 'icon', 'isActive','action'];
  dataSource = new MatTableDataSource<any>();
  page = 0;
  keyword: string = '';
  totalRow: number = 0;
  totalPage: number = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageSize = this.pageSizeOptions[0];
  selection = new SelectionModel<any>(true, []);
  userRoles:any;
  constructor(private formBuilder: FormBuilder, private dialog: MatDialog,
    private http: HttpClient, private dataService: DataService,
    private notificationService: NotificationService,private pagin: PaginatorCustomService, private spinner: NgxSpinnerService) {
    this.urlImage = SystemConstants.URL_IMAGE;

    this.userRoles = JSON.parse(localStorage.getItem(SystemConstants.CURRENT_USER_ROLE)!);
  }

  ngOnInit(): void {
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
this.loadData();

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
    this.model = {};
    config = { width: '750px', autoFocus: false }

    const dialogRef = this.dialog.open(this.dialogTemplate, config);
    dialogRef.afterClosed().subscribe(result => {
      this.onReset();
    });
    this.action = action;
    if(action == 'create'){

      this.title = "Thêm mới";
    }else{
      this.filesToUpload = [];
      this.title = 'Chỉnh sửa';
      this.model.catId = item.catId;
      this.spinner.show();
      this.dataService.get('Category/getbyid/' + this.model.catId).subscribe((data: any) => {

        this.model = data;
        this.form.controls['name'].setValue(this.model.name);
        this.form.controls['code'].setValue(this.model.code);
        this.form.controls['description'].setValue(this.model.description);
        this.form.controls['ordering'].setValue(this.model.ordering);
        this.form.controls['isActive'].setValue(this.model.isActive);
        this.spinner.hide();
      }, err => {
        this.notificationService.printErrorMessage('Không tải loại sản phẩm!');
        this.spinner.hide();
      });
    }
  }

  loadData() {
    this.spinner.show();
    this.dataService.get('Category/getlistpaging?page=' + this.page + '&pageSize=' + this.pageSize + '&keyword=' + this.keyword).subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data.items);
      this.totalRow = data.totalCount;
      this.spinner.hide();
    }, err => {
      this.notificationService.printErrorMessage('Không tải được danh sách!');
      this.spinner.hide();
    });

  }

  search() {
    this.dataService.get('Category/getlistpaging?page=' + this.page + '&pageSize=' + this.pageSize + '&keyword=' + this.keyword).subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data.items);
      this.totalRow = data.totalCount;
    }, err => {
      this.notificationService.printErrorMessage('Không tải được danh sách!');
    });

  }

  addData(){
    if (this.form.invalid) {
      return;
    }
    if(this.filesToUpload.length == 0 && this.action == 'create'){
      this.notificationService.printErrorMessage('Ảnh không được bỏ trống!');
      return;
    }
    this.formData = new FormData();
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
    this.spinner.show();
    if (this.action == 'create') {
      this.dataService.postFile('Category/Create', this.formData).subscribe(data => {
        this.notificationService.printSuccessMessage('Thêm mới thành công');
        this.loadData();
        this.onReset();

      }, (err:any) => {
        this.notificationService.printErrorMessage(err.error.message);
        this.spinner.hide();
      });
    }
    else if (this.action == 'edit') {
      this.formData.append("CatId", this.model.catId);
      this.formData.append("CreatedDate", this.model.createdDate);
      this.formData.append("Icon", this.model.icon);
      this.dataService.postFile('Category/Update', this.formData).subscribe(data => {
        this.notificationService.printSuccessMessage('Chỉnh sửa thành công');
        this.loadData();
        this.onReset();
      }, (err:any) => {
        this.notificationService.printErrorMessage(err.error.message);
        this.spinner.hide();
      });
    }
  }

  removeData() {
    let roleChecked: any[] = [];
    this.selection.selected.forEach((value: any) => {
      let id = value.catId;
      roleChecked.push(id);
    });
    this.notificationService.printConfirmationDialog('Bạn chắc chắn muốn xóa?', () => this.deleteItemConfirm(JSON.stringify(roleChecked)));
  }

  deleteItemConfirm(id: string) {
    this.spinner.show();
    this.dataService.delete('Category/DeleteMulti', 'checkedList', id).subscribe(response => {
      this.notificationService.printSuccessMessage('Xóa thành công');
      this.selection.clear();
      this.loadData();
    }, err => {
      this.spinner.hide();
      this.notificationService.printErrorMessage('Xóa thất bại');
    });
  }

  applyFilter(event: Event) {
    this.keyword = (event.target as HTMLInputElement).value;
    this.page = 0;
    this.search();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
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

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
   /** Selects all rows if they are not all selected; otherwise clear selection. */
   masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);

  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  ngAfterViewInit() {
    // const button = document.getElementsByClassName("role-btn-access")||HTMLButtonElement;
    // for(let i = 0; i<button.length;i++){
    //   button[i].removeAttribute('disabled');
    // }

    this.paginator._intl.itemsPerPageLabel = this.pagin.setLable;
    this.paginator._intl.firstPageLabel = this.pagin.firstButton;
    this.paginator._intl.nextPageLabel = this.pagin.nextButton;
    this.paginator._intl.lastPageLabel = this.pagin.lastButton;
    this.paginator._intl.previousPageLabel = this.pagin.preButton;
  }

  onChangePage(pe: PageEvent) {
    this.page = pe.pageIndex;
    this.pageSize = pe.pageSize;
    this.loadData();
  }
}
