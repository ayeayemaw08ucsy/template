import { Injectable } from '@angular/core';
import { DepreciationPolicyTnx } from 'src/app/model/depreciationpolicytnx.model';
import { BehaviorSubject, Observable ,forkJoin } from 'rxjs';
import {ApiService} from '../../core/api.service';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import { MatSnackBarComponent } from 'src/app/component/mat-snack-bar/mat-snack-bar.component';
import { CodeValue } from 'src/app/model/codevalue.model';
import { Code } from 'src/app/model/code.model';
import { DepreciationPolicy } from 'src/app/model/depreciationpolicy.model';
import { TnxStatusCode, TnxType, TnxSubType } from 'src/app/model/common.model';
import { ApiError } from 'src/app/model/apierror.model';
import { errormessage } from 'src/environments/errormessage';
import { map } from 'rxjs/operators';
import { MessageService } from '../common/message.service';
import { DepreciationpolicyApproveDialogComponent } from 'src/app/component/setup-depreciation-policy/dialog/depreciationpolicy-approve-dialog/depreciationpolicy-approve-dialog.component';
import { MatDialogRef } from '@angular/material';


const BASE_URL = environment.baseUrl;
const ENTITY = environment.entity;
const DEP_UPDATE=errormessage.update;
const DEP_APPROVE=errormessage.approved;
const DEP_DELETE=errormessage.deleted;
const DEP_EDIT=errormessage.edited;
const DEP_ADD=errormessage.added;
const NOTI_REQ_FINISHED=errormessage.notificationrequest; 
@Injectable({
  providedIn: 'root'
})
export class DepreciationpolicysetupService {
  
  //carray the updated data item from dialog.
   dataChange: BehaviorSubject<DepreciationPolicyTnx[]> = new BehaviorSubject<DepreciationPolicyTnx[]>([]);
   businessDataChange: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
   
   accessToken : string;

   dialogData: any;
   depPolicyTnxObj : DepreciationPolicy;
   depPolicyObj : DepreciationPolicy;
   codeValueMst : CodeValue[];
   
   //codeValObj :CodeValue;

   constructor(private api: ApiService,private httpClient: HttpClient,private snackBar: MatSnackBarComponent, public messageService?: MessageService) { }
   
   get data(): DepreciationPolicyTnx[] {
    return this.dataChange.value;

  }

  get businessData(): string[] {
    return this.businessDataChange.value;
  }

  getDialogData() : any {
    return this.dialogData;
  }

  
  //Two way Select Data Binding Calling API of codes information
  // getAllPolicies: Observable<DepreciationPolicy[]> {
  //   //return this.api.getAllCodes();
  //   return ;
  // }
  
  /**
   * 
   */
  getDepreciationPolicyData():Observable<DepreciationPolicyTnx[]> {
    this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
    return   this.httpClient.get<DepreciationPolicyTnx[]>(`${BASE_URL}/deppolicytnx/policies?access_token=${this.accessToken}`)
        
  }
  
  /**
   * 
   */
  getAllCodeValuesData(): Observable<CodeValue[]> {
    return this.api.getAllCodeValues();
  }
  
