import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent} from '@angular/material';
import { Router } from '@angular/router';
import { Menu } from 'src/app/model/menu';

@Component({
  selector: 'app-chart-report',
  templateUrl: './chart-report.component.html',
  styleUrls: ['./chart-report.component.css']
})
export class ChartReportComponent implements OnInit {

  secondMenu: any = 0;
  menuName: string;

  constructor(private router: Router) { }
navLinks = [
        { path: '/dashboard', label: 'Dashboard' , icon : 'dashboard'},
        { path: '/report', label: 'Reports' , icon : 'report'},
        { path: '/select-menu', label: 'Queries' , icon : 'query'},
    ];

  ngOnInit() {
    this.secondMenu = Menu.dashboard;
    // this.router.navigate(['/dashboard']);
  }

  onTabClick(event: MatTabChangeEvent) {
    this.secondMenu = event.index;
    this.router.navigate(['select-menu'])
    switch(this.secondMenu) { 
      case 1: {
        this.router.navigate(['/report']); 
         break; 
      } 
      case 2: { 
        this.router.navigate(['/select-menu']);
         break; 
      } 
      default: { 
        this.router.navigate(['/dashboard']);
         break; 
      } 
   } 
  }
}
