import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient , HttpErrorResponse } from '@angular/common/http';
import { FixedAsset } from '../../model/fixedasset.model';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CodeValue } from '../../model/codevalue.model';
import { MessageService } from '../common/message.service';
import { ApiService } from '../../core/api.service';
import { ApiError } from '../../model/apierror.model';
import { Router } from '@angular/router';
import { Vendor } from '../../model/vendor.model';
import { tap, catchError } from 'rxjs/operators';
import { DepreciationPolicy } from '../../model/depreciationpolicy.model';
import { FixedAssetTnx } from '../../model/fixedassettnx.model';
import { FixedAssetAdditionalInfo } from '../../model/fixedassetadditionalinfo.model';
import { CommonModule } from '@angular/common';
import { TnxType, TnxSubType, TnxStatusCode } from 'src/app/model/common.model';
import { CollapseComponent } from 'angular-bootstrap-md';
import { errormessage } from 'src/environments/errormessage';
import { PictureAndQRInfo } from 'src/app/model/pictureandqrinfo.model';
import { MatSnackBarComponent } from 'src/app/component/mat-snack-bar/mat-snack-bar.component';

const BASE_URL = environment.baseUrl;
const BASIC_AUTH = environment.basicAuth;
const USER_UPDATE=errormessage.update; 
const USER_DELETE=errormessage.deleted;
const USER_REQUST=errormessage.userlimit;
const USER_SAVED=errormessage.saved;

const FA_UPDATE_ADDED=errormessage.update;
const FA_UPDATE_APPROVED=errormessage.approved;
const FA_DISPOSE_ADDED = errormessage.disposed;
const FA_DISPOSE_APPROVED = errormessage.approved;

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
    })
};

@Injectable({
  providedIn: 'root'
})
export class FixedassetService {

  dataChange: BehaviorSubject<FixedAsset[]> = new BehaviorSubject<FixedAsset[]>([]);
  businessDataChange: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  accessToken: string;
  codeValObj: CodeValue;
  addlInfo : any;
  pcQrInfo : any;
  fixedAssetInfo : any;
  cloneFixedAssetInfo: any;
  faStatusInfo : string;
  //reqestBody Parameter Start
  fixedAssetTnx: any;
  addlInfoTnx: any;
  imgInfoTnx: any;
  
  /**DropDown field */
  selectedBranch: string;
  selectedVendor: string;
  selectedDepartment: string;
  /**reqestBody Parameter End */
  
  private addlInfoSource = new BehaviorSubject(this.addlInfo);
  private pcqrInfoSource = new BehaviorSubject(this.pcQrInfo);
  private fixedAssetInfoSource = new BehaviorSubject(this.fixedAssetInfo);
  private cloneFixedAssetInfoSource = new BehaviorSubject(this.cloneFixedAssetInfo);
  private fixedAssetStatusInfoSource = new BehaviorSubject(this.faStatusInfo);
 
  /**For DropDown field */
  private selectedBranchInfoSource = new BehaviorSubject(this.selectedBranch);
  private selectedVendorInfoSource = new BehaviorSubject(this.selectedVendor);
  private selectedDepartmentInfoSource = new BehaviorSubject(this.selectedDepartment);

  currentAddlInfoSource = this.addlInfoSource.asObservable();
  currentPcqrInfoSource = this.pcqrInfoSource.asObservable();
  currentFixedAssetInfoSource = this.fixedAssetInfoSource.asObservable();
  currentCloneFixedAssetInfoSource = this.cloneFixedAssetInfoSource.asObservable();
   
  currentFAStatus = this.fixedAssetStatusInfoSource.asObservable();

  /**For DropDown field */
  currentSelectedBranchInfoSource = this.selectedBranchInfoSource.asObservable();
  currentSelectedVendorInfoSource = this.selectedVendorInfoSource.asObservable();
  currentSelectedDeparmentInfoSource = this.selectedDepartmentInfoSource.asObservable();


  constructor(private api: ApiService, public fixedassetService: FixedassetService,
              private http: HttpClient, private messageService: MessageService, private router: Router,
              private snackBar ?: MatSnackBarComponent) { }

  get data(): FixedAsset[] {
    return this.dataChange.value;
  }

  get businessData(): string[] {
    return this.businessDataChange.value;
  }

