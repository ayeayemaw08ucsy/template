import { Injectable } from '@angular/core';
import { BehaviorSubject,forkJoin  } from 'rxjs';
import { Vendortnx } from '../../model/vendortnx.model';
import { Vendor } from '../../model/vendor.model';
import { MatSnackBarComponent } from '../../component/mat-snack-bar/mat-snack-bar.component';
import { ApiService } from '../../core/api.service';
import { environment } from '../../../environments/environment';
import { ApiError } from '../../model/apierror.model';
import { MatDialogRef } from '@angular/material';
import { CodeValue } from '../../model/codevalue.model';
// tslint:disable-next-line:max-line-length
import { VendorApprovalDialogComponent } from '../../component/setup-vendor/approve/dialog/vendor-approval-dialog/vendor-approval-dialog.component';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';

const BASE_URL = environment.baseUrl;
const BASIC_AUTH = environment.basicAuth;

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
export class VendorTnxService {

   // carray the updated data item from dialog.
   dataChange: BehaviorSubject<Vendortnx[]> = new BehaviorSubject<Vendortnx[]>([]);
   businessDataChange: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

   accessToken: string;

   dialogData: any;
   vendortnxObj: Vendortnx;
   vendorObj: Vendor;   

   constructor(private api: ApiService, private http: HttpClient, private snackBar: MatSnackBarComponent) { }

   get data(): Vendortnx[] {
    return this.dataChange.value;

  }

  get businessData(): string[] {
    return this.businessDataChange.value;
  }

  getDialogData(): any {
    return this.dialogData;
  }


   /*
   *
   * Get All Code information and bind in businessDataChange For DataTable.
   */
  getAllVendorApproval(tnxStatusCode: string): void {
    this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
    const returnValueArray = forkJoin(
      this.http.get<CodeValue[]>(`${BASE_URL}/codevalue/values?access_token=${this.accessToken}`),
      this.http.get<Vendortnx[]>(`${BASE_URL}/vendorTnxs/vendorTnx/${tnxStatusCode}?access_token=${this.accessToken}`)
    
      )
      returnValueArray.subscribe(latestValues => {
        const[countryValueDesc, dataValue] = latestValues;
        let transformData = dataValue.map((obj) => {
                  
              let country=countryValueDesc.find((ele) =>
                     ele.codeValue === obj.country    
                  );
                  
                   obj.country=country.shortDesc;
                  return obj;
          })
          this.dataChange.next(transformData);
      },
      (error: HttpErrorResponse) => {
          this.snackBar.openSnackBar(error.name , 'close', 'red-snackbar');
        });
  

  }

   approveVendor(vendorTnx: Vendortnx, dialogRef: MatDialogRef<VendorApprovalDialogComponent>): void {
    this.accessToken =  JSON.parse(window.sessionStorage.getItem('token')).access_token;

      this.http.post<Vendor>(`${BASE_URL}/vendorTnxs/vendorTnx/approve?access_token=${this.accessToken}`, vendorTnx).subscribe(data => {
        console.log('Response Data');
        console.log(data);
        this.dialogData = data;
        console.log('DialogData');
        console.log(this.dialogData);
        this.snackBar.openSnackBar('Vendor ' + data.vendorCode + ' has been successfully approved.', 'Close', 'green-snackbar');
        // dialogRef.close();
    },
        (err: ApiError) => {
            this.snackBar.openSnackBar(err.error.message, 'close', 'red-snackbar');
        });

   }

   updateVendor(vendorTnx: Vendortnx, dialogRef: MatDialogRef<VendorApprovalDialogComponent>): void {
    this.accessToken =  JSON.parse(window.sessionStorage.getItem('token')).access_token;

      // tslint:disable-next-line:max-line-length
      this.http.post<Vendor>(`${BASE_URL}/vendorTnxs/vendorTnx/update/approve?access_token=${this.accessToken}`, vendorTnx).subscribe(data => {
        console.log('Response Data');
        console.log(data);
        this.dialogData = data;
        console.log('DialogData');
        console.log(this.dialogData);
        this.snackBar.openSnackBar('Vendor ' + data.vendorCode + ' has been successfully approved.', 'Close', 'green-snackbar');
        dialogRef.close();
    },
        (err: ApiError) => {
            this.snackBar.openSnackBar(err.error.message, 'close', 'red-snackbar');
        });

   }


}