  getAllCodeValues() : void {
    this.api.getAllCodeValues().subscribe(val => {
        console.log("Code Value Master Data" , val);
        this.codeValueMst = val;
      })
}
  
/**
   * Get All Code information and bind in businessDataChange For DataTable.
   */
  getAll() : void {
      
      this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
      
//    this.httpClient.get<DepreciationPolicyTnx[]>(`${BASE_URL}/deppolicytnx/policies?access_token=${this.accessToken}`).subscribe(data => {
  
      const returnValueArray = forkJoin(
        this.httpClient.get<CodeValue[]>(`${BASE_URL}/codevalue/values?access_token=${this.accessToken}`),
        this.httpClient.get<DepreciationPolicyTnx[]>(`${BASE_URL}/deppolicytnx/policies?access_token=${this.accessToken}`)
      )
     
      returnValueArray.subscribe(latestValues => {
        const[codeValueData, dataValue] = latestValues;
        let transformData = dataValue.map((obj) => {
                  
                 let assetTypeDescription  = codeValueData.find((ele) =>
                    ele.codeValue === obj.assetType
                  );
    
                  let assetSubTypeDescription  = codeValueData.find((ele) =>
                    ele.codeValue === obj.assetSubType 
                  );
                  obj.assetTypeCodeValueDesc = assetTypeDescription.shortDesc;
                  obj.assetSubTypeCodeValueDesc = assetSubTypeDescription.shortDesc;
                  return obj;
          })
          this.dataChange.next(transformData);
      },
      (error: HttpErrorResponse) => {
          this.snackBar.openSnackBar(error.name , 'close', 'red-snackbar');
        });

      // this.httpClient.get<DepreciationPolicyTnx[]>(`${BASE_URL}/deppolicy/policy?access_token=${this.accessToken}`).subscribe(data => {
      
      // let transformData = data.map((obj) => {
                  
      //        let assetTypeDescription  = this.codeValueMst.find((ele) =>
      //           ele.codeValue === obj.assetType
      //         );

      //         let assetSubTypeDescription  = this.codeValueMst.find((ele) =>
      //           ele.codeValue === obj.assetSubType 
      //         );
      //         obj.assetTypeCodeValueDesc = assetTypeDescription.shortDesc;
      //         obj.assetSubTypeCodeValueDesc = assetSubTypeDescription.shortDesc;
      //           return obj;
      // })
      //console.log("###############", this.data);
      //console.log("###############", transformData);
      //this.dataChange.next(transformData);
    //}
    //, (error: HttpErrorResponse) => {
    //  this.snackBar.openSnackBar(error.name , 'close', 'red-snackbar');
    //});
  }

   //add codeValue 
   addDepPolicyTnx(selectedAssetType: any,selectedAssetSubType: any, selectedMethod:any,selectedFrequency: any,tnxStatusCode: any,tnxType: any,tnxSubType: any,policyTnx: DepreciationPolicyTnx): void {
    this.depPolicyObj = Object.assign({},this.depPolicyObj,{depreciation: new DepreciationPolicy()}); 
   this.depPolicyTnxObj = Object.assign({},this.depPolicyTnxObj,{
                                             assetType: selectedAssetType.codeValue,assetSubType: selectedAssetSubType.codeValue
                                            ,depMethod: selectedMethod.codeValue,depRate: policyTnx.depRate
                                            ,depCollFrequency: selectedFrequency.codeValue , depUsefulLife: policyTnx.depUsefulLife 
                                            ,tnxStatusCode: tnxStatusCode
                                            ,tnxType:tnxType
                                            ,tnxSubType:tnxSubType
                                            ,entity : ENTITY});
   this.depPolicyTnxObj = Object.assign({},this.depPolicyTnxObj,this.depPolicyObj);
   this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
   this.httpClient.post<DepreciationPolicyTnx>(`${BASE_URL}/deppolicytnx/save?access_token=${this.accessToken}`,this.depPolicyTnxObj ).subscribe((data) => {
     //this.dialogData = data;
      console.log(data);
      this.snackBar.openSnackBar(DEP_ADD, 'Close', 'green-snackbar');
   },
       (err: HttpErrorResponse) => {
           this.snackBar.openSnackBar(err.name, 'close', 'red-snackbar');
       });

}

 /**
  * Call Update API
  * @param codeVal 
  */
 
