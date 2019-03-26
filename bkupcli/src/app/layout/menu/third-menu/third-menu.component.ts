import { Component, OnInit } from '@angular/core';
import { Menu } from '../../../model/menu';
@Component({
  selector: 'app-third-menu',
  templateUrl: './third-menu.component.html',
  styleUrls: ['./third-menu.component.css']
})
export class ThirdMenuComponent implements OnInit {

  constructor() { }

  navLinks = [

    // { path: '/new-register', label: 'New', icon : 'new' , menuName:{name:'Register'}},
    // { path: '/app-fixedasset-list-screen', label: 'Amend', icon : 'amend' , menuName:{name:'Amend'} },
  
    // { path: '/app-fixedasset-list-screen', label: 'Draft', icon : 'draft' ,menuName:{name:'Draft'}},
    // { path: '/app-fixedasset-list-screen', label: 'Approve', icon : 'approve' ,menuName:{name:'Approve'}},
    // { path: '/app-fixedasset-list-screen', label: 'Amend Approve', icon : 'approve' ,menuName:{name:'AmendApprove'}},
    
    // { path: '/app-fixedasset-list-screen', label: 'Updated', icon : 'update',menuName:{name:'Updated'}},
    // { path: '/app-fixedasset-list-screen', label: 'Updated Pending', icon : 'update',menuName:{name:'pending'}},
    // { path: '/app-fixedasset-list-screen', label: 'Updated Approval', icon : 'update',menuName:{name:'UpdateApprove'}},
    // { path: '/app-fixedasset-list-screen', label: 'Dispose', icon : 'dispose',menuName:{name:'Dispose'} },
    // { path: '/app-fixedasset-list-screen', label: 'Dispose Pending', icon : 'approve' ,menuName:{name:'DisposePending'}},
    // { path: '/app-fixedasset-list-screen', label: 'Dispose Approval', icon : 'approve' ,menuName:{name:'DisposeApprove'}}

     /**Fixed Asset */
     //{ path: '/new-register', label: 'New', icon : 'new' , menuName:{name:'Register'}},
    //  { path: '/app-fixedasset-list-screen', label: Menu.existing , icon : 'new' , menuName:{name:Menu.new},subMenu:{subname:Menu.existing}},
    //  { path: '/app-fixedasset-list-screen', label: Menu.Draft , icon : 'new' , menuName:{name:Menu.new},subMenu:{subname:Menu.Draft}},
    //  { path: '/app-fixedasset-list-screen', label: Menu.Approval , icon : 'approve' , menuName:{name:'Register'},subMenu:{subname:Menu.Approval}},
     
    //  /** Batch Processing*/
    //  { path: '/batch-job', label: 'Batch' , icon : 'batch'},
    //  { path: '/select-menu', label: 'Asset Tracking', icon : 'track' },
    //  { path: '/bulk-upload', label: 'Bulk Upload', icon : 'upload' },
    
    // /**Applicatin Admin */
    // { path: '/holiday', label: 'Business Day', icon : 'biz_date' },
    // { path: '/setup-depreciationpolicy', label: 'Depreciation Policy', icon : 'policy' },
    // { path: '/setup-code-value', label: 'Code' , icon : 'code'},
    // { path: '/setup-vendor', label: 'Vendors' , icon : 'vendor'},
    // { path: '/setup-branch', label: 'Branches' , icon : 'branch'},

    /**Charts & Reports */
  // { path: '/dashboard', label: 'Dashboard' , icon : 'dashboard'},
  // { path: '/report', label: 'Reports' , icon : 'report'},
  // { path: '/select-menu', label: 'Queries' , icon : 'query'}

  // /**User Administration. */
  // { path: '/user-list', label: 'Users', icon: 'user', sub : [{path: '/user-list', label: 'User Limit', icon: 'user'}] },
  // { path: '/limit-user', label: 'User Limit', icon: 'userLimit' },
  // { path: '/user-matrix', label: 'User Matrix', icon: 'user_function' },

  {path: '/new-register', label: Menu.existing, icon: 'existing-idl'},
  {path: '/app-fixedasset-list-screen',label: Menu.Draft, icon:'draft-idl'},
  {path: '/app-fixedasset-list-screen',label: Menu.Approval,icon: 'fam-approve'}

  ];

  ngOnInit() {
  }

}
