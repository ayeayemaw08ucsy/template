import { Component, OnInit } from '@angular/core';
import { LogoutService } from '../../service/logout/logout.service';
import { HttpResponse } from '@angular/common/http';
import { Http } from '@angular/http';
import { NotifierService } from 'angular-notifier';
import { WebSocketService } from '../../service/websocket/websocket.service';
import { MatSnackBarComponent } from '../../component/mat-snack-bar/mat-snack-bar.component';
import { DepreciationPolicyTnx } from 'src/app/model/depreciationpolicytnx.model';
import { Router } from '@angular/router';
import { LoginService } from '../../service/login/login.service';
import { User } from '../../model/user.model';
import { delay } from 'rxjs/operators';
import { async } from 'q';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    public notifications = 0;

    stompClient: any;

    user: User = new User();

    username: string;
    loginUser: string;

    depreciationPolicyTnx: DepreciationPolicyTnx[];

    constructor(private logOutService: LogoutService, private webSocketService: WebSocketService, private snackBar:
        MatSnackBarComponent, private router: Router, private loginService: LoginService) {
        if (JSON.parse(window.sessionStorage.getItem('token'))) {
            this.stompClient = this.webSocketService.connect();
            this.stompClient.connect({}, frame => {

                this.stompClient.subscribe('/user/queue/notification/', notifications => {

                    this.snackBar.openSnackBar(JSON.parse(notifications.body).message, 'close', 'red-snackbar');
                });
            });
        }
    }

    ngOnInit() {
        this.username = window.sessionStorage.getItem('username');
    }


    logout() {

        this.stompClient.disconnect();
        const accessToken = window.sessionStorage.getItem('token');
        this.logOutService.deleteAuthorizationToken(accessToken).subscribe((res: any) => {
            if (res.statusText === 'OK') {
                window.sessionStorage.removeItem('token');
            }
            console.log(window.sessionStorage.getItem('token'));
        });
    }

    btnClick() {
        window.sessionStorage.clear();
        this.router.navigate(['/']);
        //this.logout();
    }
}