  updateDepPolicyTnx(selectedAssetType: any, selectedAssetSubType: any , selectedMethod: any, selectedFrequency: any,tnxStatusCode: any,tnxType:any , tnxSubType: any,depPolicyTnx : any): void {
   let depPolicyTnxSeqId = depPolicyTnx.id;
   this.depPolicyObj = Object.assign({},this.depPolicyObj,{depreciation: {
                                                  depPolicySeqId: depPolicyTnx.depPolicySeqId
                                                  ,assetType: depPolicyTnx.assetType
                                                  ,assetSubType: depPolicyTnx.assetSubType
                                                  ,depMethod: depPolicyTnx.depMethod
                                                  ,depRate: depPolicyTnx.depRate
                                                  ,depUsefulLife: depPolicyTnx.depUsefulLife
                                                  ,entity : ENTITY
                                                  ,depCollFrequency: depPolicyTnx.codeValue 
                                                  ,tnxStatusCode: TnxStatusCode.Complete
                                                  ,tnxType: TnxType.Update
                                                  ,tnxSubType: TnxSubType.InfoUpdate                              
                                                }
                                              }); 
  this.depPolicyTnxObj = Object.assign({},this.depPolicyTnxObj,{
                                            assetType: depPolicyTnx.assetType,assetSubType: depPolicyTnx.assetSubType
                                           ,depMethod: depPolicyTnx.depMethod,depRate: depPolicyTnx.depRate
                                           ,depCollFrequency: depPolicyTnx.depCollFrequency , depUsefulLife: depPolicyTnx.depUsefulLife 
                                           ,tnxStatusCode: tnxStatusCode
                                           ,tnxType:tnxType
                                           ,tnxSubType:tnxSubType
                                           ,entity : ENTITY});
   this.depPolicyTnxObj = Object.assign({},this.depPolicyTnxObj,this.depPolicyObj);
   console.log('$$$$$$$$$$$$$',this.depPolicyTnxObj);
   this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
   
   this.httpClient.post<DepreciationPolicyTnx>(`${BASE_URL}/deppolicytnx/save?access_token=${this.accessToken}`, this.depPolicyTnxObj).subscribe(data => {
      //  console.log(DEP_UPDATE);
      //  this.snackBar.openSnackBar(DEP_UPDATE, 'Close', 'green-snackbar');
       this.dialogData = data;
       this.snackBar.openSnackBar(DEP_EDIT, 'Close', 'green-snackbar');
   },
       (err: HttpErrorResponse) => {
       });

 }

 /**
  * Update the depreciation policy and policy tnx .
  * edit approved status of data  from depreciation policy.
  * @param selectedAssetType 
  * @param selectedAssetSubType 
  * @param selectedMethod 
  * @param selectedFrequency 
  * @param tnxStatusCode 
  * @param depPolicyTnx 
  */
 update(selectedAssetType: any, selectedAssetSubType: any , selectedMethod: any, selectedFrequency: any,tnxStatusCode: any,depPolicy : DepreciationPolicy): void {
  this.depPolicyObj = Object.assign({},this.depPolicyObj,{depreciation: {
                                                                          depPolicySeqId : depPolicy.depPolicySeqId
                                                                         , assetType: selectedAssetType
                                                                         ,assetSubType: selectedAssetSubType
                                                                         ,depMethod: selectedMethod
                                                                         ,depRate: depPolicy.depRate
                                                                         ,depCollFrequency: selectedFrequency
                                                                         , depUsefulLife: depPolicy.depUsefulLife 
                                                                         ,entity : ENTITY}}); 

  this.depPolicyTnxObj = Object.assign({},this.depPolicyTnxObj,{
                                            assetType: selectedAssetType,assetSubType: selectedAssetSubType
                                           ,depMethod: selectedMethod,depRate: depPolicy.depRate
                                           ,depCollFrequency: selectedFrequency, depUsefulLife: depPolicy.depUsefulLife 
                                           , tnxStatusCode: tnxStatusCode,entity : ENTITY});
  this.depPolicyTnxObj = Object.assign({},this.depPolicyTnxObj,this.depPolicyObj);
    
  this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
  this.httpClient.put<DepreciationPolicyTnx>(`${BASE_URL}/deppolicytnx/policies?access_token=${this.accessToken}`, this.depPolicyTnxObj).subscribe(data => {
      this.dialogData = data;
      console.log(DEP_UPDATE);
      this.snackBar.openSnackBar(DEP_UPDATE, 'Close', 'green-snackbar');
  },
      (err: HttpErrorResponse) => {
          this.snackBar.openSnackBar(err.name, 'close', 'red-snackbar');
      });

}

updateDepPolicyTnxStatusCode(deppolicytnx: any) {
  this.depPolicyObj = Object.assign({},this.depPolicyObj,{depreciation: new DepreciationPolicy()}); 
  this.depPolicyTnxObj = Object.assign({},this.depPolicyTnxObj,{
                                            depPloicyTnxSeqId: deppolicytnx.id
                                           ,assetType: deppolicytnx.assetType,assetSubType: deppolicytnx.assetSubType
                                           ,depMethod: deppolicytnx.depMethod,depRate: deppolicytnx.depRate
                                           ,depCollFrequency: deppolicytnx.depCollFrequency , depUsefulLife: deppolicytnx.depUsefulLife 
                                           , tnxStatusCode: TnxStatusCode.Approved,tnxType: TnxType.Update,tnxSubType: TnxSubType.InfoUpdate ,entity : ENTITY});

  this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
  this.httpClient.post<DepreciationPolicyTnx>(`${BASE_URL}/deppolicytnx/save?access_token=${this.accessToken}`,this.depPolicyTnxObj ).subscribe(data => {
    this.dialogData = data;
    console.log(DEP_APPROVE);
    this.snackBar.openSnackBar(DEP_APPROVE, 'Close', 'green-snackbar');
  },
    (err: HttpErrorResponse) => {
        this.snackBar.openSnackBar(err.name, 'close', 'red-snackbar');
    });
 }

