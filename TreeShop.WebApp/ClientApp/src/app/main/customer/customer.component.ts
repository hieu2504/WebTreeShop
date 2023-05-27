import { Observable } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from 'src/app/core/services/data.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NotificationService } from 'src/app/core/services/notification.service';
import { PaginatorCustomService } from 'src/app/core/services/paginator-custom.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageConstants } from 'src/app/core/common/message.constants';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  displayedColumns: string[] = [
    'position',
    'userName',
    'fullName',
    'phoneNumber',
    'email',
    'address',
    'createdDate',
    'updatedDate',
    'action',
  ];
  dataSource = new MatTableDataSource<any>();
  page = 0;
  keyword: string = '';
  totalRow: number = 0;
  totalPage: number = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('dialog') dialogTemplate!: TemplateRef<any>;
  selection = new SelectionModel<any>(true, []);
  form!: FormGroup;
  title!: string;
  action!: string;
  pageSizeOptions: number[] = [10, 25, 50, 100];
  pageSize = this.pageSizeOptions[0];
  isAllChecked = false;
  filteredOptions!: Observable<any[]>;
  users: any;

  constructor(
    private dataService: DataService,
    public dialog: MatDialog,
    private notification: NotificationService,
    private pagin: PaginatorCustomService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService
  ) {
    this.form = this.formBuilder.group({
      id: '',
      userName: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      fullName: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      phoneNumber: '',
      email: ['', Validators.compose([Validators.email, Validators.maxLength(50)])],
      image: '',
      createdDate: '',
      updatedDate: '',
      address:''
      //emId:['', Validators.compose([Validators.required])]
    });

  }

  ngOnInit() {
    this.getAllUser();
  }

  ngAfterViewInit() {
    this.paginator._intl.itemsPerPageLabel = this.pagin.setLable;
    this.paginator._intl.firstPageLabel = this.pagin.firstButton;
    this.paginator._intl.nextPageLabel = this.pagin.nextButton;
    this.paginator._intl.lastPageLabel = this.pagin.lastButton;
    this.paginator._intl.previousPageLabel = this.pagin.preButton;

  }


  openDialog(action: string, item?: any, config?: MatDialogConfig) {
    this.action = action;
      this.title = 'Thông tin';
      this.form.controls['id'].setValue(item.id);
      this.form.controls['userName'].setValue(item.userName);
      this.form.controls['fullName'].setValue(item.fullName);
      this.form.controls['image'].setValue(item.image);
      this.form.controls['email'].setValue(item.email);
      this.form.controls['phoneNumber'].setValue(item.phoneNumber);
      this.form.controls['createdDate'].setValue(item.createdDate);
      this.form.controls['updatedDate'].setValue(item.updatedDate);
      this.form.controls['address'].setValue(item.address);
    const dialogRef = this.dialog.open(this.dialogTemplate, {
      width: '750px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.onReset();
    });
  }

  getAllUser() {
    this.spinner.show();
    this.dataService
      .get(
        'ApplicationUser/getlistcustomer?page=' +
          this.page +
          '&pageSize=' +
          this.pageSize +
          '&keyword=' +
          this.keyword
      )
      .subscribe(
        (data: any) => {
          this.spinner.hide();

          this.dataSource = new MatTableDataSource(data.items);
          this.totalRow = data.totalCount;
          console.log(data);
        },
        (err) => {
          this.spinner.hide();
          this.notification.printErrorMessage(MessageConstants.GET_FAILSE_MSG);
        }
      );
  }

  search() {
    this.dataService
      .get(
        'ApplicationUser/getlistcustomer?page=' +
          this.page +
          '&pageSize=' +
          this.pageSize +
          '&keyword=' +
          this.keyword
      )
      .subscribe(
        (data: any) => {
          this.dataSource = new MatTableDataSource(data.items);
          this.totalRow = data.totalCount;
          console.log(data);
        },
        (err) => {
          this.notification.printErrorMessage(MessageConstants.GET_FAILSE_MSG);
        }
      );
  }

  applyFilter(event: Event) {
    //const filterValue = (event.target as HTMLInputElement).value;
    this.keyword = (event.target as HTMLInputElement).value;
    this.page = 0;
    this.search();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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



  f = (controlName: string) => {
    return this.form.controls[controlName];
  };

  addData() {
    if (this.form.invalid) {
      return;
    }
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
        this.getAllUser();

      }, err => {
        this.spinner.hide();
        this.notification.printErrorMessage(err.error.message);
      });

  }

  onReset() {
    this.action == '';
    this.dialog.closeAll();
    this.form.reset();
  }

  removeData() {
    let roleChecked: any[] = [];
    this.selection.selected.forEach((value: any) => {
      let id = value.id;
      roleChecked.push(id);
    });
    this.notification.printConfirmationDialog(
      MessageConstants.CONFIRM_DELETE_MSG,
      () => this.deleteItemConfirm(JSON.stringify(roleChecked))
    );
  }

  deleteItemConfirm(id: string) {
    this.dataService
      .delete('ApplicationUser/deletemulti', 'checkedList', id)
      .subscribe(
        (response:any) => {
          console.log(response)
          this.notification.printSuccessMessage(
            response[0] + " bản ghi"
          );
          this.selection.clear();
          this.getAllUser();
        },
        (err) => {
          this.notification.printErrorMessage(
            MessageConstants.DELETE_FAILSE_MSG
          );
        }
      );
  }

  onChangePage(pe: PageEvent) {
    this.page = pe.pageIndex;
    this.pageSize = pe.pageSize;
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
}

