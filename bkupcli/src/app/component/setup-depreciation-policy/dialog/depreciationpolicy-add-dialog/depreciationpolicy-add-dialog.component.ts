import { Component, OnInit ,Inject} from '@angular/core';
import { Code } from '../../../../model/code.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { DepreciationPolicyTnx } from 'src/app/model/depreciationpolicytnx.model';
import { DepreciationpolicysetupService } from 'src/app/service/depreciationpolicysetup/depreciationpolicysetup.service';
import { CodeValue } from 'src/app/model/codevalue.model';
import { element } from '@angular/core/src/render3/instructions';
import { TnxStatusCode } from 'src/app/model/common.model';
import { TnxType} from 'src/app/model/common.model';
import { TnxSubType } from 'src/app/model/common.model';

export interface AssestType {
  id: string;
  codeValue: string;
}

export interface AssetSubType {
  id: string;
  codeValue:string;
}
export interface DepreciationMethod {
  id: string;
  codeValue: string;
}

export interface DepreciationColFrequency {
  id: string;
  codeValue: string;
}
@Component({
  selector: 'app-depreciationpolicy-add-dialog',
  templateUrl: './depreciationpolicy-add-dialog.component.html',
  styleUrls: ['./depreciationpolicy-add-dialog.component.css']
})
export class DepreciationpolicyAddDialogComponent implements OnInit {

  assetTypeSelect : CodeValue[];
  assetSubTypeSelect : CodeValue[];
  filterAssetSubType : CodeValue[];

  depreciationMethodSelect: CodeValue[] = [
    {id:'', codeValue : 'Straight Line', shortDesc:'Straight Line',longDesc:'', businessDate:'',parentType: '',
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
   {id:'', codeValue : 'Reducing', shortDesc:'Reducing',longDesc:'', businessDate:'', parentType: '',
        codeValUpdateFlag: '',
        check: false,
        code:{ codeId: "",
        id:"",
        codeIdDesc: "",
        codeValLen: 0,
        createdDate:"",
        codeValue: "",
        shortDesc:"",
        longDesc:""
      }},
  ];
  
  depCollFrequencySelect: CodeValue[];
  tnxStatusCodeSelect: CodeValue[];
  tnxTypeCodeSelect: CodeValue[];

  selectedAssetType: string;
  selectedAssestSubType: string;
  selectedDepreciationMethod : string;
  selectedDepCollFrequeny: string;

  formControl  = new FormControl('',[Validators.required]);

  constructor(public addDiaglog: MatDialogRef<DepreciationpolicyAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA)public data: DepreciationPolicyTnx,
    public dataService: DepreciationpolicysetupService) { }

  ngOnInit() {
    this.getAssestTypeList();
    this.getAssetSubTypeList();
    this.getDepreciationColFrequencyList();
    this.getTransactionStatusCodeList();
  }

  
   
  getErrorMessage(msg: string) {
    return this.formControl.hasError('required') ? 'Required '+ msg :'';
       
  }

  submit() {

  }

  onNoClick():void {
    this.addDiaglog.close();
  }

  public confirmAdd(): void {
      this.dataService.addDepPolicyTnx(this.selectedAssetType,this.selectedAssestSubType,this.selectedDepreciationMethod
                                      ,this.selectedDepCollFrequeny,TnxStatusCode.Complete,TnxType.New,TnxSubType.Capture,this.data);
  }

 
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

  getTransactionTypeCodeList(): void {
    this.dataService.getSelectBindingCodeValue("403").subscribe(data => {
      this.tnxTypeCodeSelect = data;
    })
  }

  assetTypeChangeAction($event) {
 
    this.filterAssetSubType = this.assetSubTypeSelect.filter(val => 
      val.parentType === $event.value.codeValue
   );
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
