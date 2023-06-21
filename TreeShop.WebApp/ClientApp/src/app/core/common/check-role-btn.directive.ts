import { Directive, ElementRef, HostBinding, HostListener, Input } from '@angular/core';
import { SystemConstants } from './system.constants';
// const users = JSON.parse(localStorage.getItem(SystemConstants.CURRENT_USER_ROLE)!);
@Directive({
  selector: '[appCheckRoleBtn]'
})
export class CheckRoleBtnDirective  {

  constructor(private el: ElementRef) { }

  @Input() roleNameBtn = '';
  @Input() users = [];
  @HostBinding('class') elementClass = '';

  public checkRole(role: any, users: any){
    debugger
    if(users != null){
      if(users.find((x: any)=>x===role)){
        this.elementClass = 'role-btn-access';
      }else{
        this.elementClass = 'un-role-btn-access';
      }
    }
  }

  ngOnInit():void{
    this.checkRole(this.roleNameBtn,this.users);
  }

}