  getCodeValues(codeId: string): Observable<CodeValue[]> {
    return this.api.getCodeValuesById(codeId);
  }

  getAllVendors(): Observable<Vendor[]> {
        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
        return this.http.get<any>(`${BASE_URL}/vendors/vendor?access_token=${this.accessToken}`)
            .pipe(
                tap(_ => this.log(' FixedAsset Service', 'Fetch Vendor By Id')),
                catchError(this.handleError<Vendor[]>('getAllVendors', []))
            );
  }

  getDepreciationPolicy(assetType: string, assetSubType: string): Observable<DepreciationPolicy> {
        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
        return this.http.get<any>(`${BASE_URL}/deppolicy/policy/${assetType}/${assetSubType}?access_token=${this.accessToken}`)
            .pipe(
                tap(_ => this.log(' FixedAsset Service', 'Fetch DepreciationPolicy By Asset Type')),
                catchError(this.handleError<DepreciationPolicy>('getDepreciationPolicy'))
            );
  }

  getFixedAssetDraft(prodRefId: string): Observable<FixedAssetTnx> {
        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
        // tslint:disable-next-line:max-line-length
        return this.http.get<FixedAssetTnx>(`${BASE_URL}/fixedAssetTnxs/fixedAssetTnx/fixedAssetDraft/${prodRefId}?access_token=${this.accessToken}`)
            .pipe(
                tap(_ => this.log(' FixedAsset Service', 'Fetch FixedAssetDraft By Asset Type')),
                catchError(this.handleError<FixedAssetTnx>('getFixedAssetDraft'))
            );
  }

  getFixedAssetDraftAdditionalInfo(fixedAssetTnx: FixedAssetTnx): Observable<FixedAssetAdditionalInfo> {
        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
        // tslint:disable-next-line:max-line-length
        return this.http.get<FixedAssetAdditionalInfo>(`${BASE_URL}/fixedAssetTnxs/fixedAssetTnx/fixedAssetDraft/additionalInfo/${fixedAssetTnx.fixedAssetTnxSeqId}?access_token=${this.accessToken}`)
            .pipe(
                tap(_ => this.log(' FixedAsset Service', 'Fetch FixedAssetDraftAdditionalInfo By Asset Type')),
                catchError(this.handleError<FixedAssetAdditionalInfo>('getFixedAssetDraftAdditionalInfo'))
            );
  }

  getImageInfo(fixedAssetTnx: FixedAssetTnx): Observable<PictureAndQRInfo> {
    this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
    // tslint:disable-next-line:max-line-length
    return this.http.get<PictureAndQRInfo>(`${BASE_URL}/fixedAssetTnxs/fixedAssetTnx/fixedAssetDraft/imageInfo/${fixedAssetTnx.fixedAssetTnxSeqId}?access_token=${this.accessToken}`)
        .pipe(
            tap(_ => this.log(' FixedAsset Service', 'Fetch PictureAndQRInfo By Asset Type')),
            catchError(this.handleError<PictureAndQRInfo>('getPictureAndQRInfo'))
        );
}


   saveDraft(fixedAsset: FixedAssetTnx): void {
    this.clearErrorMessage();
    this.accessToken =  JSON.parse(window.sessionStorage.getItem('token')).access_token;
    this.http.post<FixedAsset>(`${BASE_URL}/fixedAssets/fixedAsset/draft?access_token=${this.accessToken}`, fixedAsset).subscribe(data => {
        console.log('Response Data');
        console.log(data);
        this.addMessage(USER_SAVED);
    },
        (err: ApiError) => {
            this.addMessage(err.error.message);
        });
   }

   register(fixedAsset: FixedAssetTnx): void {
    this.clearErrorMessage();
    this.accessToken =  JSON.parse(window.sessionStorage.getItem('token')).access_token;
    // tslint:disable-next-line:max-line-length
    this.http.post<FixedAsset>(`${BASE_URL}/fixedAssetTnxs/fixedAssetTnx/request/register?access_token=${this.accessToken}`, fixedAsset).subscribe(data => {
        console.log('Response Data');
        console.log(data);
        this.addMessage(USER_REQUST);
    },
        (err: ApiError) => {
            this.addMessage(err.error.message);
        });
   }

