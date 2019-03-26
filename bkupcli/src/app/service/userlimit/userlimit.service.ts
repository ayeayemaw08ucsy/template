import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { MatSnackBarComponent } from '../../component/mat-snack-bar/mat-snack-bar.component';
import { UserLimit } from '../../model/UserLimit.model';
import { CodeValue } from '../../model/codevalue.model';
import { ApiService } from '../../core/api.service';
import { ApiError } from '../../model/apierror.model';
import { UserlimitAddDialogComponent } from '../../component/user-limit/userlimit-add-dialog/userlimit-add-dialog.component';
import { MatDialogRef } from '@angular/material';
import { MessageService } from '../common/message.service';
import { errormessage } from 'src/environments/errormessage';
const BASE_URL = environment.baseUrl;
const USER_REQUSTED=errormessage.userlimit;
const USER_APPROVED=errormessage.approved;
const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',

    })
};

@Injectable({
    providedIn: 'root'
})
export class UserlimitService {

    dataChange: BehaviorSubject<UserLimit[]> = new BehaviorSubject<UserLimit[]>([]);

    // Temporarily stores data from dialogs
    dialogData: any;

    accessToken: string;

    constructor(private api: ApiService, private httpClient: HttpClient,
         private snackBar: MatSnackBarComponent, public messageService: MessageService) { }


    get data(): UserLimit[] {
        return this.dataChange.value;
    }

    getDialogData() {
        return this.dialogData;
    }

    /** CRUD METHODS */
    getAllUserLimits(): void {
        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
        this.httpClient.get<UserLimit[]>(`${BASE_URL}/userLimitTxn-limit-txn/get-tasks?access_token=${this.accessToken}`)
            .subscribe(data => {
                this.dataChange.next(data);
            },
                (error: ApiError) => {
                    this.snackBar.openSnackBar(error.error.message, 'close', 'red-snackbar');
                });

    }

    getAllUserLimitMaster(): void {
        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
        this.httpClient.get<UserLimit[]>(`${BASE_URL}/userLimitTxn-limit-txn/userLimitMaster?access_token=${this.accessToken}`)
            .subscribe(data => {
                this.dataChange.next(data);
            },
                (error: ApiError) => {
                    this.snackBar.openSnackBar(error.error.message, 'close', 'red-snackbar');
                });

    }

    addUserLimit(userLimitTxn: UserLimit, dialogRef: MatDialogRef<UserlimitAddDialogComponent>): void {
        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
        this.httpClient.post<UserLimit>(`${BASE_URL}/userLimitTxn-limit-txn/userLimitTxn?access_token=${this.accessToken}`, userLimitTxn)
            .subscribe(data => {
                this.dialogData = userLimitTxn;
                this.snackBar.openSnackBar(USER_REQUSTED, 'Close', 'green-snackbar');
                dialogRef.close();
            },
                (err: ApiError) => {
                    this.messageService.addErrMessage(err.error.message);
                });

    }

    approve(userLimitTxn: UserLimit): void {
        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
        this.httpClient.post<UserLimit>(`${BASE_URL}/userLimitTxn-limit-txn/approve?access_token=${this.accessToken}`, userLimitTxn)
            .subscribe(data => {
                this.dialogData = userLimitTxn;
                this.snackBar.openSnackBar(USER_APPROVED, 'Close', 'green-snackbar');
            },
                (err: ApiError) => {
                    this.snackBar.openSnackBar(err.error.message, 'close', 'red-snackbar');
                });
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(error);
            return of(result as T);
        };
    }

    getAllLimitCodes(codeId: string): Observable<CodeValue[]> {
        return this.api.getCodeValuesById(codeId);
    }

}
