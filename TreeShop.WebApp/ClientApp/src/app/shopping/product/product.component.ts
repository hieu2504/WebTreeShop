import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemConstants } from 'src/app/core/common/system.constants';
import { CommonService } from 'src/app/core/services/common.service';
import { DataService } from 'src/app/core/services/data.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { PaginatorCustomService } from 'src/app/core/services/paginator-custom.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  urlImage:any;
  page = 0;
  keyword: string = '';
  totalRow: number = 0;
  totalPage: number = 0;
  products:any;
  productShow:any;
  lstShopCart:any = [];
  categories:any =[];
  categoryFilter:any="";
  pageSizeOptions: number[] = [3, 12, 18];
  pageSize = this.pageSizeOptions[0];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private spinner: NgxSpinnerService,
    private pagin: PaginatorCustomService,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private notificationService: NotificationService,
    private service: CommonService
  ) {
    this.urlImage = SystemConstants.URL_IMAGE;
  }

  ngOnInit(): void {
    this.loadCategory();
    this.loadProduct();
    this.scrollToTop();
  }

  loadProduct(){
      this.spinner.show();
      this.dataService
        .getShop(
          'Product/getlistpaging_shop?page=' +
          this.page +
          '&pageSize=' +
          this.pageSize +
          '&keyword=' +
          this.keyword
        )
        .subscribe(
          (data: any) => {

            this.products = data.items;
            this.productShow = data.items;
            this.totalRow = data.totalCount;
            this.spinner.hide();
          },
          (err) => {
            this.notificationService.printErrorMessage(
              'Không tải được danh sách!'
            );
            this.spinner.hide();
          }
        );
  }

  addShopCart(productId:any){
    let shopCart = localStorage.getItem(SystemConstants.SHOP_CART);
    this.lstShopCart = [];
    if(shopCart!=null){
      this.lstShopCart = JSON.parse(shopCart);
      var found = false;
      for(var i = 0; i < this.lstShopCart.length; i++) {
        if (this.lstShopCart[i].Id == productId) {
          this.lstShopCart[i].OrderQuantity = this.lstShopCart[i].OrderQuantity+1;
            found = true;
            break;
        }
      }
      if(!found){
        var item = {Id : productId, OrderQuantity: 1}
        this.lstShopCart.push(item);
      }
      this.notificationService.printSuccessMessage('Thêm thành công');
      localStorage.setItem(SystemConstants.SHOP_CART, JSON.stringify(this.lstShopCart));
      let totalQuantity = 0;
      for(var i = 0; i < this.lstShopCart.length; i++) {
          totalQuantity += this.lstShopCart[i].OrderQuantity;
      }
      this.service.changeData(totalQuantity+'');
    }else{
      var item = {Id : productId, OrderQuantity: 1}
        this.lstShopCart.push(item);
        this.notificationService.printSuccessMessage('Thêm thành công');
      localStorage.setItem(SystemConstants.SHOP_CART, JSON.stringify(this.lstShopCart));
      let totalQuantity = 0;
      for(var i = 0; i < this.lstShopCart.length; i++) {
          totalQuantity += this.lstShopCart[i].OrderQuantity;
      }
      this.service.changeData(totalQuantity+'');
    }
  }

  loadCategory() {
    this.dataService.getShop('Category/GetAll').subscribe(
      (data: any) => {
        this.categories = data;
      },
      (err) => {
        this.notificationService.printErrorMessage('Không tải được danh sách!');
      }
    );
  }

  filterProduct(catId: any, name:any){
    this.productShow = this.products.filter((pro:any) => pro.catId ==catId);
    this.categoryFilter = " / "+name.toUpperCase();
  }

  formatCash(str: any): string {
    return str
      .split('')
      .reverse()
      .reduce((prev: any, next: any, index: any) => {
        return (index % 3 ? next : next + ',') + prev;
      });
  }

  formatCashNewPrice(price: any, discount: any): string {
    var str = (Math.round(price - price*discount/100)).toString();
    return str
      .split('')
      .reverse()
      .reduce((prev: any, next: any, index: any) => {
        return (index % 3 ? next : next + ',') + prev;
      });
  }

  hetHang(){
    this.notificationService.printErrorMessage('Sản phẩm đã hết hàng');
  }
  onChangePage(pe: PageEvent) {
    this.page = pe.pageIndex;
    this.pageSize = pe.pageSize;
    this.loadProduct();
  }
  ngAfterViewInit() {
    this.paginator._intl.itemsPerPageLabel = this.pagin.setLable;
    this.paginator._intl.firstPageLabel = this.pagin.firstButton;
    this.paginator._intl.nextPageLabel = this.pagin.nextButton;
    this.paginator._intl.lastPageLabel = this.pagin.lastButton;
    this.paginator._intl.previousPageLabel = this.pagin.preButton;
  }

  scrollToTop() {
    (function smoothscroll() {

      const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
      if (currentScroll > 0) {
        window.requestAnimationFrame(smoothscroll);
        window.scrollTo(0, currentScroll - (currentScroll / 5));
      }
    })();
  }
}
