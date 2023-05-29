import { DataService } from './../core/services/data.service';
import { UltillityService } from '../core/services/ultillity.service';
import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { SystemConstants } from '../core/common/system.constants';
import { UrlConstants } from '../core/common/url.constants';
import { AuthenService } from '../core/services/authen.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';

class FoodNode {
  id: number;
  menuName: string;
  icon: string;
  link: string | null;
  childrens: FoodNode[] | null;
  parentId: number | null;
  role: string | null;
  constructor(id: number, menuName: string, icon: string, link: string | null, childrens: FoodNode[] | null, parentId: number | null, role: string | null) {
    this.id = id;
    this.menuName = menuName;
    this.icon = icon;
    this.link = link;
    this.childrens = childrens;
    this.parentId = parentId;
    this.role = role
  }
}

// interface ExampleFlatNode {
//   expandable: boolean;
//   name: string;
//   level: number;
//   icon?: string;
//   link?:string;
// }


const user=JSON.parse(localStorage.getItem(SystemConstants.CURRENT_USER)!) ;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, AfterViewInit {

  account : any
  userInfo: any;
  @ViewChild(MatSidenav,{static:true}) sidenav!: MatSidenav;
  treeControl = new NestedTreeControl<FoodNode>(node => node.childrens);
  dataSource = new MatTreeNestedDataSource<FoodNode>();
  menu: FoodNode[] = []


  constructor(
    public _authen : AuthenService,
    private utilityService: UltillityService,
    private elementRef: ElementRef, private observer: BreakpointObserver, private ref: ChangeDetectorRef, private dataService:DataService) {

      this.account = JSON.parse(localStorage.getItem(SystemConstants.CURRENT_USER) as string)
      let user: FoodNode = new FoodNode(11, 'Tài khoản quản trị', 'keyboard_arrow_right', '/main/app-user', null, 1,'4');
      let role: FoodNode = new FoodNode(12, 'Quyền người dùng', 'keyboard_arrow_right', '/main/app-role', null, 1,'');
      let system: FoodNode = new FoodNode(1, 'Hệ thống', 'security', null, [user, role], null,'all');
      let prCa: FoodNode = new FoodNode(21, 'Loại sản phẩm', 'keyboard_arrow_right', '/main/category', null, 2,'');
      let pr: FoodNode = new FoodNode(22, 'Sản phẩm', 'keyboard_arrow_right', '/main/product', null, 2,'');
      let newPost: FoodNode = new FoodNode(23, 'Tin tức', 'keyboard_arrow_right', '/main/new-post', null, 2,'');
      let cus: FoodNode = new FoodNode(25, 'Khách', 'keyboard_arrow_right', '/main/customer', null, 2,'');
      let od: FoodNode = new FoodNode(26, 'Đơn hàng', 'keyboard_arrow_right', '/main/order', null, 2,'');
      let manage: FoodNode = new FoodNode(2, 'Quản lý', 'folder_open', null, [prCa,pr,cus,od,newPost], null,'');
      let odStt: FoodNode = new FoodNode(31, 'Thống kê doanh thu', 'keyboard_arrow_right', '/main/revenue-statistic', null, 3,'');
      let statistics: FoodNode = new FoodNode(3, 'Thống kê', 'stacked_line_chart', null, [odStt], null,'');
      this.menu = [system, manage,statistics];
      this.dataSource.data = this.menu;
   }

   hasChild = (_: number, node: FoodNode) => !!node.childrens && node.childrens.length > 0;

  ngOnInit(): void {
     this.getUser();
    // this.getlistUser();

  }

  logOut() {
    localStorage.removeItem(SystemConstants.CURRENT_USER);
    localStorage.removeItem(SystemConstants.CURRENT_USER_ROLE);
    // localStorage.removeItem(SystemConstants.USERS_PIPE);
   // localStorage.removeItem(SystemConstants.USER_MENUS);
    this.utilityService.navigate(UrlConstants.LOGIN);
  }

  getUser(){
    let current= localStorage.getItem(SystemConstants.CURRENT_USER);
    this.userInfo=JSON.parse(current!) ;
    console.log(this.userInfo);
  }

  ngAfterViewInit() {
     this.observer.observe(['(max-width:800px)']).subscribe((res)=>{
      if(res.matches){
        this.sidenav.mode='over';
        this.sidenav.close();
      }
      else{
        this.sidenav.mode='side';
        this.sidenav.open();
      }
    });
    this.ref.detectChanges();

  }
}
