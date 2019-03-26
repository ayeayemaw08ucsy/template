import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable,forkJoin } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { CodeValueService } from '../../service/codevalue/code-value.service';
import { Vendor } from 'src/app/model/vendor.model';
import { environment } from '../../../environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from '../../service/common/message.service';
import { _MatTabHeaderMixinBase } from '@angular/material/tabs/typings/tab-header';
import { of, BehaviorSubject } from 'rxjs';
import { CodeValue } from '../../model/codevalue.model';
import { Code } from '../../model/code.model';
import { MatDialog, MatDialogRef } from '@angular/material';
import { MatSnackBarComponent } from '../../component/mat-snack-bar/mat-snack-bar.component';
import { ApiError } from '../../model/apierror.model';
import { VendorAddDialogComponent } from '../../component/setup-vendor/dialog/vendor-add-dialog/vendor-add-dialog.component';
import { VendorEditDialogComponent } from '../../component/setup-vendor/dialog/vendor-edit-dialog/vendor-edit-dialog.component';
import { VendorDeleteDialogComponent } from '../../component/setup-vendor/dialog/vendor-delete-dialog/vendor-delete-dialog.component';

const BASE_URL = environment.baseUrl;
const BASIC_AUTH = environment.basicAuth;

// const headers = {
//     'Authorization': 'Basic ' + btoa(BASIC_AUTH),
//     'Content-type': 'application/x-www-form-urlencoded'
// };

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
    })
};

@Injectable({
  providedIn: 'root'
})
export class VendorService {

  dataChange: BehaviorSubject<Vendor[]> = new BehaviorSubject<Vendor[]>([]);
  businessDataChange: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  accessToken: string;
  dialogData: any;
  codeValObj: CodeValue;
  vendorObj: Vendor;
  // snackBar: any;
  vendors: Vendor[];

  constructor(private api: ApiService, private codeValApi: CodeValueService,
        private http: HttpClient,  public dialog: MatDialog,
        private messageService: MessageService,  private snackBar: MatSnackBarComponent) {
        console.log(window.sessionStorage);
        this.messageService.clearErrorMessage();
    }

  get data(): Vendor[] {
    return this.dataChange.value;
  }

  get businessData(): string[] {
    return this.businessDataChange.value;
  }

  getDialogData(): any {
    return this.dialogData;
  }

    /**
     *
     * @Param res
     */
    private extractData(res: Response) {
        // tslint:disable-next-line:prefer-const
        let body = res.json;
        console.log('In extract Data Method' + body);
        return body || {};
    }

  /**
   * Get All Code information and bind in businessDataChange For DataTable.
   */
//   getAll(): void {
//     this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
//     this.http.get<string[]>(`${BASE_URL}/codevalue/values?access_token=${this.accessToken}`).subscribe(data => {
//       console.log('Get All Data');
//       console.log(data)  ;
//       this.businessDataChange.next(data);
//     }, (error: HttpErrorResponse) => {
//       this.snackBar.openSnackBar(error.name , 'close', 'red-snackbar');
//     });
//   }


//   // Two way Select Data Binding Calling API of codes information
//   getAllCodes(): Observable<Code[]> {
//     return this.api.getAllCodes();
//   }

  // Two way Select Data Binding Calling API of codes information
  getAllVendorCodes(codeId: string): Observable<CodeValue[]> {
    return this.api.getCodeValuesById(codeId);
  }

  // Simulate GET /vendor
   getAllVendor(): void {
     this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
     
     const returnValueArray = forkJoin(
     this.http.get<CodeValue[]>(`${BASE_URL}/codevalue/values?access_token=${this.accessToken}`),
     this.http.get<Vendor[]>(`${BASE_URL}/vendors/vendor?access_token=${this.accessToken}`)
     )
     returnValueArray.subscribe(latestValues => {
      const[countryValueDesc, dataValue] = latestValues;
      let transformData = dataValue.map((obj) => {
                
            let country=countryValueDesc.find((ele) =>
                   ele.codeValue === obj.country    
                );
                
                 obj.countryDesc=country.shortDesc;
                return obj;
        })
        this.dataChange.next(transformData);
    },
    (error: HttpErrorResponse) => {
        this.snackBar.openSnackBar(error.name , 'close', 'red-snackbar');
      });

     // console.log('Get All Vendors');
         //console.log(data)  ;
      //this.dataChange.next(data);
   // }, (err: ApiError) => {
     // this.snackBar.openSnackBar(err.error.message, 'close', 'red-snackbar');
    //});
    }


