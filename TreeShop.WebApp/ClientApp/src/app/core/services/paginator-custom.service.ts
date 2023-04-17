import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class PaginatorCustomService {


  setLable!:string;
  firstButton!:string;
  nextButton!:string;
  lastButton!:string;
  preButton!:string;

  constructor() {

    this.setTitle();

   }

   private setTitle(){


    this.setLable= "Số bản ghi trên 1 trang";
    this.firstButton= "Trang đầu";
    this.nextButton= "Trang tiếp";
    this.lastButton= "Trang cuối";
    this.preButton= "Trang trước";
   }

}
