import { Directive, ElementRef, HostBinding, HostListener, Input } from '@angular/core';
import { SystemConstants } from './system.constants';
const users = JSON.parse(localStorage.getItem(SystemConstants.CURRENT_USER_ROLE)!);
@Directive({
  selector: '[appCheckRoleMenu]'
})
export class CheckRoleMenuDirective  {

  constructor(private el: ElementRef) { }

  @Input() roleName = '';
  @HostBinding('class') elementClass = '';

  public checkRole(role: any){
    if(users != null){
      if(this.roleName == 'all'){
        this.elementClass = 'role-access';
        return
      }
      if(users.find((x: any)=>x===role)){
        this.elementClass = 'role-access';
      }else{
        this.elementClass = 'un-role-access';
      }
    }
  }

  ngOnInit():void{
    this.checkRole(this.roleName);
  }

}
