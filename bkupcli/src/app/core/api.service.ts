import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { User } from "../model/user.model";
import { Login } from "../model/login.model";
import { Holiday } from "../model/holiday.model";
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Http, Response } from '@angular/http';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from '../service/common/message.service';
import { _MatTabHeaderMixinBase } from '@angular/material/tabs/typings/tab-header';
import { Code } from '../model/code.model';
import { MatSnackBarComponent } from '../component/mat-snack-bar/mat-snack-bar.component';
import { CodeValue } from '../model/codevalue.model';
import { ApiError } from '../model/apierror.model';
import { UserLimit } from '../model/UserLimit.model';
import { UserMatrix } from '../model/usermatrix.model';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

//baseUrl: string = 'http://localhost:8080/users/';
const BASE_URL = environment.baseUrl;
const BASIC_AUTH = environment.basicAuth;

// const authenticateHttpOptions = {
//   headers: new HttpHeaders({
//     Authorization: 'Basic' + btoa(BASIC_AUTH),
//     Content_Type: 'application/x-www-form-urlencoded' 
//   })
// };

const headers = {
    'Authorization': 'Basic ' + btoa(BASIC_AUTH),
    'Content-type': 'application/x-www-form-urlencoded'
}


const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',

    })
};

@Injectable()
export class ApiService {
    // baseUrl: string = `${BASE_URL}+"/users/"`;
    accessToken: string;
    loginUser: string;
    // headers: any;
    constructor(
        private http: HttpClient,
        private messageService: MessageService, private snackBar: MatSnackBarComponent, private router: Router) {
        console.log(window.sessionStorage);
        // accessToken: JSON.parse(window.sessionStorage.getItem('token')).access_token;
    }


    /**
     * 
     * @param loginPayload : (need to determine the loginPayload)
     */
    login(loginPayload: string): Observable<Login> {
        // this.headers = new Headers();
        // this.createAuthenticationHeader(this.headers);
        // console.log(this.headers.get('Authorization'));
        return this.http.post<Login>(`${BASE_URL}/oauth/token`, loginPayload, { headers }).pipe(
            map(this.extractData),
            tap((response: Response) => {
                this.log('Api Service', 'Authentication ');
                return new Login(response);
            }),
            catchError(this.handleError('login'))
        )
    }

    logout(token: string): Observable<any> {
        return this.http.post<any>(`${BASE_URL}/oauth/token/revoke?access_token=${this.accessToken}`, token, { headers: this.createAuthenticationHeader(this.accessToken), observe: "response" }).pipe(
            map((res: HttpResponse<any>) => { return res }),
            tap(_ => this.log('Api Service', 'Delete Token in Logout Event')),
            catchError(this.handleError('deleteToken'))
        )

    }

    getUserByUsername(): void {
        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
        this.loginUser = window.sessionStorage.getItem('loginUser');
        this.http.get<User>(`${BASE_URL}/users/user/user/${this.loginUser}?access_token=${this.accessToken}`).subscribe(data => {
            window.sessionStorage.setItem('username', data.username);
            window.sessionStorage.setItem('deptCode', data.deptCode);
            window.sessionStorage.setItem('groupCode', data.groupCode);
            window.sessionStorage.setItem('branchCode', data.branchCode);
            window.sessionStorage.setItem('expire', data.pwdExpiryDate);
            window.sessionStorage.setItem('lastLoginFail', data.lastLoginFail);
            window.sessionStorage.setItem('roles', JSON.stringify(data.authorities));
            window.sessionStorage.setItem('lastLogin', JSON.stringify(new Date().getTime()));
            this.router.navigate(['select-menu']);
        },
            (err: ApiError) => {
                this.snackBar.openSnackBar(err.error.message, 'close', 'red-snackbar');
            });
    }

    /**
     * 
     */
    getUsers(): Observable<User[]> {
        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
        return this.http.get<User[]>(`${BASE_URL}/users/user?access_token=${this.accessToken}`)
            .pipe(
                tap(_ => this.log('Api Service', 'Fetched User List')),
                catchError(this.handleError<User[]>('getUsers', []))

            );
    }

