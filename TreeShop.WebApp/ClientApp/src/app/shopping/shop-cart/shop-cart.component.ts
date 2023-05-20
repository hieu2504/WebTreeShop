import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from 'src/app/core/services/data.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-shop-cart',
  templateUrl: './shop-cart.component.html',
  styleUrls: ['./shop-cart.component.css']
})
export class ShopCartComponent implements OnInit {

  constructor(  private dataService: DataService,
    private notification: NotificationService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private router: Router) { }
  payments:any = [];
    paymentId:any;
  ngOnInit(): void {
    this.loadPayment();
  }


  formatCash(str:any): string {
    return str.split('').reverse().reduce((prev:any, next:any, index:any) => {
      return ((index % 3) ? next : (next + ',')) + prev
    })
 }

  loadPayment() {
    this.dataService.getShop('Payment/GetAll').subscribe(
      (data: any) => {
        this.payments = data;
        this.paymentId = 1;
      },
      (err) => {
      }
    );
  }
  onChange(){

  }
}
