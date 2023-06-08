import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemConstants } from 'src/app/core/common/system.constants';
import { UrlConstants } from 'src/app/core/common/url.constants';
import { CommonService } from 'src/app/core/services/common.service';
import { DataService } from 'src/app/core/services/data.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-shop-cart',
  templateUrl: './shop-cart.component.html',
  styleUrls: ['./shop-cart.component.css'],
})
export class ShopCartComponent implements OnInit,AfterViewInit {
  urlImage:any;
  lstShopCart:any =[];
  form!: FormGroup;

  constructor(
    private dataService: DataService,
    private notification: NotificationService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private router: Router,
    private service: CommonService
  ) {
    this.urlImage = SystemConstants.URL_IMAGE;

    this.form = this.formBuilder.group({
      id: '',
      fullName: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      phoneNumber: ['', Validators.required],
      address:['', Validators.compose([Validators.required, Validators.maxLength(250)])],
      note:['']

      //emId:['', Validators.compose([Validators.required])]
    });
  }
  payments: any = [];
  paymentId: any;
  orderShop: any = [];
  totalAll:any = 0;
  isOrder = false;
  isNotFoundProduct = true;
  isThanks = false;

  ngOnInit(): void {
    let shopCart = localStorage.getItem(SystemConstants.SHOP_CART);
    debugger
    if (shopCart != null) {
      if(shopCart.length == 2){
        this.isNotFoundProduct = false;
      }else{
        this.isNotFoundProduct = true;
      }

    }else{
      this.isNotFoundProduct = false;
    }
    this.loadPayment();
    this.loadProductOrder();
  }

  ngAfterViewInit(): void {

  }

  formatCash(str: any): string {

    return str
      .split('')
      .reverse()
      .reduce((prev: any, next: any, index: any) => {
        return (index % 3 ? next : next + ',') + prev;
      });
  }

  loadPayment() {
    this.dataService.getShop('Payment/GetAll').subscribe(
      (data: any) => {
        this.payments = data;
        this.paymentId = 1;
      },
      (err) => {}
    );
  }

  loadProductOrder() {
    this.totalAll = 0;
    let shopCart = localStorage.getItem(SystemConstants.SHOP_CART);

    if (shopCart != null) {
      this.lstShopCart = JSON.parse(shopCart);
      console.log(this.lstShopCart);
      this.spinner.show();
      this.dataService
        .getShop('Product/getlist_order_shop?strLstOrder=' + shopCart)
        .subscribe(
          (data: any) => {
            this.orderShop = data;
            console.log(this.orderShop);
            this.orderShop.forEach((element:any) => {
              if(element.discount > 0){
                this.totalAll += Math.round(element.price*element.orderQuantity - element.price*element.orderQuantity*element.discount/100);
              }else{
                this.totalAll += Math.round(element.price*element.orderQuantity);
              }
              for(let i = 0; i<this.lstShopCart.length;i++){
                if(this.lstShopCart[i].Id == element.productId){
                  if(this.lstShopCart[i].OrderQuantity > element.quantity){
                    this.lstShopCart[i].OrderQuantity = element.quantity;
                  }
                  break;
                }
              }
            });
            localStorage.setItem(SystemConstants.SHOP_CART, JSON.stringify(this.lstShopCart));
            let totalQuantity = 0;
            for(var i = 0; i < this.lstShopCart.length; i++) {
              totalQuantity += this.lstShopCart[i].OrderQuantity;
            }
            this.service.changeData(totalQuantity+'');
            this.spinner.hide();
          },
          (err) => {
            this.notification.printErrorMessage('Không tải được danh sách!');
            this.spinner.hide();
          }
        );
    }
  }
  changeQuantity(phep:any, index:any) {
    if(phep == '+'){
      if(this.orderShop[index].orderQuantity < this.orderShop[index].quantity){
        this.orderShop[index].orderQuantity++;
        this.addShopCart(this.orderShop[index].productId,phep);

      }
    }else{
      if(this.orderShop[index].orderQuantity > 1){
        this.orderShop[index].orderQuantity--;
        this.addShopCart(this.orderShop[index].productId,phep);
      }
    }
    this.totalAll = 0;
    this.orderShop.forEach((element:any) => {
      if(element.discount > 0){
        this.totalAll += Math.round(element.price*element.orderQuantity - element.price*element.orderQuantity*element.discount/100);
      }else{
        this.totalAll += Math.round(element.price*element.orderQuantity);
      }
    });
  }