    /**
     * 
     * @param res 
     */
    private extractData(res: Response) {
        let body = res;
        console.log('In extract Data Method' + JSON.stringify(body));
        return body || {};
    }

    private createAuthenticationHeader(accessToken: string) {
        this.router.navigate(['/']);
        const headerDict = {
            'auth_token': accessToken
        }
        return new HttpHeaders(headerDict);
    }

    /**
     * 
     * @param id 
     */
    getUserById(id: number): Observable<User> {
        accessToken: JSON.parse(window.sessionStorage.getItem('token')).access_token;
        return this.http.get<User>(`${BASE_URL}/users/user/${id}?access_token=${this.accessToken}`).pipe(
            map((res: this, extractData) => new User(res)),
            tap(user => this.log('Api Service', `fetch User Object ${user} By id = ${id}`)),
            catchError(this.handleError<User>(`geUser id=${id}`))

        );
    }

    /**
     * 
     * @param user 
     */
    createUser(user: User): Observable<User> {
        accessToken: JSON.parse(window.sessionStorage.getItem('token')).access_token;

        return this.http.post<User>(`${BASE_URL}/users/user?access_token=${this.accessToken}`, user, httpOptions).pipe(
            map((res: this, extractData) => {
                return new User(res);
            }),
            tap(createUser => this.log('Api Service', `Create User Object ${createUser}`)),
            catchError(this.handleError<User>(`CreateUser`))
        );
    }

    /**
     * 
     * @param user 
     */
    updateUser(user: User): Observable<User> {
        accessToken: JSON.parse(window.sessionStorage.getItem('token')).access_token;
        return this.http.put<User>(`${BASE_URL}/users/user/${user.id}?access_token=${this.accessToken}`, user, httpOptions).pipe(
            map((res: this, extractData) => {
                return new User(res);
            }),
            tap(updatedUsr => this.log('API service', `Updated User Object ${updatedUsr}`)),
            catchError(this.handleError<User>(`Update User`))
        );
    }

    /**
     * 
     * @param id 
     */
    deleteUser(id: number): Observable<any> {
        accessToken: JSON.parse(window.sessionStorage.getItem('token')).access_token;
        console.log(httpOptions);
        return this.http.delete<any>(`${BASE_URL}/users/user/${id}?access_token=${this.accessToken}`, httpOptions).pipe(
            tap(_ => this.log('Api Delete User', `deleted user id=${id}`)),
            catchError(this.handleError<User>('deleteUser'))
        );
    }

    /**
     * Read All Code Information form REST API.
     * 
     */
    getAllCodes(): Observable<Code[]> {

        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
        return this.http.get<any>(`${BASE_URL}/codes/code?access_token=${this.accessToken}`)
            .pipe(
                tap(_ => this.log(' Api Service', 'Fetch All Code')),
                catchError(this.handleError<Code[]>('getAllCodes', []))
            )
    }

    getAllCodeValues(): Observable<CodeValue[]> {

        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
        return this.http.get<CodeValue[]>(`${BASE_URL}/codevalue/values?access_token=${this.accessToken}`).pipe(
            tap(_ => this.log(' Api Service', 'Fetch All Code Value')),
            catchError(this.handleError<CodeValue[]>('getAllCodeValues', []))
        )
    }

    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation -  name of the operation that failed 
     * @param result - optional value to return as the observable result
     */
    private handleError<T>(operation = 'operation', result?: T) {

        return (error: any): Observable<T> => {
            this.snackBar.openLoginSnackBar(error.error.error_description, 'close', 'red-snackbar');
            this.log('servicename', `${operation} failed: ${error.message}`);

            return of(result as T);

        }

    }

    /**
     * 
     * @param servicename 
     * @param message 
     */
    private log(servicename: string, message: string) {
        this.messageService.add(`${servicename} : ${message}`)
    }

    /**
     * 
     */
    getCodeValuesById(codeId: string): Observable<CodeValue[]> {
        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
        return this.http.get<any>(`${BASE_URL}/codevalue/values/${codeId}?access_token=${this.accessToken}`)
            .pipe(
                tap(_ => this.log(' Api Service', 'Fetch CodeValues By Id')),
                catchError(this.handleError<Code[]>('getAllCodes', []))
            )
    }

