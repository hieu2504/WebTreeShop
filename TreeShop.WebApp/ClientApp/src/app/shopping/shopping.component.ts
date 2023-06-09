import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { SystemConstants } from '../core/common/system.constants';
import { UltillityService } from '../core/services/ultillity.service';
import { UrlConstants } from '../core/common/url.constants';
import { CommonService } from '../core/services/common.service';

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.css']
})
export class ShoppingComponent implements OnInit {
  countItem: any;
  userInfo:any;
  data:any;
  lstShopCart:any;
  constructor(private utilityService: UltillityService,private service: CommonService) {

    this.service.data$.subscribe(res => this.data = res)
   }


  ngOnInit(): void {
    // let shopCart = localStorage.getItem(SystemConstants.SHOP_CART);
    // console.log(shopCart);
    this.getUser();
    this.scrollToTop();
    let shopCart = localStorage.getItem(SystemConstants.SHOP_CART);
    this.lstShopCart = [];
    if(shopCart!=null){
      this.lstShopCart = JSON.parse(shopCart);
      let totalQuantity = 0;
      for(var i = 0; i < this.lstShopCart.length; i++) {
          totalQuantity += this.lstShopCart[i].OrderQuantity;
      }
      this.service.changeData(totalQuantity+'');
    }else{
      this.service.changeData('0');
    }
  }
  public onToggleSidenav = () => {
    // sidenav.toggle().emit();
  }
  public onSidenavClose = (sidenav:any) => {
     sidenav.close();
  }
  getUser(){
    let current= localStorage.getItem(SystemConstants.CURRENT_USER_SHOP);
    this.userInfo=JSON.parse(current!) ;
    console.log(this.userInfo);
  }

  logOut(){
    localStorage.removeItem(SystemConstants.CURRENT_USER_SHOP);
    // localStorage.removeItem(SystemConstants.USERS_PIPE);
   // localStorage.removeItem(SystemConstants.USER_MENUS);
    this.utilityService.navigate(UrlConstants.LOGIN);
  }
  logIn(){
    this.utilityService.navigate(UrlConstants.LOGIN);
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
