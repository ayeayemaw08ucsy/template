import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent} from '@angular/material';
import { Router } from '@angular/router';
import { Menu } from '../../model/menu';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
    menu: Menu;
    constructor(private router: Router) { }

    parentMessage = 0;

    navLinks = [
        // { path: '/fixed-asset', label: 'Fixed Asset', icon : 'biz_date' },
        // { path: '/batch', label: 'Batch Processing', icon : 'policy' },
        // { path: '/app-admin', label: 'Application Administration' , icon : 'code'},
        // { path: '/chart', label: 'Charts & Reports' , icon : 'vendor'},
        // { path: '/user-admin', label: 'User Administration' , icon : 'branch'},
        { path: '/fixed-asset', label: Menu.fixedAsset, icon : 'biz_date' },
        { path: '/batch', label: Menu.batchProcess, icon : 'policy' },
        { path: '/app-admin', label: Menu.applAdmin , icon : 'code'},
        { path: '/chart', label: Menu.chartRep , icon : 'vendor'},
        { path: '/user-admin', label: Menu.usrAdmin , icon : 'branch'},

    ];

    ngOnInit() {
    }


    onTabClick(event: MatTabChangeEvent) {
      this.parentMessage = event.index;

      switch(this.parentMessage) { 
        case 1: { 
            this.router.navigate(['/batch-job']);
           break; 
        } 
        case 2: {
            this.router.navigate(['/holiday']);
           break; 
        } 
        case 3: { 
           this.router.navigate(['/dashboard'])
          break; 
       } 
       case 4: { 
        this.router.navigate(['/user-list'])
       break; 
    } 
        default: { 
            this.router.navigate(['/new-register',{menuName:{name: Menu.register,subname: Menu.register}}])
           break; 
        } 
     }
    }
}

