import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { Branchtnx } from '../../model/branchtnx.model';
import { Branch } from '../../model/branch.model';
import { ApiService } from '../../core/api.service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBarComponent } from '../../component/mat-snack-bar/mat-snack-bar.component';
import { environment } from '../../../environments/environment';
import { ApiError } from '../../model/apierror.model';
import { MatDialogRef } from '@angular/material';
// tslint:disable-next-line:max-line-length
import { BranchApprovalDialogComponent } from '../../component/setup-branch/approval/branch-approval-dialog/branch-approval-dialog.component';
import { CodeValue } from 'src/app/model/codevalue.model';

const BASE_URL = environment.baseUrl;
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class BranchTnxService {

  dataChange: BehaviorSubject<Branchtnx[]> = new BehaviorSubject<Branchtnx[]>([]);
  businessDataChange: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  accessToken: string;

  dialogData: any;
  // branchtnxObj: Branchtnx;
  // branchObj: Branch;

  constructor(private api: ApiService, private http: HttpClient, private snackBar: MatSnackBarComponent) { }

  get data(): Branchtnx[] {
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
  getAllBranchApproval(tnxStatusCode: string): void {
    this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
    // tslint:disable-next-line:max-line-length

    const returnValueArray = forkJoin(
      this.http.get<CodeValue[]>(`${BASE_URL}/codevalue/values?access_token=${this.accessToken}`),
      this.http.get<Branchtnx[]>(`${BASE_URL}/branchTnxs/branchTnx/${tnxStatusCode}?access_token=${this.accessToken}`)
    )

    returnValueArray.subscribe(latestValues => {
      const [countryValueDesc, dataValue] = latestValues;
      let transformData = dataValue.map((obj) => {

        let ctValue = countryValueDesc.find((ele) => {

          if (ele.code.id === '301' && ele.codeValue === obj.country) {

            return true;

          } else {

            return false;

          }
        }
        );

        let rgValue = countryValueDesc.find((ele) => {

          if (ele.code.id === '002' && ele.codeValue === obj.region) {

            return true;

          } else {

            return false;

          }
        }
        );

        obj.countryDesc = ctValue.shortDesc;
        obj.regionDesc = rgValue.shortDesc;
        return obj;
      })
      this.dataChange.next(transformData);
    },
      (error: HttpErrorResponse) => {
        this.snackBar.openSnackBar(error.name, 'close', 'red-snackbar');
      });
  }

  approveBranch(branchTnx: Branchtnx, dialogRef: MatDialogRef<BranchApprovalDialogComponent>): void {
    this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;

    this.http.post<Branch>(`${BASE_URL}/branchTnxs/branchTnx/approve?access_token=${this.accessToken}`, branchTnx).subscribe(data => {
      console.log('Response Data');
      console.log(data);
      this.dialogData = data;
      console.log('DialogData');
      console.log(this.dialogData);
      this.snackBar.openSnackBar('Branch ' + data.branchCode + ' has been successfully approved.', 'Close', 'green-snackbar');
    },
      (err: ApiError) => {
        this.snackBar.openSnackBar(err.error.message, 'close', 'red-snackbar');
      });

  }

  updateBranch(branchTnx: Branchtnx, dialogRef: MatDialogRef<BranchApprovalDialogComponent>): void {
    this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;

    // tslint:disable-next-line:max-line-length
    this.http.post<Branch>(`${BASE_URL}/branchTnxs/branchTnx/update/approve?access_token=${this.accessToken}`, branchTnx).subscribe(data => {
      console.log('Response Data');
      console.log(data);
      this.dialogData = data;
      console.log('DialogData');
      console.log(this.dialogData);
      this.snackBar.openSnackBar('Branch ' + data.branchCode + ' has been successfully approved.', 'Close', 'green-snackbar');
      dialogRef.close();
    },
      (err: ApiError) => {
        this.snackBar.openSnackBar(err.error.message, 'close', 'red-snackbar');
      });

  }
}
