import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shop-introduce',
  templateUrl: './shop-introduce.component.html',
  styleUrls: ['./shop-introduce.component.css']
})
export class ShopIntroduceComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.scrollToTop();
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
