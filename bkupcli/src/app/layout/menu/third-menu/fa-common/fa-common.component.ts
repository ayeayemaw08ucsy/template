import { Component, OnInit,Input } from '@angular/core';
import { Menu } from '../../../../model/menu';

@Component({
  selector: 'app-fa-common',
  templateUrl: './fa-common.component.html',
  styleUrls: ['./fa-common.component.css']
})
export class FaCommonComponent implements OnInit {

  @Input() currentMenuName: string;
  data: Menu;

  constructor() { }

  ngOnInit() {
    console.log(this.currentMenuName);
  
  }
  navLinks = [
    { path: '/app-fixedasset-list-screen', label: Menu.existing, icon : 'existing-idl',
          amendMenuName:{name:Menu.amend,subname : Menu.existing},
          updateMenuName:{name:Menu.update,subname: Menu.existing},
          disposeMenuName:{name:Menu.dispose,subname:Menu.existing}},
    { path: '/app-fixedasset-list-screen', label: Menu.Draft , icon : 'draft-idl',
          amendMenuName:{name:Menu.amend,subname: Menu.Draft},
          updateMenuName: {name:Menu.update,subname: Menu.Draft},
          disposeMenuName:{name:Menu.dispose,subname:Menu.Draft}},
    { path: '/app-fixedasset-list-screen', label: Menu.Approval , icon : 'fam-approve',
          amendMenuName:{name:Menu.amend,subname: Menu.Approve},
          updateMenuName:{name:Menu.update,subname: Menu.Approve},
          disposeMenuName:{name:Menu.dispose,subname:Menu.Approve}}
  ];

}