 deleteDepreciationPolicyTnx(deptnxSeqId: string):void {
   this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
   this.httpClient.delete<DepreciationPolicyTnx>(`${BASE_URL}/deppolicytnx/policies/${deptnxSeqId}?access_token=${this.accessToken}`).subscribe(data => {
      // this.dialogData = codeVal;
      console.log(DEP_DELETE);
       this.snackBar.openSnackBar(DEP_DELETE, 'Close', 'green-snackbar');
   },
       (err: HttpErrorResponse) => {
           this.snackBar.openSnackBar(err.name, 'close', 'red-snackbar');
       });

 }

 /**
  * Get Select Binding Component Data .
  * filter by codeId 
  * @param codeId 
  */
 getSelectBindingCodeValue(codeId: string): Observable<CodeValue[]>{
  return this.api.getCodeValuesById(codeId);
  } 

     /**
   * Get All Code information and bind in businessDataChange For DataTable.
   */
  getAllStatusCompleted(tnxStatusCode : string) : void {
    this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
    this.httpClient.get<DepreciationPolicyTnx[]>(`${BASE_URL}/deppolicytnx/status/${tnxStatusCode}?access_token=${this.accessToken}`).subscribe(data => {
      console.log("Depreciation GET ALL STATUS COMPLETED" , data);
      //this.businessDataChange.next(data);
      this.dataChange.next(data);
    }, (error: HttpErrorResponse) => {
      this.snackBar.openSnackBar(error.name , 'close', 'red-snackbar');
    });
  }

