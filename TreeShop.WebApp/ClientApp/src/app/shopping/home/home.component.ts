import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemConstants } from 'src/app/core/common/system.constants';
import { DataService } from 'src/app/core/services/data.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { PaginatorCustomService } from 'src/app/core/services/paginator-custom.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  urlImage:any;
  page = 0;
  keyword: string = '';
  totalRow: number = 0;
  totalPage: number = 0;
  pageSize = 6;
  productBestSaler:any;
  lstShopCart:any = [];

  constructor(
    private spinner: NgxSpinnerService,
    private pagin: PaginatorCustomService,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private notificationService: NotificationService
  ) {
    this.urlImage = SystemConstants.URL_IMAGE;
  }

  ngOnInit(): void {

    this.loadProductBestSale();
  }

  loadProductBestSale(){
      this.spinner.show();
      this.dataService
        .getShop(
          'Product/getlistpaging_shop?page=' +
          this.page +
          '&pageSize=' +
          this.pageSize +
          '&keyword=' +
          this.keyword +
          '&bestSellers=true'
        )
        .subscribe(
          (data: any) => {

            this.productBestSaler = data.items;
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
      localStorage.setItem(SystemConstants.SHOP_CART, JSON.stringify(this.lstShopCart));
    }else{
      var item = {Id : productId, OrderQuantity: 1}
        this.lstShopCart.push(item);
      localStorage.setItem(SystemConstants.SHOP_CART, JSON.stringify(this.lstShopCart));
    }
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
