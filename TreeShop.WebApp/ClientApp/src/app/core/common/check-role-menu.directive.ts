import { Directive, ElementRef, HostBinding, HostListener, Input } from '@angular/core';
import { SystemConstants } from './system.constants';

@Directive({
  selector: '[appCheckRoleMenu]'
})
export class CheckRoleMenuDirective  {

  constructor(private el: ElementRef) { }

  @Input() roleName = '';
  @Input() users = [];
  @HostBinding('class') elementClass = '';

  public checkRole(role: any, users:any){
    if(users != null){
      // if(this.roleName == 'all'){
      //   this.elementClass = 'role-access';
      //   return
      // }
      if(users.find((x: any)=>x===role)){
        this.elementClass = 'role-access';
      }else{
        this.elementClass = 'un-role-access';
      }
    }
  }

  ngOnInit():void{
    this.checkRole(this.roleName,this.users);
  }

}