   approveRegister(fixedAssetTnx: FixedAsset): void {
    this.clearErrorMessage();
    this.accessToken =  JSON.parse(window.sessionStorage.getItem('token')).access_token;
    // tslint:disable-next-line:max-line-length
    this.http.post<FixedAsset>(`${BASE_URL}/fixedAssetTnxs/fixedAssetTnx/approve?access_token=${this.accessToken}`, fixedAssetTnx).subscribe(data => {
        console.log('Response Data');
        console.log(FA_DISPOSE_APPROVED);
        this.addMessage(FA_DISPOSE_APPROVED);
    },
        (err: ApiError) => {
            this.addMessage(err.error.message);
        });
   }

   complete(fixedAsset: FixedAsset): void {
    this.clearErrorMessage();
    this.accessToken =  JSON.parse(window.sessionStorage.getItem('token')).access_token;
    // tslint:disable-next-line:max-line-length
    this.http.post<FixedAsset>(`${BASE_URL}/fixedAssetTnxs/fixedAssetTnx/request/complete?access_token=${this.accessToken}`, fixedAsset).subscribe(data => {
        console.log('Response Data');
        console.log(data);
        this.addMessage('Fixed Asset ' + data.prodRefId + ' successfuly requested.');
    },
        (err: ApiError) => {
            this.addMessage(err.error.message);
        });
   }

   requestForAmend(fixedAsset: FixedAsset): void {
    this.clearErrorMessage();
    this.accessToken =  JSON.parse(window.sessionStorage.getItem('token')).access_token;
    // tslint:disable-next-line:max-line-length
    this.http.post<FixedAsset>(`${BASE_URL}/fixedAssets/fixedAsset/request/amend?access_token=${this.accessToken}`, fixedAsset).subscribe(data => {
        console.log('Response Data');
        console.log(USER_REQUST);
        this.addMessage(USER_REQUST);
    },
        (err: ApiError) => {
            this.addMessage(err.error.message);
        });
   }

   amendApprove(fixedAsset: FixedAsset): void {
    this.clearErrorMessage();
    this.accessToken =  JSON.parse(window.sessionStorage.getItem('token')).access_token;
    // tslint:disable-next-line:max-line-length
    this.http.post<FixedAsset>(`${BASE_URL}/fixedAssetTnxs/fixedAssetTnx/amend/approve?access_token=${this.accessToken}`, fixedAsset).subscribe(data => {
        console.log('Response Data');
        console.log(data);
        this.addMessage(USER_REQUST);
    },
        (err: ApiError) => {
            this.addMessage(err.error.message);
        });
   }

   deleteEntry(fixedAssetTnxSeqId: string): void {
    this.clearErrorMessage();
    console.log('in delete service.');
    this.accessToken =  JSON.parse(window.sessionStorage.getItem('token')).access_token;
    // tslint:disable-next-line:max-line-length
    this.http.delete<any>(`${BASE_URL}/fixedAssetTnxs/fixedAssetTnx/delete/${fixedAssetTnxSeqId}?access_token=${this.accessToken}`).subscribe(data => {
        console.log('Response Data');
        console.log(USER_DELETE);
        this.addMessage(USER_DELETE);
    },
        (err: ApiError) => {
            this.addMessage(err.error.message);
        });
   }

   getFixedAssetForRegisterApproval(fixedAssetTnxSeqId: string): Observable<any> {
        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
       return this.http.get<any>(`${BASE_URL}/fixedAssets/fixedAsset/request/update/${fixedAssetTnxSeqId}?access_token=${this.accessToken}`)
        .pipe(
                tap(_ => this.log('fetched FixedAsset Data For Update', `${fixedAssetTnxSeqId}`)),
                catchError(this.handleError<any>(`getFixedAssetDataForUpdate = ${fixedAssetTnxSeqId}`))

     );
    }

    getFixedAssetForAmend(fixedAssetMstSeqId: string): Observable<any> {
        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
       return this.http.get<any>(`${BASE_URL}/fixedAssets/fixedAsset/request/amend/${fixedAssetMstSeqId}?access_token=${this.accessToken}`)
        .pipe(
                tap(_ => this.log('fetched FixedAsset Data For Amend', `${fixedAssetMstSeqId}`)),
                catchError(this.handleError<any>(`getFixedAssetDataForAmend = ${fixedAssetMstSeqId}`))

     );
    }

