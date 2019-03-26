import { Component, OnInit } from '@angular/core';
import { Menu } from '../../../../model/menu';
@Component({
  selector: 'app-fa-new',
  templateUrl: './fa-new.component.html',
  styleUrls: ['./fa-new.component.css']
})
export class FaNewComponent implements OnInit {

  isActive : string = 'off';
  constructor() { }

  
  ngOnInit() {

    this.isActive = 'on';
    console.log(this.isActive);
  }
  
  navLinks = [
    
  {path: '/new-register', label: Menu.register, icon: 'existing-idl',iconactive: 'existing-active', menuName:{name: Menu.register,subname: Menu.register}},
  {path: '/app-fixedasset-list-screen',label: Menu.Draft, icon:'draft-idl',iconactive: 'draft-active',menuName:{name:Menu.register,subname: Menu.Draft}},
  {path: '/app-fixedasset-list-screen',label: Menu.Approval,icon: 'approve-idl',iconactive: 'approve-active',menuName:{name: Menu.register,subname: Menu.Approve}}
  ];

}
