import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-shop',
  templateUrl: './order-shop.component.html',
  styleUrls: ['./order-shop.component.css']
})
export class OrderShopComponent implements OnInit {
  imgId = 1
  constructor() { }

  ngOnInit(): void {
    const imgs = document.querySelectorAll('.img-select a');
    const imgBtns = Array.from(imgs);
     this.imgId = 1;

imgBtns.forEach((imgItem:any) => {
    imgItem.addEventListener('click', (event:any) => {
        event.preventDefault();

        this.imgId = imgItem.dataset.id;
        this.slideImage();
    });

});




  }
 slideImage(){

    const displayWidth = document.querySelector('.img-showcase img:first-child')?.clientWidth;
    const img = document.querySelector('.img-showcase') as HTMLImageElement;

    img.style.transform = `translateX(${- (this.imgId - 1) * displayWidth!}px)`;
}

}
