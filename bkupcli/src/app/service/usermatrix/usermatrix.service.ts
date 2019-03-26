import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { UserMatrix } from '../../model/usermatrix.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBarComponent } from '../../component/mat-snack-bar/mat-snack-bar.component';
import { environment } from '../../../environments/environment';
import { ApiError } from '../../model/apierror.model';
import { UsermatrixDialogComponent } from '../../component/user-matrix/usermatrix-dialog/usermatrix-dialog.component';
import { MatDialogRef } from '@angular/material';
import { CodeValue } from '../../model/codevalue.model';
import { ApiService } from '../../core/api.service';
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
export class UsermatrixService {

  dataChange: BehaviorSubject<UserMatrix[]> = new BehaviorSubject<UserMatrix[]>([]);

    // Temporarily stores data from dialogs
    dialogData: any;

    accessToken: string;


    constructor(private api: ApiService, private httpClient: HttpClient, private snackBar: MatSnackBarComponent,
        public messageService: MessageService) { }


    get data(): UserMatrix[] {
        return this.dataChange.value;
    }

    getDialogData() {
        return this.dialogData;
    }

    getAllUserMatrixMaster(): void {
        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
        this.httpClient.get<UserMatrix[]>(`${BASE_URL}/userMatrixTxn-matrix-txn/userMatrixMaster?access_token=${this.accessToken}`)
        .subscribe(data => {
            this.dataChange.next(data);
        },
            (error: ApiError) => {
                this.snackBar.openSnackBar(error.error.message, 'close', 'red-snackbar');
            });

    }

    addUserMatrix(userMatrixTxn: UserMatrix, dialogRef: MatDialogRef<UsermatrixDialogComponent>): void {
        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
        this.httpClient.post<UserMatrix>(`${BASE_URL}/userMatrixTxn-matrix-txn/userMatrixTxn?access_token=${this.accessToken}`
        , userMatrixTxn)
        .subscribe(data => {
            this.dialogData = userMatrixTxn;
            this.snackBar.openSnackBar(USER_REQUSTED, 'Close', 'green-snackbar');
            dialogRef.close();
        },
            (err: ApiError) => {
                this.messageService.addErrMessage(err.error.message);
                //this.snackBar.openSnackBar(err.error.message, 'close', 'red-snackbar');
            });

    }

    getAllUserMatrixs(): void {
        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
        this.httpClient.get<UserMatrix[]>(`${BASE_URL}/userMatrixTxn-matrix-txn/get-tasks?access_token=${this.accessToken}`)
            .subscribe(data => {
                this.dataChange.next(data);
            },
                (error: ApiError) => {
                    this.snackBar.openSnackBar(error.error.message, 'close', 'red-snackbar');
                });

    }

    approve(userMatrixTxn: UserMatrix): void {
        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
        this.httpClient.post<UserMatrix>(`${BASE_URL}/userMatrixTxn-matrix-txn/approve?access_token=${this.accessToken}`, userMatrixTxn)
            .subscribe(data => {
                this.dialogData = userMatrixTxn;
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

    getAllGroupCodes(codeId: string): Observable<CodeValue[]> {
        return this.api.getCodeValuesById(codeId);
    }

    getAllBranchCodes(codeId: string): Observable<CodeValue[]> {
        return this.api.getCodeValuesById(codeId);
    }

    getAllDeptCodes(codeId: string): Observable<CodeValue[]> {
        return this.api.getCodeValuesById(codeId);
    }

    getAllRegionCodes(codeId: string): Observable<CodeValue[]> {
        return this.api.getCodeValuesById(codeId);
    }
}
