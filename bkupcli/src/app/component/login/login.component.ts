import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
//import { ApiService } from "../core/api.service";
import { LoginService } from "../../service/login/login.service";
import { HttpParams } from "@angular/common/http";
import { from, Observable } from 'rxjs';
import { User } from '../../model/user.model';
import { MessageService } from '../../service/common/message.service';
import { MatDialog } from '@angular/material';
import { ResetPasswordComponent } from './reset-password/reset-password.component';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup;
    invalidLogin = false;
    user: User;
    constructor(private formBuilder: FormBuilder, private router: Router, private loginService: LoginService,
         private messageService: MessageService, public dialog: MatDialog) { }

    onSubmit() {
        if (this.loginForm.invalid) {
            return;
        }
        const body = new HttpParams()
            .set('username', this.loginForm.controls.username.value + ',,,' + this.loginForm.controls.entity.value)
            .set('password', this.loginForm.controls.password.value)
            .set('grant_type', 'password');
        this.loginService.authenticate(body.toString()).subscribe(data => {
            window.sessionStorage.setItem('token', JSON.stringify(data));
            window.sessionStorage.setItem('loginUser',
                this.loginForm.controls.username.value + ',,,' + this.loginForm.controls.entity.value);
            if (data) {
                this.loginService.findByUsername();
            }
        }, error => {
            alert(error.error.error_description);
        });
    }

    ngOnInit() {
        window.sessionStorage.removeItem('token');
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.compose([Validators.required])],
            entity: ['', Validators.compose([Validators.required])],
            password: ['', Validators.required]
        });
    }

    request() {
        this.messageService.clearErrorMessage();
        const dialogRef = this.dialog.open(ResetPasswordComponent, {
            data: { entity: '', username: '' }
        });
    }

}