    getFixedAssetForAmendApproval(fixedAssetTnxSeqId: string): Observable<any> {
        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
       return this.http.get<any>(`${BASE_URL}/fixedAssets/fixedAsset/request/amendApproval/${fixedAssetTnxSeqId}?access_token=${this.accessToken}`)
        .pipe(
                tap(_ => this.log('fetched FixedAsset Data For Amend', `${fixedAssetTnxSeqId}`)),
                catchError(this.handleError<any>(`getFixedAssetDataForAmend = ${fixedAssetTnxSeqId}`))

     );
    }

   /** Log a HeroService message with the MessageService */
    public addMessage(message: string) {
        this.messageService.addErrMessage(message);
    }

    public clearErrorMessage() {
        this.messageService.clearErrorMessage();
    }

    handleError<T>(operation = 'operation', result?: T): any {
        return (error: any): Observable<T> => {
            this.log('servicename', `${operation} failed: ${error.message}`);

            return of(result as T);

        };
    }

    private log(servicename: string, message: string) {
        this.messageService.add(`${servicename} : ${message}`);
    }

     /**
   * Update FixedAsset Module Start.
   * Existing
   */
 getAllApprovedDataForUpdateFixedAsset(): void {
    this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
    this.http.get<FixedAsset[]>(`${BASE_URL}/fixedAssets/fixedAsset?access_token=${this.accessToken}`).subscribe(data => {
       this.dataChange.next(data);
    }, (error: HttpErrorResponse) => {
      // this.snackBar.openSnackBar(error.name , 'close', 'red-snackbar');
    });
  }
  
  getAllPendingDataForUpdateFixedAsset():void {
    this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
    this.http.get<FixedAsset[]>(`${BASE_URL}/fixedAssetTnxs/get-tasks/pending?access_token=${this.accessToken}`).subscribe(data => {

        console.log('Pending %%%%%%%%%%%%%%%%%%',data)
       this.dataChange.next(data);
    }, (error: HttpErrorResponse) => {
      // this.snackBar.openSnackBar(error.name , 'close', 'red-snackbar');
    });
  }
  
  getAllPendingDataForDisposeFixedAsset():void {
    this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
    this.http.get<FixedAsset[]>(`${BASE_URL}/fixedAssetTnxs/get-tasks/dispose/pending?access_token=${this.accessToken}`).subscribe(data => {

        console.log('Pending %%%%%%%%%%%%%%%%%%',data)
       this.dataChange.next(data);
    }, (error: HttpErrorResponse) => {
      // this.snackBar.openSnackBar(error.name , 'close', 'red-snackbar');
    });
  }

  getAllCompletedDataForUpdateFixedAsset(tnxType: any): void {
    let tnxStatusCode = '02';
    this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
    this.http.get<FixedAsset[]>(`${BASE_URL}/fixedAssetTnxs/fixedAssetTnx/${tnxStatusCode}/${tnxType}?access_token=${this.accessToken}`).subscribe(data => {

        console.log('Complete List %%%%%%%%%%%%%%%%%%',data)
       this.dataChange.next(data);
    }, (error: HttpErrorResponse) => {
      // this.snackBar.openSnackBar(error.name , 'close', 'red-snackbar');
    });
  }

  /**
   * 
   * @param fixedAssetMst : data from mst
   * @param addlInfoMst :
   * @param pcQRInfoMst 
   *     
   */
  updateFAData(fixedAssetMst:any , addlInfoMst: any, pcQRInfoMst:any,fixedAssetTnx: any ,cloneFixedAssetMst: any) {
    this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
  //  console.log('***********Before*********** ',cloneFixedAssetMst);
    this.fixedAssetTnx = Object.assign({},this.fixedAssetTnx,{fixedAsset:cloneFixedAssetMst});
  //  console.log('***********After*********** ',this.fixedAssetTnx);
    this.fixedAssetTnx = this.createNewObject(this.fixedAssetTnx,addlInfoMst,pcQRInfoMst , fixedAssetMst);
    console.log(this.fixedAssetTnx);
    this.http.post<Object[]>(`${BASE_URL}/fixedAssetTnxs/fixedAssetTnx/update/complete?access_token=${this.accessToken}`,this.fixedAssetTnx).subscribe(data => {
        //this.messageService.addErrMessage(FA_UPDATE_ADDED);
        console.log("Return UpdateFA Data $$$$$$$$$$$$$$" , data);
        this.snackBar.openSnackBar(FA_UPDATE_ADDED , 'close', 'red-snackbar');

    },
     (err: ApiError) => {
        //this.snackBar.openSnackBar(err.error.message, 'close', 'red-snackbar');
        this.messageService.clearErrorMessage();    
        this.messageService.addErrMessage(err.error.message); 
       })
 }


