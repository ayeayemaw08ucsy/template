import { Component, OnInit, Input } from '@angular/core';
import { Menu } from '../../../../model/menu';

@Component({
  selector: 'app-user-admin-common',
  templateUrl: './user-admin-common.component.html',
  styleUrls: ['./user-admin-common.component.css']
})
export class UserAdminCommonComponent implements OnInit {
 
  constructor() { }
  @Input() currentMenuName: string;
  ngOnInit() {
  }

  
  usrNavLinks = [
    { usrpath: '/user-list', label: Menu.existing, icon : 'existing-idl',sub : [{path: '/user-list', label: 'User Limit', icon: 'user'}] },
    { usrpath: '/add-user', label: Menu.new, icon : 'fam-edit'},
   
  ];

  usrLimitNavLinks = [
    
    { usrpath: '/limit-user', label: Menu.existing, icon : 'existing-idl'},
    { usrpath: '/approve-userlimit', label: Menu.Approval , icon : 'fam-approve'},
  ];

  usrMatrixNavLinks = [

    { matrixpath: '/user-matrix', label: Menu.existing , icon : 'existing-idl'},
    { matrixpath: '/approve-usermatrix', label: Menu.Approval, icon : 'fam-approve'},
    

  ];
  
}
