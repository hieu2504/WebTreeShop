import { UserRoles } from './../../core/common/userRole.pipe';
import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemConstants } from 'src/app/core/common/system.constants';
import { DataService } from 'src/app/core/services/data.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { PaginatorCustomService } from 'src/app/core/services/paginator-custom.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {
  contents:any;

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

  displayedColumns: string[] = ['select', 'position', 'name','thumb', 'createdDate','updatedDate', 'published','action'];
  dataSource = new MatTableDataSource<any>();
  page = 0;
  keyword: string = '';
  totalRow: number = 0;
  totalPage: number = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageSize = this.pageSizeOptions[0];
  selection = new SelectionModel<any>(true, []);
  userRoles = [];
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
        published: [true, Validators.required]
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
    this.form.controls['published'].setValue(true);
  }

  openDialog(action: string, item?: any, config?: MatDialogConfig) {
    this.spinner.show();
    this.model = {};
    config = { width: '750px', autoFocus: false }

    const dialogRef = this.dialog.open(this.dialogTemplate, config);
    dialogRef.afterClosed().subscribe(result => {
      this.onReset();
    });
    this.filesToUpload = [];

    this.action = action;
    if(action == 'create'){
      this.title = "Thêm mới";
      this.contents = "";
      this.spinner.hide();
    }else{
      this.contents=item.contents;
      this.filesToUpload = [];
      this.title = 'Chỉnh sửa';
      this.model.postId = item.postId;
      this.model.thumb = item.thumb;
      this.model.createdDate = item.createdDate;
      this.model.updatedDate = item.updatedDate;
      this.form.controls['name'].setValue(item.name);
      this.form.controls['published'].setValue(item.published);
      this.spinner.hide();
    }
  }

  loadData() {
    this.spinner.show();
    this.dataService.get('NewsPost/getlistpaging?page=' + this.page + '&pageSize=' + this.pageSize + '&keyword=' + this.keyword).subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data.items);
      this.totalRow = data.totalCount;
      this.spinner.hide();
    }, err => {
      this.notificationService.printErrorMessage('Không tải được danh sách');
      this.spinner.hide();
    });

  }

  search() {
    this.dataService.get('NewsPost/getlistpaging?page=' + this.page + '&pageSize=' + this.pageSize + '&keyword=' + this.keyword).subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data.items);
      this.totalRow = data.totalCount;
    }, err => {
      this.notificationService.printErrorMessage('Không tải được danh sách');
    });

  }

  addData(){

    if (this.form.invalid) {
      return;
    }
    if(this.contents.length == 0&& this.action == 'create'){
      this.notificationService.printErrorMessage('Nội dung bài viết không được bỏ trống');
      return;
    }
    if(this.filesToUpload.length == 0 && this.action == 'create'){
      this.notificationService.printErrorMessage('Ảnh không được bỏ trống');
      return;
    }
    this.formData = new FormData();
    this.formData.append("Name", this.form.controls['name'].value);
    this.formData.append("Contents", this.contents);
    this.formData.append("Published", this.form.controls['published'].value);
    Array.from(this.filesToUpload).map((file, index) => {
      return this.formData.append('Files', file);
    });
    this.spinner.show();
    if (this.action == 'create') {
      this.dataService.postFile('NewsPost/Create', this.formData).subscribe(data => {
        this.notificationService.printSuccessMessage('Thêm mới thành công');
        this.loadData();
        this.onReset();

      }, (err:any) => {
        this.notificationService.printErrorMessage(err.error.message);
        this.spinner.hide();
      });
    }
    else if (this.action == 'edit') {
      this.formData.append("PostId", this.model.postId);
      this.formData.append("Thumb", this.model.thumb);
      this.formData.append("CreatedDate", this.model.createdDate);
      this.formData.append("UpdatedDate", this.model.updatedDate);
      this.dataService.postFile('NewsPost/Update', this.formData).subscribe(data => {
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
      let id = value.postId;
      roleChecked.push(id);
    });
    this.notificationService.printConfirmationDialog('Bạn chắc chắn muốn xóa?', () => this.deleteItemConfirm(JSON.stringify(roleChecked)));
  }

  deleteItemConfirm(id: string) {
    this.spinner.show();
    this.dataService.delete('NewsPost/DeleteMulti', 'checkedList', id).subscribe(response => {
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