 /**
   * 
   * @param fixedAssetMst : data from mst
   * @param addlInfoMst :
   * @param pcQRInfoMst 
   *     
   */
  disposeFAData(fixedAssetMst:any , addlInfoMst: any, pcQRInfoMst:any,fixedAssetTnx: any ,cloneFixedAssetMst: any) {
    this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
    console.log('***********Before Dispose*********** ',cloneFixedAssetMst);
    this.fixedAssetTnx = Object.assign({},this.fixedAssetTnx,{fixedAsset:cloneFixedAssetMst});
    console.log('***********After Dispose*********** ',this.fixedAssetTnx);
    this.fixedAssetTnx = this.createNewObject(this.fixedAssetTnx,addlInfoMst,pcQRInfoMst , fixedAssetMst);
    
    this.http.post<Object[]>(`${BASE_URL}/fixedAssetTnxs/fixedAssetTnx/dispose/complete?access_token=${this.accessToken}`,this.fixedAssetTnx).subscribe(data => {
        
        console.log("Return UpdateFA Data $$$$$$$$$$$$$$" , data);
        this.snackBar.openSnackBar(FA_DISPOSE_ADDED , 'close', 'red-snackbar');

        this.messageService.addErrMessage(FA_DISPOSE_ADDED);
    },
    (err: ApiError) => {
       //this.snackBar.openSnackBar(err.error.message, 'close', 'red-snackbar');
       this.messageService.clearErrorMessage();    
       this.messageService.addErrMessage(err.error.message); 
      })
 }
 /**
  * 
  * @param fixedAssetMst 
  * @param addlInfoMst 
  * @param pcQRInfoMst 
  */
  saveAsDraftUpdateFA(fixedAssetMst:any , addlInfoMst: any, pcQRInfoMst:any,fixedAssetTnx: any ,cloneFixedAssetMst: any) {
    console.log("Pending SaveAsDraft update");
    console.log(cloneFixedAssetMst);
   // console.log(this.fixedAssetTnx);
    this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
    this.fixedAssetTnx = Object.assign({},this.fixedAssetTnx,{fixedAsset:cloneFixedAssetMst});
    //this.fixedAssetTnx.fixedAsset = cloneFixedAssetMst;
    this.fixedAssetTnx = this.createNewObject(this.fixedAssetTnx,addlInfoMst,pcQRInfoMst , fixedAssetMst);
    console.log("Save As Draft For Update Fa", this.fixedAssetTnx);
    this.http.post<Object[]>(`${BASE_URL}/fixedAssetTnxs/fixedAssetTnx/update/draft?access_token=${this.accessToken}`,this.fixedAssetTnx).subscribe(data => {
        
        console.log("Return Data $$$$$$$$$$$$$$" , data);
    }),(error : HttpErrorResponse) => {

    }
  }

  /**
  * 
  * @param fixedAssetMst 
  * @param addlInfoMst 
  * @param pcQRInfoMst 
  */
 saveAsDraftDisposeFA(fixedAssetMst:any , addlInfoMst: any, pcQRInfoMst:any,fixedAssetTnx: any ,cloneFixedAssetMst: any) {
    console.log("Pending SaveAsDraft Dispose");
    console.log(cloneFixedAssetMst);
    console.log(this.fixedAssetTnx);
    this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
    //this.fixedAssetTnx = Object.assign({},this.fixedAssetTnx,{fixedAsset:cloneFixedAssetMst});
    this.fixedAssetTnx.fixedAsset = cloneFixedAssetMst;
    this.fixedAssetTnx = this.createNewObject(this.fixedAssetTnx,addlInfoMst,pcQRInfoMst , fixedAssetMst);
    console.log("Save As Draft For Dispose Fa", this.fixedAssetTnx);
    this.http.post<Object[]>(`${BASE_URL}/fixedAssetTnxs/fixedAssetTnx/dispose/draft?access_token=${this.accessToken}`,this.fixedAssetTnx).subscribe(data => {
        
        console.log("Return Data $$$$$$$$$$$$$$" , data);
    }),(error : HttpErrorResponse) => {

    }
  }

