import { Injectable } from '@angular/core';
import { MatSnackBarComponent } from 'src/app/component/mat-snack-bar/mat-snack-bar.component';
import { BehaviorSubject, Observable } from 'rxjs';
import { Code } from '../../model/code.model';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ApiService} from '../../core/api.service';
import { CodeValue } from 'src/app/model/codevalue.model';
import { ApiError } from 'src/app/model/apierror.model';
import { Http } from '@angular/http';
import { MatDialogRef } from '@angular/material';
import { CodeAndvalueAddDialogComponent} from '../../component/setup-code-codevalue/dialog/code-andvalue-add-dialog/code-andvalue-add-dialog.component';
import { CodeAndvalueEditDialogComponent } from '../../component/setup-code-codevalue/dialog/code-andvalue-edit-dialog/code-andvalue-edit-dialog.component';
import { MessageService } from '../common/message.service';
import { TnxStatusCode, TnxType, TnxSubType } from 'src/app/model/common.model';
import { CodeAndvalueApproveDialogComponent } from 'src/app/component/setup-code-codevalue/dialog/code-andvalue-approve-dialog/code-andvalue-approve-dialog.component';
import { errormessage } from 'src/environments/errormessage';
const BASE_URL = environment.baseUrl;
const CODE_ADDED=errormessage.added;
const CODE_DELETED=errormessage.deleted;
const CODE_EDITED=errormessage.edited;
const CODE_UPDATED=errormessage.update;

const CODE_APPROVE=errormessage.approved;

@Injectable({
  providedIn: 'root'
})
export class CodesetupService {
  //carray the updated data item from dialog.
  dataChange: BehaviorSubject<CodeValue[]> = new BehaviorSubject<CodeValue[]>([]);
  businessDataChange: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  accessToken : string;

  dialogData: any;
  codeObj : Code;
  codeValObj :CodeValue;
  codeValTnxObj : CodeValue;

 // codeValTnx : CodeValue;
   c: Code;
  constructor(private api: ApiService,private httpClient: HttpClient,private snackBar: MatSnackBarComponent,public messageService: MessageService) { }

  get data(): CodeValue[] {
    return this.dataChange.value;

  }
 
  get businessData(): string[] {
    return this.businessDataChange.value;
  }
   
  getDialogData() : any {
    return this.dialogData;
  }

  /**
   * Get All Code information and bind in businessDataChange For DataTable.
   */
  getAll() : void {
    this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
    this.httpClient.get<CodeValue[]>(`${BASE_URL}/codevalue/values?access_token=${this.accessToken}`).subscribe(data => {
      console.log("Get All Data");
      console.log(data)  ;
     // this.businessDataChange.next(data);
         this.dataChange.next(data);
    }, (error: HttpErrorResponse) => {
      this.snackBar.openSnackBar(error.name , 'close', 'red-snackbar');
    });
  }

  
   /** Get ready Data for Approval */
   getAllCodeValueMst(): void {
    this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
    this.httpClient.get<CodeValue[]>(`${BASE_URL}/codevaluetnx/get-tasks?access_token=${this.accessToken}`)
        .subscribe(data => {
            console.log("Approval Data" , data);
            this.dataChange.next(data);
        },
            (error: ApiError) => {
                this.snackBar.openSnackBar(error.error.message, 'close', 'red-snackbar');
            });
 
}

  //Two way Select Data Binding Calling API of codes information
  getAllCodes(): Observable<Code[]> {
    return this.api.getAllCodes();
  }

