import { Component, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { SystemConstants } from '../core/common/system.constants';

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.css']
})
export class ShoppingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // let shopCart = localStorage.getItem(SystemConstants.SHOP_CART);
    // console.log(shopCart);
  }
  public onToggleSidenav = () => {
    // sidenav.toggle().emit();
  }
  public onSidenavClose = (sidenav:any) => {
     sidenav.close();
  }
}