  approveUpdateFA(fixedAssetMst:any , addlInfoMst: any, pcQRInfoMst:any,fixedAssetTnx: any ,cloneFixedAssetMst: any) {
   
    this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
    // this.fixedAssetTnx = Object.assign({},this.fixedAssetTnx,fixedAssetMst);
    this.fixedAssetTnx = Object.assign({},this.fixedAssetTnx,{fixedAsset:cloneFixedAssetMst});
    fixedAssetMst.addlInfoTnx = addlInfoMst;
    fixedAssetMst.imgInfoTnx = pcQRInfoMst;
    this.fixedAssetTnx = Object.assign({},this.fixedAssetTnx,fixedAssetMst);
    this.fixedAssetTnx.tnxStatusCode = TnxStatusCode.Approved;
    this.fixedAssetTnx.tnxType = TnxType.Update;
    this.fixedAssetTnx.tnxSubType = TnxSubType.InfoUpdate;
   


  //  this.fixedAssetTnx = this.createNewObject(this.fixedAssetTnx,addlInfoMst,pcQRInfoMst , fixedAssetMst);
    console.log('^^^^^^^^^^^^^^^^^^^^',this.fixedAssetTnx);
    this.http.post<Object[]>(`${BASE_URL}/fixedAssets/update/approve?access_token=${this.accessToken}`,this.fixedAssetTnx).subscribe(data => {
        
        console.log("Return Data Approve " , data);
        this.snackBar.openSnackBar(FA_UPDATE_APPROVED , 'close', 'red-snackbar');
    }),(error : HttpErrorResponse) => {

    }
  }

  approveDisposeFA(fixedAssetMst:any , addlInfoMst: any, pcQRInfoMst:any,fixedAssetTnx: any ,cloneFixedAssetMst: any) {
    this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
    // this.fixedAssetTnx = Object.assign({},this.fixedAssetTnx,fixedAssetMst);
    this.fixedAssetTnx = Object.assign({},this.fixedAssetTnx,{fixedAsset:cloneFixedAssetMst});
    fixedAssetMst.addlInfoTnx = addlInfoMst;
    fixedAssetMst.imgInfoTnx = pcQRInfoMst;
    this.fixedAssetTnx = Object.assign({},this.fixedAssetTnx,fixedAssetMst);
    this.fixedAssetTnx.tnxStatusCode = TnxStatusCode.Approved;
    this.fixedAssetTnx.tnxType = TnxType.Dispose;
    this.fixedAssetTnx.tnxSubType = this.fixedAssetTnx.disposeType;
    this.fixedAssetTnx.tnxType = TnxType.Dispose;

  //  this.fixedAssetTnx = this.createNewObject(this.fixedAssetTnx,addlInfoMst,pcQRInfoMst , fixedAssetMst);
    console.log('^^^^^^^^^^^^^^^^^^^^',this.fixedAssetTnx);
    this.http.post<Object[]>(`${BASE_URL}/fixedAssets/dispose/approve?access_token=${this.accessToken}`,this.fixedAssetTnx).subscribe(data => {
        
        console.log("Return Data Approve " , data);
        this.snackBar.openSnackBar(FA_DISPOSE_APPROVED , 'close', 'red-snackbar');

    }),(error : HttpErrorResponse) => {

    }  
  }

  deleteUpdateFA(fixedAssetMst:any , addlInfoMst: any, pcQRInfoMst:any,fixedAssetTnx: any ,cloneFixedAssetMst: any) {
    let fixedAssetTnxSeqId = fixedAssetTnx.fixedAssetTnxSeqId;
    this.accessToken =  JSON.parse(window.sessionStorage.getItem('token')).access_token;
    // tslint:disable-next-line:max-line-length
    this.http.delete<any>(`${BASE_URL}/fixedAssetTnxs/fixedAssetTnx/delete/${fixedAssetTnxSeqId}?access_token=${this.accessToken}`).subscribe(data => {
      console.log('Response Data');
      console.log(USER_DELETE);
      this.addMessage(USER_DELETE);
  },
      (err: ApiError) => {
          this.addMessage(err.error.message);
      });
  }
   
