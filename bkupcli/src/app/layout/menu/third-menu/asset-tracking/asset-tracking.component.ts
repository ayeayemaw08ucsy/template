import { Component, OnInit, Input } from '@angular/core';
import { Menu } from '../../../../model/menu';
@Component({
  selector: 'app-asset-tracking',
  templateUrl: './asset-tracking.component.html',
  styleUrls: ['./asset-tracking.component.css']
})
export class AssetTrackingComponent implements OnInit {
  
  @Input() currentMenuName: string;
  constructor() { }

  ngOnInit() {
  }

  trackNavLinks = [
    
    { path: '/select-menu', label: Menu.assetTrackingStatus, icon : 'status-idl'},
    { path: '/select-menu', label: Menu.assetTrackingExecute, icon : 'execute-idl'},
  ];

  archiveNavLinks = [
    
    { path: '/select-menu', label: Menu.assetTrackingStatus, icon : 'status-idl'},
    { path: '/select-menu', label: Menu.assetTrackingExecute, icon : 'execute-idl'},
  ];
}
