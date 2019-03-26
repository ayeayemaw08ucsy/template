import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { CodeValueService } from '../../service/codevalue/code-value.service';
import { Branch } from 'src/app/model/branch.model';
import { environment } from '../../../environments/environment';
import { Http, Response } from '@angular/http';
import { MessageService } from '../../service/common/message.service';
import { _MatTabHeaderMixinBase } from '@angular/material/tabs/typings/tab-header';
import { of, BehaviorSubject } from 'rxjs';
import { CodeValue } from '../../model/codevalue.model';
import { Code } from '../../model/code.model';
import { tap, catchError } from 'rxjs/operators';
import { MatSnackBarComponent } from '../../component/mat-snack-bar/mat-snack-bar.component';
import { ApiError } from '../../model/apierror.model';
import { MatDialogRef } from '@angular/material';
import { BranchAddDialogComponent } from '../../component/setup-branch/dialog/branch-add-dialog/branch-add-dialog.component';
import { BranchEditDialogComponent } from '../../component/setup-branch/dialog/branch-edit-dialog/branch-edit-dialog.component';
import { BranchDeleteDialogComponent } from '../../component/setup-branch/dialog/branch-delete-dialog/branch-delete-dialog.component';
import { errormessage } from 'src/environments/errormessage';

const BASE_URL = environment.baseUrl;
const BASIC_AUTH = environment.basicAuth;
const USER_ADDED = errormessage.added;
const USER_DELETED = errormessage.deleted;
const USER_UPDATE = errormessage.update;
const USER_REQUSTED = errormessage.userlimit;
const USER_APPROVED = errormessage.approved;
const USER_SAVED = errormessage.saved;
const USER_EDIT = errormessage.edited;

const headers = {
    'Authorization': 'Basic ' + btoa(BASIC_AUTH),
    'Content-type': 'application/x-www-form-urlencoded'
};

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
    })
};

@Injectable({
    providedIn: 'root'
})
export class BranchService {

    dataChange: BehaviorSubject<Branch[]> = new BehaviorSubject<Branch[]>([]);
    businessDataChange: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

    accessToken: string;
    dialogData: any;
    codeValObj: CodeValue;
    branchObj: Branch;

    constructor(
        private api: ApiService,
        private codeValApi: CodeValueService,
        private http: HttpClient,
        private messageService: MessageService, private snackBar: MatSnackBarComponent) {
        console.log(window.sessionStorage);
    }

    get data(): Branch[] {
        return this.dataChange.value;
    }

    get businessData(): string[] {
        return this.businessDataChange.value;
    }

    getDialogData(): any {
        return this.dialogData;
    }

    // /**
    //  * Get All Code information and bind in businessDataChange For DataTable.
    //  */
    // getAll(): void {
    //   this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
    //   this.http.get<string[]>(`${BASE_URL}/codevalue/values?access_token=${this.accessToken}`).subscribe(data => {
    //     console.log('Get All Data');
    //     console.log(data)  ;
    //     this.businessDataChange.next(data);
    //   }, (error: HttpErrorResponse) => {
    //     this.snackBar.openSnackBar(error.name , 'close', 'red-snackbar');
    //   });
    // }


    // // Two way Select Data Binding Calling API of codes information
    // getAllCodes(): Observable<Code[]> {
    //   return this.api.getAllCodes();
    // }

    // Two way Select Data Binding Calling API of codes information
    getAllBranchCodes(codeId: string): Observable<CodeValue[]> {
        return this.api.getCodeValuesById(codeId);
    }

    // Simulate GET /branch
    getAllBranch(): void {
        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
        const returnValueArray = forkJoin(
            this.http.get<CodeValue[]>(`${BASE_URL}/codevalue/values?access_token=${this.accessToken}`),
            this.http.get<Branch[]>(`${BASE_URL}/branches/branch?access_token=${this.accessToken}`)
        )
        //console.log('Get All Branches');
        //console.log(data)  ;
        // this.dataChange.next(data);
        returnValueArray.subscribe(latestValues => {
            const [codeValueDesc, dataValue] = latestValues;

            let transformData = dataValue.map((obj) => {

                let rgValue = codeValueDesc.find((ele) => {
                    //needed to add later codevalueUpdateFlag 
                    if (ele.code.id === '002' && ele.codeValue === obj.region) {
                        return true;
                    } else {
                        return false;
                    }
                }
                );
                let ctValue = codeValueDesc.find((ele) => {
                    if (ele.code.id === '301' && ele.codeValue === obj.country) {
                        return true;
                    } else {
                        return false;
                    }
                }

                );

                obj.regionDesc = rgValue.shortDesc;
                obj.countryDesc = ctValue.shortDesc;
                console.log(obj);
                return obj;
            })
            this.dataChange.next(transformData);
        },
            (error: HttpErrorResponse) => {
                this.snackBar.openSnackBar(error.name, 'close', 'red-snackbar');
            });
    }


