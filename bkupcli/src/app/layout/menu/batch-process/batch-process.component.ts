import { Component, OnInit, Input } from '@angular/core';
import { Menu } from 'src/app/model/menu';
import { MatTabChangeEvent} from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-batch-process',
  templateUrl: './batch-process.component.html',
  styleUrls: ['./batch-process.component.css']
})
export class BatchProcessComponent implements OnInit {
   
  menu = Menu;
  secondMenu: any = 1;
  menuName: string;

  @Input() childMessage: string;
  constructor(private router: Router) { }

  ngOnInit() {
  }
     navLinks = [
        { path: '/batch-job', label: 'Batch' , icon : 'batch'},
        { path: '/select-menu', label: 'Asset Tracking', icon : 'track' },
        { path: '/bulk-upload', label: 'Bulk Upload', icon : 'upload' },
    ];

    onTabClick(event: MatTabChangeEvent) {
      this.secondMenu = event.index;
      this.router.navigate(['select-menu'])
      switch(this.secondMenu) { 
        case 1: { 
          this.menuName = Menu.assetTrack;
           break; 
        } 
        case 2: { 
           this.menuName = Menu.archive;
           break; 
        } 
        case 3: { 
          this.menuName = Menu.bulkUpload;
           this.router.navigate(['/bulk-upload'])
          break; 
       } 
       
        default: { 
       //    this.menuName = Menu.businessDate;
             this.router.navigate(['/batch-job'])
           
           break; 
        } 
     } 
     
    }  
}
