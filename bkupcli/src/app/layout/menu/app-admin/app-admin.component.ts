import { Component, OnInit , Input , Inject} from '@angular/core';
import { Menu } from 'src/app/model/menu';
import { MatTabChangeEvent} from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-admin',
  templateUrl: './app-admin.component.html',
  styleUrls: ['./app-admin.component.css']
})
export class AppAdminComponent implements OnInit {

  menu = Menu;
  secondMenu: any = 0;
  menuName: string;

  @Input() childMessage: string;
  constructor(private router: Router) {
  }

  navLinks = [
    { path: '/holiday', label: 'Business Day', icon : 'biz_date' },
    { path: '/setup-depreciationpolicy', label: 'Depreciation Policy', icon : 'policy' },
    { path: '/setup-code-value', label: 'Code' , icon : 'code'},
    { path: '/setup-vendor', label: 'Vendors' , icon : 'vendor'},
    { path: '/setup-branch', label: 'Branches' , icon : 'branch'}
    
  

];

  ngOnInit() {
      this.menuName = Menu.businessDate;
  }

  onTabClick(event: MatTabChangeEvent) {
    this.secondMenu = event.index;
     
    switch(this.secondMenu) { 
      case 1: { 
        this.menuName = Menu.depPolicy;
        this.router.navigate(['/setup-depreciationpolicy']);  
        break; 
      } 
      case 2: { 
         this.menuName = Menu.codes;
         this.router.navigate(['/setup-code-value']);  
         break; 
      } 
      case 3: { 
        //statements;
        this.menuName = Menu.vendors;
        this.router.navigate(['/setup-vendor']);
        break; 
     } 
     
     case 4: { 
      //statements;
      this.menuName = Menu.branches;
      this.router.navigate(['/setup-branch']);
      break; 
   } 
      default: { 
         this.menuName = Menu.businessDate;
         this.router.navigate(['/holiday']);
         break; 
      } 
   } 
   
  }  
}