  /**
   * 
   * @param fixedAssetTnx 
   * @param addlInfo 
   * @param pcQRInfo 
   */
 createNewObject(fixedAssetTnx: any, addlInfo : any, pcQRInfo: any , fixedAssetMst: any): FixedAssetTnx {
    
    if(this.isEmpty(addlInfo)) {
        console.log('Empty',addlInfo);
        this.fixedAssetTnx = Object.assign({},fixedAssetTnx,{addlInfoTnx: null});
    }else {
        console.log('Not Empty',addlInfo);
        this.fixedAssetTnx = Object.assign({},fixedAssetTnx,{addlInfoTnx: addlInfo});
    }
     
    if(pcQRInfo) {

        this.fixedAssetTnx = Object.assign({},this.fixedAssetTnx,{imgInfoTnx: null});

    }else {

        this.fixedAssetTnx = Object.assign({},this.fixedAssetTnx,{imgInfoTnx: pcQRInfo});

    }
    
    this.fixedAssetTnx = Object.assign({},this.fixedAssetTnx,{
                entity: fixedAssetMst.entity,
                productCode: fixedAssetMst.productCode,
                assetType:fixedAssetMst.assetType,
                assetSubType: fixedAssetMst.assetSubType,
                prodRefId: fixedAssetMst.prodRefId,
                requester: fixedAssetMst.requester,
                businessDate: fixedAssetMst.businessDate,
                invoiceDate: fixedAssetMst.invoiceDate,
                invoiceRef: fixedAssetMst.invoiceRef,
                invUnitPrice: fixedAssetMst.invUnitPrice,
                invQuantity: fixedAssetMst.invQuantity,
                invCurrency: fixedAssetMst.invCurrency,
                invAmount: fixedAssetMst.invAmount,
                exchRate: fixedAssetMst.exchRate,
                tnxCurrency: fixedAssetMst.tnxCurrency,
                tnxAmount: fixedAssetMst.tnxAmount,
                bookCurrency: fixedAssetMst.bookCurrency,
                bookAmt: fixedAssetMst.bookAmt,
                purchaseDate: fixedAssetMst.purchaseDate,
                assetDesc1: fixedAssetMst.assetDesc1,
                assetDesc2: fixedAssetMst.assetDesc2,
                assetModel: fixedAssetMst.assetModel,
                serialNo: fixedAssetMst.serialNo,
                uniqueId: fixedAssetMst.uniqueId,
                assetQuantity: fixedAssetMst.assetQuantity,
                branchCode: fixedAssetMst.branchCode,
                deptCode: fixedAssetMst.deptCode,
                depMethod: fixedAssetMst.depMethod,
                depRate: fixedAssetMst.depRate,
                depUsefulLife: fixedAssetMst.depUsefulLife,
                depCollFrequency: fixedAssetMst.depCollFrequency,
                residualCurrency: fixedAssetMst.residualCurrency,
                residualValue: fixedAssetMst.residualValue,
                accumDepCurrency: fixedAssetMst.accumDepCurrency,
                accumDepAmt: fixedAssetMst.accumDepAmt,
                depSequence: fixedAssetMst.depSequence,
                netAssetCurrency:fixedAssetMst.netAssetCurrency,
                netAssetAmount: fixedAssetMst.netAssetAmount,
                disposalDate: fixedAssetMst.disposalDate,
                disposeType: fixedAssetMst.disposeType,
                archiveFlag: fixedAssetMst.archiveFlag,
                vendorCode: fixedAssetMst.vendorCode,
                vendorName: fixedAssetMst.vendorName,
                prodStatusCode: fixedAssetMst.prodStatusCode,	
                taskId: fixedAssetMst.taskId,
                taskName: fixedAssetMst.taskName,
                tnxType: TnxType.Update,
                tnxSubType:TnxSubType.FixedAsset,
                tnxStatusCode: TnxStatusCode.Pending,
                assetTracking: fixedAssetMst.assetTracking

    })
    return this.fixedAssetTnx;
 } 