  getAllDepPolicyMst(): void {
    this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
    const returnValueArray = forkJoin(
      this.httpClient.get<CodeValue[]>(`${BASE_URL}/codevalue/values?access_token=${this.accessToken}`),
      this.httpClient.get<DepreciationPolicyTnx[]>(`${BASE_URL}/deppolicytnx/get-tasks?access_token=${this.accessToken}`)
    )
   
    returnValueArray.subscribe(latestValues => {
      const[codeValueData, dataValue] = latestValues;
      let transformData = dataValue.map((obj) => {
                
               let assetTypeDescription  = codeValueData.find((ele) =>
                  ele.codeValue === obj.assetType
                );
  
                let assetSubTypeDescription  = codeValueData.find((ele) =>
                  ele.codeValue === obj.assetSubType 
                );
                obj.assetTypeCodeValueDesc = assetTypeDescription.shortDesc;
                obj.assetSubTypeCodeValueDesc = assetSubTypeDescription.shortDesc;
                return obj;
        })
        this.dataChange.next(transformData);
    // this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
    // this.httpClient.get<DepreciationPolicyTnx[]>(`${BASE_URL}/deppolicytnx/get-tasks?access_token=${this.accessToken}`)
    //     .subscribe(data => {
    //         console.log("Approval Data" , data);
    //         let transformData = data.map((obj) => {
                  
    //           let assetTypeDescription  = this.codeValueMst.find((ele) =>
    //              ele.codeValue === obj.assetType
    //            );
 
    //            let assetSubTypeDescription  = this.codeValueMst.find((ele) =>
    //              ele.codeValue === obj.assetSubType 
    //            );
    //            obj.assetTypeCodeValueDesc = assetTypeDescription.shortDesc;
    //            obj.assetSubTypeCodeValueDesc = assetSubTypeDescription.shortDesc;
    //              return obj;
    //        })
    //       //  this.dataChange.next(data);
    //       this.dataChange.next(transformData);
        },
            (error: ApiError) => {
                this.snackBar.openSnackBar(error.error.message, 'close', 'red-snackbar');
            });
 
}

/**
 * 
 * @param depPolicyTnx 
 * @param dialogRef 
 */
approve(depPolicyTnx: any, dialogRef : MatDialogRef<DepreciationpolicyApproveDialogComponent>) {
   
     if(depPolicyTnx.depreciation) {
        this.depPolicyObj = Object.assign({},this.depPolicyObj,{depreciation:depPolicyTnx.depreciation});
      }else{
        this.depPolicyObj = Object.assign({},this.depPolicyObj,{depreciation:new DepreciationPolicy()});
      }
      this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
      this.depPolicyTnxObj = Object.assign({},this.depPolicyTnxObj,{
                                             depPloicyTnxSeqId: depPolicyTnx.id        
                                            , assetType: depPolicyTnx.assetType
                                            ,assetSubType: depPolicyTnx.assetSubType
                                            ,depMethod: depPolicyTnx.depMethod
                                            ,depRate: depPolicyTnx.depRate
                                            ,depCollFrequency: depPolicyTnx.depCollFrequency 
                                            , depUsefulLife: depPolicyTnx.depUsefulLife 
                                            ,tnxStatusCode: TnxStatusCode.Approved
                                            ,tnxType:TnxType.Update
                                            ,tnxSubType:TnxSubType.InfoUpdate
                                            ,taskId: depPolicyTnx.taskId
                                            ,entity : ENTITY});  
      this.depPolicyTnxObj = Object.assign({},this.depPolicyTnxObj,this.depPolicyObj);

      this.httpClient.get<String>(`${BASE_URL}/deppolicy/duplicate/{assetType}/{assetSubType}?access_token=${this.accessToken}`,).subscribe(d => {
      this.httpClient.post<DepreciationPolicyTnx>(`${BASE_URL}/deppolicytnx/approve?access_token=${this.accessToken}`, this.depPolicyTnxObj)
      .subscribe(data => {

          this.dialogData = data;
          this.snackBar.openSnackBar(DEP_APPROVE, 'Close', 'green-snackbar');
          dialogRef.close();
        },
         (err: ApiError) => {
         
           this.snackBar.openSnackBar(err.error.message, 'close', 'red-snackbar');
          
          }
        )
      },
      (err: ApiError) => {
        this.messageService.clearErrorMessage();
        this.messageService.addErrMessage(err.error.message);     
       });

      // this.httpClient.post<CodeValue>(`${BASE_URL}/deppolicytnx/approve?access_token=${this.accessToken}`, this.depPolicyTnxObj)
      //     .subscribe(data => {
      //         this.dialogData = data;
      //         console.log(DEP_APPROVE);
      //         this.snackBar.openSnackBar(DEP_APPROVE, 'Close', 'green-snackbar');
      //     },
      //     (err: HttpErrorResponse) => {
      //       this.snackBar.openSnackBar(err.name, 'close', 'red-snackbar');
      //   });
    }

    
}
