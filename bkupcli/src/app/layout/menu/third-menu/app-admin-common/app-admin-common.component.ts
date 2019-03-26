import { Component, OnInit , Input} from '@angular/core';
import { Menu } from '../../../../model/menu';

@Component({
  selector: 'app-app-admin-common',
  templateUrl: './app-admin-common.component.html',
  styleUrls: ['./app-admin-common.component.css']
})
export class AppAdminCommonComponent implements OnInit {

  constructor() { }
  @Input() currentMenuName: string;
  ngOnInit() {
  }

  holidayNavLinks = [
    { holidaypath: '/holiday', label: Menu.existing, icon : 'existing-idl'},
    { holidaypath: '/select-menu', label: Menu.Approval , icon : 'fam-approve'},
   
  ];

  dpNavLinks = [
    
    { dppath: '/setup-depreciationpolicy', label: Menu.existing, icon : 'existing-idl'},
    { dppath: '/approve-depreciationpolicy', label: Menu.Approval, icon : 'fam-approve'},
    
  ];

  codeNavLinks = [

    { codepath: '/setup-code-value', label: Menu.existing , icon : 'existing-idl'},
    { codepath: '/approve-code', label: Menu.Approval, icon : 'fam-approve'},
    

  ];
  vendorNavLinks = [
    { vendorpath: '/setup-vendor', label: Menu.existing , icon : 'existing-idl'},
    { vendorpath: '/approve-vendor', label: Menu.Approval, icon : 'fam-approve'},

  ];
  branchNavLinks = [
    { branchpath: '/setup-branch', label: Menu.existing , icon : 'existing-idl'},
    { branchpath: '/approve-branch', label: Menu.Approval , icon : 'fam-approve'}

  ]
}
