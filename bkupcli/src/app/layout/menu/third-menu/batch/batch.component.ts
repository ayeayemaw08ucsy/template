import { Component, OnInit } from '@angular/core';
import { Menu } from '../../../../model/menu';
@Component({
  selector: 'app-batch',
  templateUrl: './batch.component.html',
  styleUrls: ['./batch.component.css']
})
export class BatchComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  navLinks = [
    // { path: '/batch-job', label: 'Batch' , icon : 'batch'},
    // { path: '/select-menu', label: 'Asset Tracking', icon : 'track' },
    // { path: '/bulk-upload', label: 'Bulk Upload', icon : 'upload' },
    //
    { path: '/batch-job', label: Menu.batchMaster, icon : 'batch-master-idl'},
    { path: '/batch-job-history', label: Menu.batchHistory , icon : 'batch-history-idl'},
  ];
}