  // Simulate GET /vendor/:id
   getVendorById(vendorSeqId: number): Observable<Vendor> {
      this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
        return this.http.get<Vendor>(`${BASE_URL}/vendors/vendor/${vendorSeqId}?access_token=${this.accessToken}`).pipe(
           tap(vendor => this.log('Vendor Api Service', `fetch Vendor Object ${vendor} By id = ${vendorSeqId}`)),
           catchError(this.handleError<Vendor>(`getVendor id=${vendorSeqId}`))
      );
   }

   // Simulate POST /vendor
   addVendor(vendor: Vendor, dialogRef: MatDialogRef<VendorAddDialogComponent>): void {
    this.accessToken =  JSON.parse(window.sessionStorage.getItem('token')).access_token;

        // return this.http.post<Vendor>(`${BASE_URL}/vendors/vendor?access_token=${this.accessToken}`, vendor, httpOptions).pipe(
        //    tap(addVendor => this.log('Api Service', `Create Vendor Object ${addVendor}`)),
        //    catchError(this.handleError<Vendor>(`AddVendor`))
        // );

      this.http.post<Vendor>(`${BASE_URL}/vendors/vendor?access_token=${this.accessToken}`, vendor).subscribe(data => {
        console.log('Response Data');
        console.log(data);
        this.dialogData = data;
        console.log('DialogData');
        console.log(this.dialogData);
        // this.snackBar.openSnackBar('Successfully added', 'Close', 'green-snackbar');
        this.addMessage('Vendor ' + data.vendorCode + ' successfuly registered.');
        dialogRef.close();
    },
        (err: ApiError) => {
            // this.snackBar.openSnackBar(err.error.message, 'close', 'red-snackbar');
            this.addMessage(err.error.message);
        });

   }

  // Suimulate PUT /vendor/:id {update transaction}
   updateVendor(vdr: Vendor, dialogRef: MatDialogRef<VendorEditDialogComponent>): void {
     this.accessToken =  JSON.parse(window.sessionStorage.getItem('token')).access_token;
        // tslint:disable-next-line:max-line-length
        // return this.http.put<Vendor>(`${BASE_URL}/vendors/vendor/${vdr.vendorSeqId}?access_token=${this.accessToken}`, vendor, httpOptions)
        // .pipe(
        //    map((res: this, extractData) => {
        //        return new Vendor(res);
        //    }),
        //    tap(updatedVdr => this.log('API service', `Updated Vendor Object ${updatedVdr}`)),
        //    catchError(this.handleError<Vendor>(`Update Vendor`))
        // );
        // tslint:disable-next-line:max-line-length
        this.http.put<Vendor>(`${BASE_URL}/vendors/vendor/request/update/${vdr.vendorSeqId}?access_token=${this.accessToken}`, vdr).subscribe(data => {
        this.dialogData = data;
        // this.snackBar.openSnackBar('Successfully Requested for update', 'Close', 'green-snackbar');
        this.addMessage('Vendor ' + data.vendorCode + ' successfuly requested for update.');
        dialogRef.close();
        },
        (err: ApiError) => {
            // this.snackBar.openSnackBar(err.error.message, 'close', 'red-snackbar');
            this.addMessage(err.error.message);
        });
   }

  // Simulate DELETE /vendor/:id
   removeVendor(vendorSeqId: number, dialogRef: MatDialogRef<VendorDeleteDialogComponent>): void {
     this.accessToken =  JSON.parse(window.sessionStorage.getItem('token')).access_token;
        console.log(httpOptions);
        // return this.http.delete<any>(`${BASE_URL}/vendors/vendor/${vendorSeqId}?access_token=${this.accessToken}`, httpOptions).pipe(
        //    tap(_ => this.log('Api Delete Vendor', `deleted vendor id=${vendorSeqId}`)),
        //    catchError(this.handleError<Vendor>('deleteVendor'))
        // );
        this.http.delete<any>(`${BASE_URL}/vendors/vendor/${vendorSeqId}?access_token=${this.accessToken}`).subscribe(data => {
        this.snackBar.openSnackBar('Successfully Deleted', 'Close', 'green-snackbar');
        dialogRef.close();
        },
        (err: ApiError) => {
            this.snackBar.openSnackBar(err.name, 'close', 'red-snackbar');
        });
   }

   getCodeValues(code_desc: string): Observable<CodeValue[]> {
      this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
        return this.http.get<CodeValue[]>(`${BASE_URL}/codesValue/codeValue/${code_desc}?access_token=${this.accessToken}`)
            .pipe(
                tap(_ => this.log('Api Service', 'Fetched Country List')),
                catchError(this.handleError<CodeValue[]>('getCountries', []))

            );
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

    /** Log a HeroService message with the MessageService */
    private addMessage(message: string) {
        this.messageService.addErrMessage(message);
    }

    private clearErrorMessage() {
        this.messageService.clearErrorMessage();
    }
}
