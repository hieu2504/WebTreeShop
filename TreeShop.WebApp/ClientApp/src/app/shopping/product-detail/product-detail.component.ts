import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemConstants } from 'src/app/core/common/system.constants';
import { DataService } from 'src/app/core/services/data.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { PaginatorCustomService } from 'src/app/core/services/paginator-custom.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  currentImg = 0;
  urlImage:any;
  id: any;
  product:any;
  newPrice:any;
  quantityMin: any = 0;
  constructor( private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private notificationService: NotificationService
  ) {
    this.urlImage = SystemConstants.URL_IMAGE;
  }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProductById();
  }

  loadProductById(){
    this.spinner.show();
    this.dataService.getShop('Product/getbyid/' + this.id).subscribe((data: any) => {
      this.product = data;
      this.newPrice =Math.round(this.product.price - this.product.price*this.product.discount/100);
      this.quantityMin = this.product.quantity > 0? 1:0;
      this.quantityPro  = this.product.quantity > 0? 1:0;
      console.log(this.product);
      this.spinner.hide();
    }, err => {
      this.notificationService.printErrorMessage('Không tải được chi tiết sản phẩm');
      this.spinner.hide();
    });
  }

  formatCash(str: any): string {
    return str
      .split('')
      .reverse()
      .reduce((prev: any, next: any, index: any) => {
        return (index % 3 ? next : next + ',') + prev;
      });
  }

  lstShopCart:any;
  quantityPro = 1;
  addShopCart(productId:any){
    debugger
    if(!Number.isInteger(this.quantityPro)){
      this.notificationService.printErrorMessage('Số lượng không hợp lệ')
      return
    }
    if(this.quantityPro < 0){
      this.notificationService.printErrorMessage('Số lượng không hợp lệ')
      return
    }
    console.log();
    this.lstShopCart = [];
    let shopCart = localStorage.getItem(SystemConstants.SHOP_CART);
    if(shopCart!=null){
      this.lstShopCart = JSON.parse(shopCart);
      var found = false;
      for(var i = 0; i < this.lstShopCart.length; i++) {
        if (this.lstShopCart[i].Id == productId) {
          this.lstShopCart[i].OrderQuantity = this.lstShopCart[i].OrderQuantity+this.quantityPro;
            found = true;
            break;
        }
      }
      if(!found){
        var item = {Id : productId, OrderQuantity: this.quantityPro}
        this.lstShopCart.push(item);
      }
      localStorage.setItem(SystemConstants.SHOP_CART, JSON.stringify(this.lstShopCart));
    }else{
      var item = {Id : productId, OrderQuantity: 1}
        this.lstShopCart.push(item);
      localStorage.setItem(SystemConstants.SHOP_CART, JSON.stringify(this.lstShopCart));
    }
  }

}
