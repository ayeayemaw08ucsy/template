import { Injectable } from '@angular/core';
import { User } from 'src/app/model/user.model';
import { ApiError } from '../../model/apierror.model';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { MatSnackBarComponent } from '../../component/mat-snack-bar/mat-snack-bar.component';
import { MessageService } from '../common/message.service';
import { CodeValue } from '../../model/codevalue.model';
import { ApiService } from '../../core/api.service';
import { Router } from '@angular/router';
import { UserLimit } from '../../model/UserLimit.model';
import { UserMatrix } from '../../model/usermatrix.model';
import { ResetPassword } from '../../model/resetpassword.model';
import { MatDialogRef } from '@angular/material';
import { ResetPasswordComponent } from '../../component/login/reset-password/reset-password.component';
import { ResetDialogComponent } from '../../component/user/notifications/reset-dialog/reset-dialog.component';
import { UserActivity } from '../../model/useractivity.model';
import { errormessage } from 'src/environments/errormessage';
const BASE_URL = environment.baseUrl;
const USER_ADDED=errormessage.added;
const USER_EDITED=errormessage.edited;
const USER_DEACTIVATE=errormessage.deactivated;
const httpOptions = {
    headers: new HttpHeaders({
        'content-type': 'application/json',

    })
};

@Injectable({
    providedIn: 'root'
})
export class UserService {
    dataChange: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);

    resetDataChange: BehaviorSubject<ResetPassword[]> = new BehaviorSubject<ResetPassword[]>([]);

    activityDataChange: BehaviorSubject<UserActivity[]> = new BehaviorSubject<UserActivity[]>([]);

    accessToken: string;

    user: User = new User();


    constructor(private api: ApiService, private httpClient: HttpClient,
        private snackBar: MatSnackBarComponent, public messageService: MessageService, private router: Router) { }


    get data(): User[] {
        return this.dataChange.value;
    }

    get resetData(): ResetPassword[] {
        return this.resetDataChange.value;
    }

    get activityData(): UserActivity[] {
        return this.activityDataChange.value;
    }

    /** CRUD METHODS */
    getAllUsers(): void {
        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
        this.httpClient.get<User[]>(`${BASE_URL}/users/user?access_token=${this.accessToken}`).subscribe(data => {
            this.dataChange.next(data);
        },
            (err: ApiError) => {
                this.snackBar.openSnackBar(err.error.message, 'close', 'red-snackbar');
            });

    }

    getOneUser(id: string): User {
        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
        this.httpClient.get<User>(`${BASE_URL}/users/user/${id}?access_token=${this.accessToken}`).subscribe(data => {
            this.user = data;
        },
            (err: ApiError) => {
                this.snackBar.openSnackBar(err.error.message, 'close', 'red-snackbar');
            });
        return this.user;
    }


    addUser(user: User): void {
        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
        this.httpClient.post<User>(`${BASE_URL}/users/user?access_token=${this.accessToken}`, user).subscribe(data => {
            if (user.id != null) {
                if (user.enabled === false) {
                    this.snackBar.openSnackBar(USER_DEACTIVATE, 'Close', 'green-snackbar');
                } else {
                    this.snackBar.openSnackBar(USER_EDITED, 'Close', 'green-snackbar');
                }
            } else {
                this.snackBar.openSnackBar(USER_ADDED, 'Close', 'green-snackbar');
            }
            this.router.navigate(['user-list']);
        },
            (err: ApiError) => {
                this.messageService.addErrMessage(err.error.message);
            });

    }

    updateUser(user: User): void {
        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
        this.httpClient.put(`${BASE_URL}/users/user?access_token=${this.accessToken}`, user).subscribe(data => {
            console.log(USER_EDITED);
            this.snackBar.openSnackBar(USER_EDITED, 'Close', 'green-snackbar');
        },
            (err: ApiError) => {
                this.messageService.addErrMessage(err.error.message);
            });
    }


    deleteUser(id: number): void {
        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
        this.httpClient.delete(`${BASE_URL}/users/user/${id}?access_token=${this.accessToken}`).subscribe(data => {
            this.snackBar.openSnackBar('Successfully deleted', 'close', 'green-snackbar');
        },
            (err: ApiError) => {
                this.snackBar.openSnackBar(err.message, 'close', 'red-snackbar');
            }
        );
    }

    getAllLimitCodes(): Observable<UserLimit[]> {
        return this.api.getLimitCodes();
    }

    getAllRoleCodes(codeId: string): Observable<CodeValue[]> {
        return this.api.getCodeValuesById(codeId);
    }

    getAllGroupCodes(): Observable<UserMatrix[]> {
        return this.api.getGroupCodes();
    }

    getAllBranchCodes(codeId: string): Observable<CodeValue[]> {
        return this.api.getCodeValuesById(codeId);
    }

    getAllGenderCodes(codeId: string): Observable<CodeValue[]> {
        return this.api.getCodeValuesById(codeId);
    }

    getAllFunctionCodes(codeId: string): Observable<CodeValue[]> {
        return this.api.getCodeValuesById(codeId);
    }

    getAllFunctions(codeId: string, username: string): Observable<CodeValue[]> {
        return this.api.getFunctions(codeId, username);
    }

    getAllScreenCodes(codeId: string): Observable<CodeValue[]> {
        return this.api.getCodeValuesById(codeId);
    }

    addResetPassword(reset: ResetPassword, dialogRef: MatDialogRef<ResetPasswordComponent>): void {
        this.httpClient.post<ResetPassword>(`${BASE_URL}/oauth/resetPassword`, reset).subscribe(data => {
            this.snackBar.openLoginSnackBar('Successfully Request', 'Close', 'green-snackbar');
            dialogRef.close();
        },
            (err: ApiError) => {
                this.messageService.addErrMessage(err.error.message);
            });

    }

    getAllResetPasswords(): void {
        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
        this.httpClient.get<ResetPassword[]>(`${BASE_URL}/oauth/resetPassword?access_token=${this.accessToken}`).subscribe(data => {
            this.resetDataChange.next(data);
        },
            (err: ApiError) => {
                this.snackBar.openSnackBar(err.error.message, 'close', 'red-snackbar');
            });

    }

    getAllUserActivitys(): void {
        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
        this.httpClient.get<UserActivity[]>(`${BASE_URL}/user-activity/userActivity?access_token=${this.accessToken}`).subscribe(data => {
            this.activityDataChange.next(data);
        },
            (err: ApiError) => {
                this.snackBar.openSnackBar(err.error.message, 'close', 'red-snackbar');
            });

    }

     updatePassword(password: any, dialogRef: MatDialogRef<ResetDialogComponent>): void {
        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
        this.httpClient.put(`${BASE_URL}/oauth/password/${password.username}/${password.password}
        ?access_token=${this.accessToken}`, null).subscribe(data => {
            this.snackBar.openSnackBar('Successfully reset password', 'Close', 'green-snackbar');
            dialogRef.close();
        },
            (err: ApiError) => {
                this.messageService.addErrMessage(err.error.message);
            });
    }


}
