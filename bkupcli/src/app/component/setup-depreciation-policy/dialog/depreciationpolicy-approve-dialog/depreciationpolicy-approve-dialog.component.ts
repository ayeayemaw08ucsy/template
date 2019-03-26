import { Component, OnInit , Inject, Input} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { DepreciationpolicysetupService } from 'src/app/service/depreciationpolicysetup/depreciationpolicysetup.service';
import { CodeValue } from 'src/app/model/codevalue.model';
import { TnxStatusCode } from 'src/app/model/common.model';

@Component({
  selector: 'app-depreciationpolicy-approve-dialog',
  templateUrl: './depreciationpolicy-approve-dialog.component.html',
  styleUrls: ['./depreciationpolicy-approve-dialog.component.css']
})
export class DepreciationpolicyApproveDialogComponent implements OnInit {

  
  assetTypeSelect : CodeValue[];
  assetSubTypeSelect : CodeValue[];
  depreciationMethodSelect: CodeValue[] = [
    {id:'', codeValue : 'Straight Line', shortDesc:'Straight Line',longDesc:'', businessDate:'', parentType: '',
        codeValUpdateFlag:''
        ,check: false
        ,code:{ codeId: "",
        id: "",
        codeIdDesc: "",
        codeValLen: 0,
        createdDate:"",
        codeValue: "",
        shortDesc:"",
        longDesc:""}},
   {id:'', codeValue : 'Reducing', shortDesc:'Reducing',longDesc:'', businessDate:'', parentType: '',
        codeValUpdateFlag:'',
        check: false,
        code:{ codeId: "",
        id:"",
        codeIdDesc: "",
        codeValLen: 0,
        createdDate:"",
        codeValue: "",
        shortDesc:"",
        longDesc:""}},
  ];
  

  depCollFrequencySelect: CodeValue[];
  tnxStatusCodeSelect: CodeValue[];

  selectedAssetType: string;
  selectedAssestSubType: string;
  selectedDepreciationMethod : string;
  selectedDepCollFrequeny: string;
  selectedTnxStatusCode: string;
  


  constructor(public dialogRef: MatDialogRef<DepreciationpolicyApproveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public dataService: DepreciationpolicysetupService) {
    }

  ngOnInit() {}



formControl = new FormControl('', [
  Validators.required
]);


submit() {
  // emppty stuff
}

onNoClick(): void {
  this.dialogRef.close();
}

confirmApprove(): void {   
 // this.dataService.updateDepPolicyTnxStatusCode(this.data);
 console.log('Enter Approve',this.data);
 this.dataService.approve(this.data, this.dialogRef);
}
}
