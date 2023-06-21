import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageConstants } from 'src/app/core/common/message.constants';
import { SystemConstants } from 'src/app/core/common/system.constants';
import { DataService } from 'src/app/core/services/data.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { PaginatorCustomService } from 'src/app/core/services/paginator-custom.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit,AfterViewInit {
  urlImage: any;
  page: any = 0;

  fromDate :any;
  toDate :any;
  payId:any;
  transId:any;
  form!: FormGroup;
  progress!: number ;
  message!: string ;
  title: string = "Chỉnh sửa";
  @ViewChild('dialog') dialogTemplate!: TemplateRef<any>;
  formData = new FormData();
  filesToUpload: File[] = [];

  displayedColumns: string[] = ['position', 'fullName', 'orderId', 'phoneNumber', 'payDescription', 'tranDescription','totalOrder','action'];
  displayedColumns1: string[] = ['position', 'title','code', 'price', 'discount', 'total'];
  dataSource = new MatTableDataSource<any>();
  dataSource1 = new MatTableDataSource<any>();
  totalRow: number = 0;
  totalPage: number = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageSize = this.pageSizeOptions[0];
  model:any;
  Payments: any;
  TransactStatus: any;
  fullName: any;
  phoneNumber:any;
  totalAll: any = 0;
  userRoles:[];

  constructor(private formBuilder: FormBuilder, private dialog: MatDialog,
    private http: HttpClient, private dataService: DataService, private datePipe: DatePipe,
    private notificationService: NotificationService,private pagin: PaginatorCustomService, private spinner: NgxSpinnerService) {
    this.urlImage = SystemConstants.URL_IMAGE;
    this.form = this.formBuilder.group({
      _orderId: [''],
      _fullName: ['', Validators.compose([Validators.required])],
      _paymentId:[0,Validators.required],
      _transactStatusId:[0,Validators.required],
      _phoneNumber: ['',Validators.required],
      _shippingAddress:['',Validators.required],
      _note:['']
    });
    this.userRoles = JSON.parse(localStorage.getItem(SystemConstants.CURRENT_USER_ROLE)!);
  }

  ngOnInit(): void {
    this.loadPayment();
    this.loadTransactStatus();
    this.reset();
  }

  reset(){
    this.fromDate = this.datePipe.transform(new Date(), "yyyy-MM-ddT00:00:00");
    this.toDate = this.datePipe.transform(new Date(), "yyyy-MM-ddT23:59:59");
    this.payId = 0;
    this.transId = 0;
    this.fullName = "";
    this.phoneNumber = "";
  }

  loadPayment() {
    this.dataService.get('Payment/GetAll').subscribe(
      (data: any) => {
        this.Payments = data;
      },
      (err) => {
        //this.notificationService.printErrorMessage('Không tải được danh sách!');
      }
    );
  }

  loadTransactStatus() {
    this.dataService.get('TransactStatus/GetAll').subscribe(
      (data: any) => {
        this.TransactStatus = data;
      },
      (err) => {
        //this.notificationService.printErrorMessage('Không tải được danh sách!');
      }
    );
  }

  loadData() {
    if(this.fromDate > this.toDate){
      this.notificationService.printErrorMessage('Thời gian từ ngày không được lớn hơn đến ngày');
      return
    }
    this.spinner.show();

    this.dataService.get('Order/getallorder?page=' + this.page + '&pageSize=' + this.pageSize + '&fromDate=' + this.fromDate + '&toDate='+this.toDate
    +'&payId='+this.payId+'&transId='+this.transId + '&fullName='+this.fullName+'&phoneNumber='+this.phoneNumber).subscribe((data: any) => {

      this.dataSource = new MatTableDataSource(data.items);
      this.totalRow = data.totalCount;
      this.spinner.hide();
    }, err => {
      this.notificationService.printErrorMessage('Không tải được danh sách!');
      this.spinner.hide();
    });

  }

  openDialog(item?: any, config?: MatDialogConfig) {

    this.model = {};
    config = { width: '750px', autoFocus: false }

    const dialogRef = this.dialog.open(this.dialogTemplate, config);
    dialogRef.afterClosed().subscribe(result => {
      this.onReset();
    });


      this.filesToUpload = [];
      this.title = 'Chỉnh sửa';
      this.model = item;

      this.spinner.show();
      this.dataService.get('Order/getbyid/' + this.model.orderId).subscribe((data: any) => {
        this.totalAll = 0;
        this.dataSource1 = data;
        console.log(this.dataSource1);
        this.form.controls['_orderId'].setValue(this.model.orderId);
        this.form.controls['_fullName'].setValue(this.model.fullName);
        this.form.controls['_paymentId'].setValue(this.model.payId);
        this.form.controls['_transactStatusId'].setValue(this.model.transactStatusId);
        this.form.controls['_phoneNumber'].setValue(this.model.phoneNumber);
        this.form.controls['_shippingAddress'].setValue(this.model.shippingAddress);
        this.form.controls['_note'].setValue(this.model.note);
        data.forEach((element:any) => {
            this.totalAll += Math.round(element.total);
        });
        this.spinner.hide();
      }, err => {
        this.notificationService.printErrorMessage('Không tải loại sản phẩm!');
        this.spinner.hide();
      });

  }

  f = (controlName: string) => {
    return this.form.controls[controlName];
  };

  onReset(): void {
    this.form.reset();
    this.dialog.closeAll();
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

  formatCash(str: any): string {
    return str
      .split('')
      .reverse()
      .reduce((prev: any, next: any, index: any) => {
        return (index % 3 ? next : next + ',') + prev;
      });
  }

  addData(){
    this.spinner.show();
    let orderUpdate = {
      orderId: this.form.controls['_orderId'].value,
      transactStatusId: this.form.controls['_transactStatusId'].value,
      payId: this.form.controls['_paymentId'].value,
      note: this.form.controls['_note'].value,
      shippingAddress: this.form.controls['_shippingAddress'].value,
      phoneNumber:this.form.controls['_phoneNumber'].value
    };
    this.dataService.post('Order/UpdateOrder', orderUpdate).subscribe(
      (data) => {
        this.notificationService.printSuccessMessage(
          MessageConstants.UPDATED_OK_MSG
        );
        this.loadData();
        this.dialog.closeAll();
        this.onReset();
      },
      (err) => {
        this.spinner.hide();
        this.notificationService.printErrorMessage(err.error);
      }
    );
  }

}