    // Simulate GET /branch/:id
    getBranchById(branchSeqId: number): Observable<Branch> {
        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
        return this.http.get<Branch>(`${BASE_URL}/branches/branch/${branchSeqId}?access_token=${this.accessToken}`).pipe(
            tap(branch => this.log('Branch Api Service', `fetch Branch Object ${branch} By id = ${branchSeqId}`)),
            catchError(this.handleError<Branch>(`getBranch id=${branchSeqId}`))

        );
    }

    // Simulate POST /branch
    addBranch(branch: Branch, dialogRef: MatDialogRef<BranchAddDialogComponent>): void {
        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;

        // return this.http.post<Branch>(`${BASE_URL}/branches/branch?access_token=${this.accessToken}`, branch, httpOptions).pipe(
        //    tap(addBranch => this.log('Api Service', `Create Branch Object ${addBranch}`)),
        //    catchError(this.handleError<Branch>(`AddBranch`))
        // );

        this.http.post<Branch>(`${BASE_URL}/branches/branch?access_token=${this.accessToken}`, branch).subscribe(data => {
            console.log('Response Data');
            console.log(data);
            this.dialogData = data;
            console.log('DialogData');
            //console.log(this.dialogData);
            console.log(USER_ADDED);
            this.snackBar.openSnackBar(USER_ADDED, 'Close', 'green-snackbar');
            dialogRef.close();
        },
            (err: ApiError) => {
                this.snackBar.openSnackBar(err.error.message, 'close', 'red-snackbar');
            });
    }

    // Suimulate PUT /branch/:id {update transaction}
    updateBranch(branch: Branch, dialogRef: MatDialogRef<BranchEditDialogComponent>): void {
        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
        // tslint:disable-next-line:max-line-length
        //  this.http.put<Branch>(`${BASE_URL}/branches/branch/${branch.branchSeqId}?access_token=${this.accessToken}`, branch).subscribe(data => {
        //     this.dialogData = branch;
        //     this.snackBar.openSnackBar('Successfully Updated', 'Close', 'green-snackbar');
        //     dialogRef.close();
        //     },
        //     (err: ApiError) => {
        //         this.snackBar.openSnackBar(err.error.message, 'close', 'red-snackbar');
        //     });

        // tslint:disable-next-line:max-line-length
        this.http.put<Branch>(`${BASE_URL}/branches/branch/request/update/${branch.branchSeqId}?access_token=${this.accessToken}`, branch).subscribe(data => {
            this.dialogData = data;
            this.snackBar.openSnackBar(USER_EDIT, 'Close', 'green-snackbar');
            // this.addMessage('Vendor ' + data.branchCode + ' successfuly requested for update.');
            dialogRef.close();
        },
            (err: ApiError) => {
                this.snackBar.openSnackBar(err.error.message, 'close', 'red-snackbar');
                // this.addMessage(err.error.message);
            });
    }

    // Simulate DELETE /branch/:id
    removeBranch(branchSeqId: number, dialogRef: MatDialogRef<BranchDeleteDialogComponent>): void {
        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
        console.log(httpOptions);
        // return this.http.delete<any>(`${BASE_URL}/branches/branch/${branchSeqId}?access_token=${this.accessToken}`, httpOptions).pipe(
        //    tap(_ => this.log('Api Delete Branch', `deleted branch id=${branchSeqId}`)),
        //    catchError(this.handleError<Branch>('deleteBranch'))
        // );
        this.http.delete<any>(`${BASE_URL}/branches/branch/${branchSeqId}?access_token=${this.accessToken}`).subscribe(data => {
            // this.dialogData = branch;
            console.log(USER_DELETED);
            this.snackBar.openSnackBar(USER_DELETED, 'Close', 'green-snackbar');
            dialogRef.close();
        },
            (err: ApiError) => {
                this.snackBar.openSnackBar(err.name, 'close', 'red-snackbar');
            });
    }

    /**
      * Handle Http operation that failed.
      * Let the app continue.
      * @paramoperation -  name of the operation that failed
      * @paramresult - optional value to return as the observable result
      */
    private handleError<T>(operation = 'operation', result?: T) {

        return (error: any): Observable<T> => {
            console.error(error);
            this.log('servicename', `${operation} failed: ${error.message}`);

            return of(result as T);

        };

    }

    /**
     *
     * @paramservicename
     * @parammessage
     */
    private log(servicename: string, message: string) {
        this.messageService.add(`${servicename} : ${message}`);
    }
}