  //add codeValue 
  addCodeAndValue(codeVal: any, selectedCode: any , parentTypeSelectedCode: any, dialogRef : MatDialogRef<CodeAndvalueAddDialogComponent>): void {
    this.codeObj = Object.assign({},this.codeObj,{code:{id:selectedCode.id,codeIdDesc:selectedCode.codeIdDesc,codeValLen: selectedCode.codeValLen,createdDate: selectedCode.createdDate}});
    this.codeValObj = Object.assign({},this.codeValObj,{codeValue:codeVal.codeValue,shortDesc:codeVal.shortDesc,longDesc: codeVal.longDesc , codeValUpdateFlag:codeVal.codeValUpdateFlag,parentType: parentTypeSelectedCode.codeValue },this.codeObj);
    this.codeValObj = Object.assign({}, this.codeValObj, {tnxStatusCode: TnxStatusCode.Complete, tnxType: TnxType.New, tnxSubType: TnxSubType.Capture});
    this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
   
    this.httpClient.post<CodeValue>(`${BASE_URL}/codevalue/save?access_token=${this.accessToken}`, this.codeValObj).subscribe(data => {
        this.dialogData = data;
        console.log(CODE_ADDED);
        this.snackBar.openSnackBar(CODE_ADDED, 'Close', 'green-snackbar');
        dialogRef.close();
    },
        (err: HttpErrorResponse) => {
            this.snackBar.openSnackBar(err.name, 'close', 'red-snackbar');
        });

}

/**
   * Asyn Validator for codeValue
   * @param codeValue 
   */
  checkDuplicateCodeValue(codeVal : any,selectedCode: any , parentTypeSelectedCode: any , dialogRef : MatDialogRef<CodeAndvalueAddDialogComponent>) {
    this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
    this.httpClient.get<string>(`${BASE_URL}/codevalue/search/${codeVal.codeValue}/${selectedCode.id}?access_token=${this.accessToken}`).subscribe(data => {
        this.addCodeAndValue(codeVal,selectedCode, parentTypeSelectedCode, dialogRef);
        this.snackBar.openSnackBar(data, 'Close', 'green-snackbar');
      },
      (err: ApiError) => {
       //this.snackBar.openSnackBar(err.error.message, 'close', 'red-snackbar');
       this.messageService.clearErrorMessage();    
       this.messageService.addErrMessage(err.error.message); 
      })
  }


  /**
   * Asyn Validator for codeValue
   * @param codeValue 
   */
  checkUpdateDuplicateCodeValue(codeVal : any,selectedCode: any , parentTypeSelectedCode: any , dialogRef : MatDialogRef<CodeAndvalueAddDialogComponent>) {
    this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
    this.httpClient.get<string>(`${BASE_URL}/codevalue/search/${codeVal.codeValue}/${selectedCode.id}?access_token=${this.accessToken}`).subscribe(data => {
        this.addCodeAndValue(codeVal,selectedCode, parentTypeSelectedCode, dialogRef);
        this.snackBar.openSnackBar(data, 'Close', 'green-snackbar');
      },
      (err: ApiError) => {
       this.snackBar.openSnackBar(err.error.message, 'close', 'red-snackbar');     
      })
  }


  /**
   * Call Update API
   * @param codeVal 
   */
  updateCodeAndValue(codeVal: any ,dialogRef : MatDialogRef<CodeAndvalueEditDialogComponent> ): void {
      this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
      this.httpClient.get<string>(`${BASE_URL}/codevalue/search/${codeVal.codeValue}/${codeVal.code.id}?access_token=${this.accessToken}&tnxSeqId=${codeVal.id}`).subscribe(data => {
      this.httpClient.put<CodeValue>(`${BASE_URL}/codevalue/values/${codeVal.id}?access_token=${this.accessToken}`, codeVal).subscribe(data => {
      this.dialogData = data;
      console.log(CODE_UPDATED);
       this.snackBar.openSnackBar(CODE_UPDATED, 'Close', 'green-snackbar');
       dialogRef.close();
      },
       (err: HttpErrorResponse) => {
            this.snackBar.openSnackBar(err.name, 'close', 'red-snackbar');
        });
        this.snackBar.openSnackBar(data, 'Close', 'green-snackbar');
    },
    (err: ApiError) => {
     //this.snackBar.openSnackBar(err.error.message, 'close', 'red-snackbar');
     this.messageService.clearErrorMessage();
     this.messageService.addErrMessage(err.error.message);     
    })
    
  }