   /**
     * Get Data By Product Ref Id.
     */
    getFixedAssetDataForUpdate(prodRefId: string) : Observable<any> {
        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
       return this.http.get<any>(`${BASE_URL}/fixedAssets/existing/${prodRefId}?access_token=${this.accessToken}`)
        .pipe(
                tap(_ => this.log('fetched FixedAsset Data For Update',` ${prodRefId}`)),
                catchError(this.handleError<any>(`getFixedAssetDataForUpdate = ${prodRefId}`))

     );
    }
    
    /**
     * Get Tnx Data By prodRefId and fixedAssetMstSeqId.
     * @param prodRefId  :
     * @param fixedAssetMstSeqId: 
     */
    getFixedAssetTnxDataForUpdate(prodRefId: string,fixedAssetMstSeqId: string): Observable<any> {
        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
        return this.http.get<any>(`${BASE_URL}/fixedAssetTnxs/fixedAssetTnx/update/draft/${prodRefId}/${fixedAssetMstSeqId}?access_token=${this.accessToken}`)
               .pipe(
                        tap(_=>this.log('Fixed Asset Tnx Data For Update',`${prodRefId} : ${fixedAssetMstSeqId}`)),
                        catchError(this.handleError<any>(`getFixedAssetTnxDataFor= ${prodRefId}`))
    );     
    }

    /**
     * 
     */
    getFixedAssetAddlInfoTnxDataForUpdate(prodRefId: string,addlInfoMstSeqId: string,fixedAssetTnxSeqId: string): Observable<any> {
        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
        return this.http.get<any>(`${BASE_URL}/fixedAssetTnxs/fixedAssetAddlTnx/update/draft/${prodRefId}/${addlInfoMstSeqId}/${fixedAssetTnxSeqId}?access_token=${this.accessToken}`)
        .pipe(
                 tap(_=>this.log('Fixed Asset Tnx Data For Update',`${prodRefId} : ${addlInfoMstSeqId}`)),
                 catchError(this.handleError<any>(`getFixedAssetTnxDataFor= ${prodRefId}`))
    );     
    }   

      /**
     * Get Tnx Data By prodRefId and fixedAssetMstSeqId.
     * @param prodRefId  :
     * @param fixedAssetMstSeqId: 
     */
    getFixedAssetAdditonalTnxDataForUpdate(prodRefId: string,fixedAssetMstSeqId: string): Observable<any> {
        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
        return this.http.get<any>(`${BASE_URL}/fixedAssetTnx/update/draft/${prodRefId}/${fixedAssetMstSeqId}?access_token=${this.accessToken}`)
               .pipe(
                        tap(_=>this.log('Fixed Asset Tnx Data For Update',`${prodRefId} : ${fixedAssetMstSeqId}`)),
                        catchError(this.handleError<any>(`getFixedAssetTnxDataFor= ${prodRefId}`))
    );     
    }

    getLimitCodes(): Observable<UserLimit[]> {
        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
        return this.http.get<any>(`${BASE_URL}/userLimitTxn-limit-txn/userLimitMaster?access_token=${this.accessToken}`)
            .pipe(
                tap(_ => this.log(' Api Service', 'Fetch CodeValues By Id')),
                catchError(this.handleError<Code[]>('getAllCodes', []))
            )
    }

    getGroupCodes(): Observable<UserMatrix[]> {
        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
        return this.http.get<any>(`${BASE_URL}/userMatrixTxn-matrix-txn/userMatrixMaster?access_token=${this.accessToken}`)
            .pipe(
                tap(_ => this.log(' Api Service', 'Fetch CodeValues By Id')),
                catchError(this.handleError<Code[]>('getAllCodes', []))
            )
    }

    getFunctions(codeId: string, username: string): Observable<CodeValue[]> {
        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
        return this.http.get<any>(`${BASE_URL}/codevalue/values/${codeId}/${username}?access_token=${this.accessToken}`)
            .pipe(
                tap(_ => this.log(' Api Service', 'Fetch CodeValues By Id')),
                catchError(this.handleError<Code[]>('getAllCodes', []))
            )
    }

    
}
