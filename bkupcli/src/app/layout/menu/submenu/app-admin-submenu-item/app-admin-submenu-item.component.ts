import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-app-admin-submenu-item',
  templateUrl: './app-admin-submenu-item.component.html',
  styleUrls: ['./app-admin-submenu-item.component.css']
})
export class AppAdminSubmenuItemComponent implements OnInit {

  constructor() { }
  navLinks = [
          { path: '/setup-depreciationpolicy',label : 'Current', icon: 'fam-current'}
       ];
 
   ngOnInit() {
   }

}
