import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
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
  fromDate:any;
  toDate:any;
  payId:any;
  transId:any;
  constructor(private formBuilder: FormBuilder, private dialog: MatDialog,
    private http: HttpClient, private dataService: DataService,
    private notificationService: NotificationService,private pagin: PaginatorCustomService, private spinner: NgxSpinnerService) {
    this.urlImage = SystemConstants.URL_IMAGE;

  }

  form!: FormGroup;
  progress!: number ;
  message!: string ;
  title: string = "Chỉnh sửa";
  @ViewChild('dialog') dialogTemplate!: TemplateRef<any>;
  formData = new FormData();
  filesToUpload: File[] = [];

  displayedColumns: string[] = ['position', 'name', 'code', 'description', 'ordering', 'createdDate','updatedDate', 'icon', 'isActive','action'];
  dataSource = new MatTableDataSource<any>();
  totalRow: number = 0;
  totalPage: number = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageSize = this.pageSizeOptions[0];
  model:any;
  Payments: any;
  TransactStatus: any;

  ngOnInit(): void {
  }

  loadData() {
    this.spinner.show();
    this.dataService.get('Order/getallorder?page=' + this.page + '&pageSize=' + this.pageSize + '&fromDate=' + this.fromDate + '&toDate='+this.toDate
    +'&payId='+this.payId+'&transId'+this.transId).subscribe((data: any) => {
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
      this.model.catId = item.catId;
      this.spinner.show();
      this.dataService.get('Order/getbyid/' + this.model.catId).subscribe((data: any) => {

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

}