  deleteCodeAndValue(codeValueId: string):void {
    this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
    this.httpClient.delete<CodeValue>(`${BASE_URL}/codevalue/values/${codeValueId}?access_token=${this.accessToken}`).subscribe(data => {
       // this.dialogData = codeVal;
       console.log(CODE_DELETED);
        this.snackBar.openSnackBar(CODE_DELETED, 'Close', 'green-snackbar');
    },
        (err: ApiError) => {
          this.snackBar.openSnackBar(err.error.message, 'close', 'red-snackbar');
        });

  }

  

  /**
   * 
   * Asyn Validator for Duplicate Checking of CodeValue
   * @param codeValParam 
   * @param accessToken 
   */
  checkDuplicateCodeValueSecond(codeValParam : string): Observable<CodeValue[]> {
    return this.api.getAllCodeValues();
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
    * Added the Tnx Table
    * @param codeVal 
    * @param selectedCode 
    * @param parentTypeSelectedCode 
    * @param dialogRef 
    */
  addCodeValueTnx(codeVal : any,selectedCode: any , parentTypeSelectedCode: any , dialogRef : MatDialogRef<CodeAndvalueAddDialogComponent>){
    this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
    this.httpClient.get<String>(`${BASE_URL}/codevalue/search/${codeVal.codeValue}/${selectedCode.id}?access_token=${this.accessToken}`).subscribe(data => {
      
      this.codeValObj = Object.assign({},this.codeValObj,{codeValueMst:new CodeValue()});
      this.codeValTnxObj = Object.assign({},this.codeValTnxObj,{
                                               codeValue:codeVal.codeValue
                                              ,shortDesc:codeVal.shortDesc
                                              ,longDesc: codeVal.longDesc 
                                              , codeValUpdateFlag:codeVal.codeValUpdateFlag
                                              ,parentType: parentTypeSelectedCode.codeValue
                                              ,tnxStatusCode: TnxStatusCode.Complete
                                              ,tnxType: TnxType.New
                                              ,tnxSubType: TnxSubType.Capture
                                              ,code: {id:selectedCode.id, codeIdDesc: selectedCode.codeIdDesc,codeValLen:selectedCode.codeValLen, createdDate:selectedCode.createdDate}});
    
        this.codeValTnxObj = Object.assign({},this.codeValTnxObj,this.codeValObj);
        
        this.httpClient.post<CodeValue>(`${BASE_URL}/codevaluetnx/save?access_token=${this.accessToken}`, this.codeValTnxObj).subscribe(data => {
          this.dialogData = data;
          console.log(CODE_ADDED);
          this.snackBar.openSnackBar(CODE_ADDED, 'Close', 'green-snackbar');
          dialogRef.close();
      },
          (err: HttpErrorResponse) => {
              this.snackBar.openSnackBar(err.name, 'close', 'red-snackbar');
          });
   
    },
    (err: ApiError) => {
      this.messageService.clearErrorMessage();
      this.messageService.addErrMessage(err.error.message);     
     });

  }

  /**
    * Added the Tnx Table
    * @param codeVal 
    * @param selectedCode 
    * @param parentTypeSelectedCode 
    * @param dialogRef 
    */
   updateCodeValueTnx(codeVal : any, dialogRef : MatDialogRef<CodeAndvalueEditDialogComponent>){

    this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
   // this.httpClient.get<String>(`${BASE_URL}/codevalue/search/${codeVal.codeValue}/${codeVal.code.id}?access_token=${this.accessToken}`).subscribe(data => {
      
      this.codeValObj = Object.assign({},this.codeValObj,{codeValueMst:{
                                              id : codeVal.id
                                              , codeValue:codeVal.codeValue
                                              ,shortDesc:codeVal.shortDesc
                                              ,longDesc: codeVal.longDesc 
                                              , codeValUpdateFlag:codeVal.codeValUpdateFlag
                                              ,parentType: codeVal.parentType
                                              ,tnxStatusCode: TnxStatusCode.Complete
                                              ,tnxType: TnxType.Update
                                              ,tnxSubType: TnxSubType.InfoUpdate
                                              ,code: codeVal.code
                                          }});
      this.codeValTnxObj = Object.assign({},this.codeValTnxObj,{
                                              id : codeVal.id
                                              , codeValue:codeVal.codeValue
                                              ,shortDesc:codeVal.shortDesc
                                              ,longDesc: codeVal.longDesc 
                                              , codeValUpdateFlag:codeVal.codeValUpdateFlag
                                              ,parentType: codeVal.parentType
                                              ,tnxStatusCode: TnxStatusCode.Complete
                                              ,tnxType: TnxType.Update
                                              ,tnxSubType: TnxSubType.InfoUpdate
                                              ,code: codeVal.code
                                              });

        this.codeValTnxObj = Object.assign({},this.codeValTnxObj,this.codeValObj);

        this.httpClient.post<CodeValue>(`${BASE_URL}/codevaluetnx/save?access_token=${this.accessToken}`, this.codeValTnxObj).subscribe(data => {
        this.dialogData = data;
        console.log(CODE_EDITED);
        this.snackBar.openSnackBar(CODE_EDITED, 'Close', 'green-snackbar');
        dialogRef.close();
        },
       (err: ApiError) => {
          this.messageService.clearErrorMessage();
          this.messageService.addErrMessage(err.error.message);  
        });
        
  }
  
  /**
   * 
   * @param codeValue 
   */
  approve(codeVal : any ,dialogRef : MatDialogRef<CodeAndvalueApproveDialogComponent>): void {
    
    let tnxSeqId;

    if(codeVal.codeValeMst) {
      this.codeValObj = Object.assign({},this.codeValObj,{codeValueMst:codeVal.codeValeMst});
      tnxSeqId = codeVal.codeValeMst.id;  
    }else{
      this.codeValObj = Object.assign({},this.codeValObj,{codeValueMst:new CodeValue()});
    }
    this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
   
    this.codeValTnxObj = Object.assign({},this.codeValTnxObj,{
                                           codeValue:codeVal.codeValue
                                          ,shortDesc:codeVal.shortDesc
                                          ,longDesc: codeVal.longDesc 
                                          , codeValUpdateFlag:codeVal.codeValUpdateFlag
                                          ,parentType: codeVal.parentType
                                          ,tnxStatusCode: TnxStatusCode.Approved
                                          ,tnxType: TnxType.Update
                                          ,tnxSubType: TnxSubType.InfoUpdate 
                                          , taskId: codeVal.taskId
                                          , codeValueTnxSeqId: codeVal.codeValueTnxSeqId
                                          , code: codeVal.code});

    this.codeValTnxObj = Object.assign({},this.codeValTnxObj,this.codeValObj);
    let CALL_URL = tnxSeqId ?  `${BASE_URL}/codevalue/search/${codeVal.codeValue}/${codeVal.code.id}?tnxSeqId=${tnxSeqId}&access_token=${this.accessToken}`
                             : `${BASE_URL}/codevalue/search/${codeVal.codeValue}/${codeVal.code.id}?access_token=${this.accessToken}`;
    
    this.httpClient.get<String>(CALL_URL).subscribe(data => {
    this.httpClient.post<CodeValue>(`${BASE_URL}/codevaluetnx/approve?access_token=${this.accessToken}`, this.codeValTnxObj)
        .subscribe(data => {
            this.dialogData = data;
            console.log(CODE_APPROVE);
            this.snackBar.openSnackBar(CODE_APPROVE, 'Close', 'green-snackbar');
            dialogRef.close();
        },
            (err: ApiError) => {
                this.snackBar.openSnackBar(err.error.message, 'close', 'red-snackbar');
            });
    },
    (err: ApiError) => {
      this.messageService.clearErrorMessage();
      this.messageService.addErrMessage(err.error.message);     
     });


    
  }
 
}
