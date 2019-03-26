import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
    user: any;

    username: string;

    branchCode: string;

    groupCode: string;

    deptCode: string;

    loginUser: string;

    lastLogin: string;

    lastLoginFail: string;

    expire: string;

    constructor() { }

    ngOnInit() {
        this.username = window.sessionStorage.getItem('username');
        this.deptCode = window.sessionStorage.getItem('deptCode');
        this.groupCode = window.sessionStorage.getItem('groupCode');
        this.branchCode = window.sessionStorage.getItem('branchCode');
        this.lastLogin = window.sessionStorage.getItem('lastLogin');
        this.lastLoginFail = window.sessionStorage.getItem('lastLoginFail');
        this.expire = window.sessionStorage.getItem('expire');
    }

}