  addShopCart(productId:any,phep:any){
    this.lstShopCart = [];
    let shopCart = localStorage.getItem(SystemConstants.SHOP_CART);
    if(shopCart!=null){
      this.lstShopCart = JSON.parse(shopCart);
      for(var i = 0; i < this.lstShopCart.length; i++) {
        if (this.lstShopCart[i].Id == productId) {
          if(phep == '+'){
            this.lstShopCart[i].OrderQuantity = this.lstShopCart[i].OrderQuantity+1;
          }
          else{
            this.lstShopCart[i].OrderQuantity = this.lstShopCart[i].OrderQuantity-1;
          }
            break;
        }
      }
      localStorage.setItem(SystemConstants.SHOP_CART, JSON.stringify(this.lstShopCart));
      let totalQuantity = 0;
      for(var i = 0; i < this.lstShopCart.length; i++) {
        totalQuantity += this.lstShopCart[i].OrderQuantity;
      }
      this.service.changeData(totalQuantity+'');
    }
  }

  total(price:any, orderQuantity:any, discount:any, index:any):number{
    var total = 0;
    if(discount > 0){
      total = Math.round(price*orderQuantity - price*orderQuantity*discount/100);
    }else{
      total = Math.round(price*orderQuantity);
    }
    this.orderShop[index].totalProduct = total;

    return total;
  }

  deleteProduct(index:any, productId: any){
    let shopCart = localStorage.getItem(SystemConstants.SHOP_CART);
    if(shopCart!=null){
      debugger
      this.lstShopCart = JSON.parse(shopCart);
      var i = this.lstShopCart.findIndex((x:any)=>x.Id== this.orderShop[index].productId && x.OrderQuantity==this.orderShop[index].orderQuantity);
      this.lstShopCart.splice(i,1);
      localStorage.setItem(SystemConstants.SHOP_CART, JSON.stringify(this.lstShopCart));

      //Set Số lượng trong giỏ hàng
      let totalQuantity = 0;
      for(var j = 0; j < this.lstShopCart.length; j++) {
        totalQuantity += this.lstShopCart[i].OrderQuantity;
      }
      this.service.changeData(totalQuantity+'');
    }
    this.orderShop.splice(index,1);
    this.totalAll = 0;
    this.orderShop.forEach((element:any) => {
      if(element.discount > 0){
        this.totalAll += Math.round(element.price*element.orderQuantity - element.price*element.orderQuantity*element.discount/100);
      }else{
        this.totalAll += Math.round(element.price*element.orderQuantity);
      }
    });

  }

  pay(){
    let accShop = localStorage.getItem(SystemConstants.CURRENT_USER_SHOP);
    if(accShop==null){
      this.router.navigate([UrlConstants.LOGIN])
    }else{
      this.isOrder=true;
      debugger
      let accShopping = JSON.parse(accShop);
      this.form.controls['fullName'].setValue(accShopping.fullname);
      this.form.controls['id'].setValue(accShopping.id);
      this.form.controls['phoneNumber'].setValue(accShopping.phonenumber);
      this.form.controls['address'].setValue(accShopping.address);
    }
  }

  getUserById(){

  }

  addData() {
    if (this.form.invalid) {
      return;
    }
      this.spinner.show();

      let order = {
        customerId: this.form.controls['id'].value,
        transactStatusId: 1,
        paid:false,
        paymentId:this.paymentId,
        shippingAddress: this.form.controls['address'].value,
        note: this.form.controls['note'].value,
        phoneNumber: this.form.controls['phoneNumber'].value,
        lstOrderDetails: [{}]
      }
      order.lstOrderDetails = [];
      this.orderShop.forEach((element:any) => {
        let orderDetail = {productId:element.productId, quantity: element.orderQuantity, discount: element.discount, total:element.totalProduct}
        order.lstOrderDetails.push(orderDetail)
      });
      debugger
      this.dataService.postShop('Order/Create', order).subscribe(data => {
        this.spinner.hide();
        this.notification.printSuccessMessage('Đặt hàng thành công');
        // this.router.navigate([UrlConstants.LOGIN])
        this.isThanks = true;
        localStorage.removeItem(SystemConstants.SHOP_CART);
        this.service.changeData('0');
        this.onReset();
      }, err => {
        debugger
        console.log(err);
        this.loadProductOrder();
        this.spinner.hide();
        this.notification.printErrorMessage(err.error.text);

      });


  }

  onReset() {
    this.form.reset();
  }

  f = (controlName: string) => {
    return this.form.controls[controlName];
  };

  trangChu(){
    location.href = "/shopping";
  }

}
