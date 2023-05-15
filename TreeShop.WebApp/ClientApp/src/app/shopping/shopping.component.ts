import { Component, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.css']
})
export class ShoppingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  public onToggleSidenav = () => {
    // sidenav.toggle().emit();
  }
  public onSidenavClose = (sidenav:any) => {
     sidenav.close();
  }
}
