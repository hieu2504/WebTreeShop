import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemConstants } from 'src/app/core/common/system.constants';
import { DataService } from 'src/app/core/services/data.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { PaginatorCustomService } from 'src/app/core/services/paginator-custom.service';

@Component({
  selector: 'app-revenue-statistic',
  templateUrl: './revenue-statistic.component.html',
  styleUrls: ['./revenue-statistic.component.css']
})
export class RevenueStatisticComponent implements OnInit {

  urlImage: any;
  page: any = 0;

  fromDate :any;
  toDate :any;
  payId:any;
  transId:any;
  message!: string ;

  displayedColumns: string[] = ['position', 'fullName', 'orderId', 'phoneNumber', 'payDescription', 'tranDescription','orderDate', 'paymentDate','totalOrder'];
  dataSource = new MatTableDataSource<any>();
  totalRow: number = 0;
  totalPage: number = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageSize = this.pageSizeOptions[0];
  totalRevenue: any = 0;


  constructor(private dialog: MatDialog,
    private http: HttpClient, private dataService: DataService, private datePipe: DatePipe,
    private notificationService: NotificationService,private pagin: PaginatorCustomService, private spinner: NgxSpinnerService) {
    this.urlImage = SystemConstants.URL_IMAGE;

  }

  ngOnInit(): void {
    this.reset();
  }

  reset(){
    this.fromDate = this.datePipe.transform(new Date(), "yyyy-MM-ddT00:00:00");
    this.toDate = this.datePipe.transform(new Date(), "yyyy-MM-ddT23:59:59");

  }



  loadData() {
    this.spinner.show();

    this.dataService.get('Order/getallrevenue?page=' + this.page + '&pageSize=' + this.pageSize + '&fromDate=' + this.fromDate + '&toDate='+this.toDate).subscribe((data: any) => {

      this.dataSource = new MatTableDataSource(data.items);
      this.totalRow = data.totalCount;
      this.totalRevenue = data.total;
      this.spinner.hide();
    }, err => {
      this.notificationService.printErrorMessage('Không tải được danh sách!');
      this.spinner.hide();
    });

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

}
