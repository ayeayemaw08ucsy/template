import { Component, OnInit } from '@angular/core';
import { Menu } from 'src/app/model/menu';
import { MatTabChangeEvent} from '@angular/material';
import { Router } from '@angular/router';

@Component({
    selector: 'app-user-admin',
    templateUrl: './user-admin.component.html',
    styleUrls: ['./user-admin.component.css']
})
export class UserAdminComponent implements OnInit {
    secondMenu: any = 0;
    menuName: string;
    constructor(private router: Router) { }

    ngOnInit() {
        this.menuName = Menu.users;
    }
    // tslint:disable-next-line:member-ordering
    navLinks = [
        { path: '/user-list', label: 'Users', icon: 'user', sub : [{path: '/user-list', label: 'User Limit', icon: 'user'}] },
        { path: '/limit-user', label: 'User Limit', icon: 'userLimit' },
        { path: '/user-matrix', label: 'User Matrix', icon: 'user_function' },
    ];

    onTabClick(event: MatTabChangeEvent) {
        this.secondMenu = event.index;
        this.router.navigate(['select-menu'])
        switch(this.secondMenu) { 
          case 1: { 
            this.menuName = Menu.usrLimit;
            this.router.navigate(['/limit-user']);
          break; 
          } 
          case 2: { 
             //statements;
             this.menuName = Menu.usrMatrix;
             this.router.navigate(['/user-matrix']);
             break; 
          } 
          default: { 
             this.menuName = Menu.users;
             console.log(this.menuName);
             this.router.navigate(['/user-list'])
             break; 
          } 
       } 
       
      
      }  
}
