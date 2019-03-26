import { Component, OnInit , Inject, Input} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { DepreciationpolicysetupService } from 'src/app/service/depreciationpolicysetup/depreciationpolicysetup.service';
import { CodeValue } from 'src/app/model/codevalue.model';
import { TnxStatusCode, TnxType, TnxSubType } from 'src/app/model/common.model';

@Component({
  selector: 'app-depreciationpolicy-edit-dialog',
  templateUrl: './depreciationpolicy-edit-dialog.component.html',
  styleUrls: ['./depreciationpolicy-edit-dialog.component.css']
})
export class DepreciationpolicyEditDialogComponent implements OnInit {
   

  assetTypeSelect : CodeValue[];
  assetSubTypeSelect : CodeValue[];
  depreciationMethodSelect: CodeValue[] = [
    {id:'', codeValue : 'Straight Line', shortDesc:'Straight Line',longDesc:'', businessDate:'', parentType:'',
        codeValUpdateFlag:'',
        check: false,
        code:{ codeId: "",
        codeIdDesc: "",
        codeValLen: 0,
        createdDate:"",
        codeValue: "",
        shortDesc:"",
        longDesc:"",
        id:""}},
   {id:'', codeValue : 'Reducing', shortDesc:'Reducing',longDesc:'', businessDate:'', parentType: '',
        codeValUpdateFlag: '',
        check: false,
        code:{ codeId: "",
        codeIdDesc: "",
        codeValLen: 0,
        createdDate:"",
        codeValue: "",
        shortDesc:"",
        longDesc:"",
        id:""}},
  ];
  

  depCollFrequencySelect: CodeValue[];
  tnxStatusCodeSelect: CodeValue[];

  selectedAssetType: string;
  selectedAssestSubType: string;
  selectedDepreciationMethod : string;
  selectedDepCollFrequeny: string;
  selectedTnxStatusCode: string;
  


  constructor(public dialogRef: MatDialogRef<DepreciationpolicyEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public dataService: DepreciationpolicysetupService) {
      console.log("Enter Constructor of Depreicaiton Policy ", data.assetType); 
     this.selectedAssetType = data.assetType;
     this.selectedAssestSubType = data.assetSubType;
     this.selectedDepCollFrequeny = data.depCollFrequency;
     this.selectedDepreciationMethod = data.depMethod;
     
    }

  ngOnInit() {
 
    this.getAssestTypeList();
    this.getAssetSubTypeList();
    this.getDepreciationColFrequencyList();
    this.getTransactionStatusCodeList();
}


formControl = new FormControl('', [
  Validators.required
]);

getErrorMessage(msg: string) {
  return this.formControl.hasError('required') ? 'Required ' + msg :
      this.formControl.hasError('email') ? 'Not a valid email' :'';
}

submit() {
  // emppty stuff
}

onNoClick(): void {
  this.dialogRef.close();
}

stopEdit(): void {
    console.log('Edit Data',this.data);
    this.dataService.updateDepPolicyTnx(this.selectedAssetType,this.selectedAssestSubType,this.selectedDepreciationMethod,
                                         this.selectedDepCollFrequeny,TnxStatusCode.Complete,TnxType.Update,TnxSubType.InfoUpdate, this.data);
   // this.dataService.update(this.selectedAssetType,this.selectedAssestSubType,this.selectedDepreciationMethod
     //                        ,this.selectedDepCollFrequeny,TnxStatusCode.Complete,this.data);
}

/**
   * 
   */
  getAssestTypeList() : void {
    this.dataService.getSelectBindingCodeValue("052").subscribe(d => {
      this.assetTypeSelect = d;
    });
  }

  getAssetSubTypeList(): void {
   
    this.dataService.getSelectBindingCodeValue("053").subscribe(data => {
      this.assetSubTypeSelect = data;
    })
  }

  getDepreciationColFrequencyList() : void {
   
    this.dataService.getSelectBindingCodeValue("405").subscribe(data => {
    this.depCollFrequencySelect = data;
    })
  }
   
  getTransactionStatusCodeList(): void {
    
    this.dataService.getSelectBindingCodeValue("402").subscribe(data => {
      this.tnxStatusCodeSelect = data;
    })
  }

  assetTypeChangeAction(code) {
    console.log("Drop Down On Change Selection"+code);
 }

 assetSubTypeChangeAction(code) {
  console.log("Asset SubType Select Change" , code);
}

 depCollFrequencyChangeAction(code) {
   console.log("Depreciation Collection Frequency Select Change" , code);
 }

 depreciationMethodChangeAction(code) {
  console.log("Depreciation Method Select Change" , code);
}

}
