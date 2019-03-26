import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTabChangeEvent} from '@angular/material';
import { Router } from '@angular/router';
import { Menu } from 'src/app/model/menu';


@Component({
  selector: 'app-fixed-asset',
  templateUrl: './fixed-asset.component.html',
  styleUrls: ['./fixed-asset.component.css']
})
export class FixedAssetComponent implements OnInit {
  secondMenu: any = 0;
  menuName: string;
  constructor(private router: Router) { }
  // navLinks = [
  //     { path: '/new-register', label: 'New', icon : 'new' , menuName:{name:'Register'}},
  //      { path: '/app-fixedasset-list-screen', label: 'Amend', icon : 'amend' , menuName:{name:'Amend'} },
     
  //      { path: '/app-fixedasset-list-screen', label: 'Draft', icon : 'draft' ,menuName:{name:'Draft'}},
  //      { path: '/app-fixedasset-list-screen', label: 'Approve', icon : 'approve' ,menuName:{name:'Approve'}},
  //      { path: '/app-fixedasset-list-screen', label: 'Amend Approve', icon : 'approve' ,menuName:{name:'AmendApprove'}},
       
  //      { path: '/app-fixedasset-list-screen', label: 'Updated', icon : 'update',menuName:{name:'Updated'}},
  //      { path: '/app-fixedasset-list-screen', label: 'Updated Pending', icon : 'update',menuName:{name:'pending'}},
  //      { path: '/app-fixedasset-list-screen', label: 'Updated Approval', icon : 'update',menuName:{name:'UpdateApprove'}},
  //      { path: '/app-fixedasset-list-screen', label: 'Dispose', icon : 'dispose',menuName:{name:'Dispose'} },
  //      { path: '/app-fixedasset-list-screen', label: 'Dispose Pending', icon : 'approve' ,menuName:{name:'DisposePending'}},
  //      { path: '/app-fixedasset-list-screen', label: 'Dispose Approval', icon : 'approve' ,menuName:{name:'DisposeApprove'}}
  //   ];

  ngOnInit() {
  }

  onTabClick(event: MatTabChangeEvent) {
    this.secondMenu = event.index;
    this.router.navigate(['select-menu'])
    switch(this.secondMenu) { 
      case 1: { 
        this.menuName = Menu.amend;
        this.router.navigate(['/app-fixedasset-list-screen',{name:Menu.amend,subname : Menu.existing}])
        break; 
      } 
      case 2: { 
         //statements;
         this.menuName = Menu.update;
        this.router.navigate(['/app-fixedasset-list-screen',{name:Menu.update,subname: Menu.existing}])

         break; 
      } 
      case 3: { 
        //statements;
        this.menuName = Menu.dispose;
        this.router.navigate(['/app-fixedasset-list-screen',{name:Menu.dispose,subname:Menu.existing}])
        
        break; 
     } 
      default: { 
         this.menuName = Menu.new;
         this.router.navigate(['/new-register'])
         break; 
      } 
   } 
   
  
  }
}