  getAllApproveForRegisterFixedAsset(): void {
    this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
    // tslint:disable-next-line:max-line-length
    this.http.get<FixedAsset[]>(`${BASE_URL}/fixedAssetTnxs/fixedAssetTnx/fixedAssetWaiting?access_token=${this.accessToken}`).subscribe(data => {
       this.dataChange.next(data);
       // this.data = datatnx;
    }, (error: HttpErrorResponse) => {
      // this.snackBar.openSnackBar(error.name , 'close', 'red-snackbar');
    });
  }

  getAllDraftForRegisterFixedAsset(): void {
    this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
    // tslint:disable-next-line:max-line-length
    this.http.get<FixedAsset[]>(`${BASE_URL}/fixedAssetTnxs/fixedAssetTnx/draft/fixedAssetPending?access_token=${this.accessToken}`).subscribe(data => {
       this.dataChange.next(data);
       // this.data = datatnx;
    }, (error: HttpErrorResponse) => {
      // this.snackBar.openSnackBar(error.name , 'close', 'red-snackbar');
    });
  }  

  getAllApprovedDataForAmendFixedAsset(): void {
    this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
    this.http.get<FixedAsset[]>(`${BASE_URL}/fixedAssets/fixedAsset/amend?access_token=${this.accessToken}`).subscribe(data => {       
       this.dataChange.next(data);
    }, (error: HttpErrorResponse) => {
      // this.snackBar.openSnackBar(error.name , 'close', 'red-snackbar');
    });
  }

  getAllAmendApprovalWaitingFixedAsset(): void {
    this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
    // tslint:disable-next-line:max-line-length
    this.http.get<FixedAsset[]>(`${BASE_URL}/fixedAssetTnxs/fixedAssetTnx/amend/fixedAssetWaitingApproval?access_token=${this.accessToken}`).subscribe(data => {
       this.dataChange.next(data);
       // this.data = datatnx;
    }, (error: HttpErrorResponse) => {
      // this.snackBar.openSnackBar(error.name , 'close', 'red-snackbar');
    });
  } 

 getFixedAssetDataForUpdate(prodRefId: string): Observable<any> {
   return this.api.getFixedAssetDataForUpdate(prodRefId);
}
 
/**
 * 
 * @param prodRefId 
 * @param fixedAssetMstSeqId 
 */
geFixedAssetTnxDataForUpdate(prodRefId: string, fixedAssetMstSeqId: string) : Observable<any> {
   return this.api.getFixedAssetTnxDataForUpdate(prodRefId,fixedAssetMstSeqId);
}

getFixedAssetAddlInfoTnxDataForUpdate(prodRefId: string,addlInfoMstSeqId: string,fixedAssetTnxSeqId: string) : Observable<any> {
   return this.api.getFixedAssetAddlInfoTnxDataForUpdate(prodRefId,addlInfoMstSeqId,fixedAssetTnxSeqId);
}

 /**
  * Get Select Binding Component Data .
  * filter by codeId
  * @Param codeId
  */
 getSelectBindingCodeValue(codeId: string): Observable<CodeValue[]> {
    return this.api.getCodeValuesById(codeId);
    }

    /**
     * Data Carry For Page Navigation.
     * @Param data
     */
 changeAddlInfoData(data: any) {
    this.addlInfoSource.next(data);
   }

 changePcQRInfoData(data: any) {
     this.pcqrInfoSource.next(data);
 }

 changeFixedAssetInfoData(data: any) {
     this.fixedAssetInfoSource.next(data);
 }

 changeCloneFixedAssetInfoData(data: any) {
     this.cloneFixedAssetInfoSource.next(data);
 }

 changeFAStatusInfoData(data: string) {
    this.fixedAssetStatusInfoSource.next(data);
}

changeSelectedBranchInfoData(data: string) {
    this.selectedBranchInfoSource.next(data);
}
changeSelectedVendorInfoData(data: string) {
    this.selectedVendorInfoSource.next(data);
}
changeSelectedDepartmentInfoData(data: string) {
    this.selectedDepartmentInfoSource.next(data);
}

 isEmpty(obj): boolean {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
 }
