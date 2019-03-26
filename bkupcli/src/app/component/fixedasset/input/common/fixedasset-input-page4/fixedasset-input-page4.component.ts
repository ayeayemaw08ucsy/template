import { Component, OnInit , Output , EventEmitter } from '@angular/core';
import { ActivatedRoute ,Router, NavigationExtras } from '@angular/router';
import { FixedassetService } from '../../../../../service/fixedasset/fixedasset.service';
import { FixedAssetAdditionalInfo } from 'src/app/model/fixedassetadditionalinfo.model';
import { PictureAndQRInfo } from 'src/app/model/pictureandqrinfo.model';
import { FixedAsset } from 'src/app/model/fixedasset.model';
import { FormControl, Validators } from '@angular/forms';
import { CodeValue } from 'src/app/model/codevalue.model';
import {MatRadioModule } from '@angular/material/radio';
import { FixedAssetTnx } from 'src/app/model/fixedassettnx.model';
import { Menu } from 'src/app/model/menu';
import { Vendor } from 'src/app/model/vendor.model';
import { MessageService } from 'src/app/service/common/message.service';

@Component({
  selector: 'app-fixedasset-input-page4',
  templateUrl: './fixedasset-input-page4.component.html',
  styleUrls: ['./fixedasset-input-page4.component.css'],

})
export class FixedassetInputPage4Component implements OnInit {

  addlInfoMst: FixedAssetAdditionalInfo;
  pcQRInfoMst: PictureAndQRInfo;
  fixedAssetMst: FixedAsset;
  selectedInsurance: string;
  selectedTax: string;
  selectedWarranty: string;
  selectedFinancing: string;
  selectedSupport: string;
  vendorLst: Vendor[];
  isDisabledField: boolean;
  dataTnx : any;
  fixedAssetTnx : FixedAssetTnx;
  cloneFixedAssetMst : FixedAsset;
  fixedAssetStatus :string;

  register: boolean;
  draft: boolean;
  amend: boolean;
  amendApprove: boolean;
  
  menuModuleName : string;
  subMenuModuleName: string;

  isUpdateField : string;
  isAmendField : string;
  isDisposeField : string;

  selectedBranch: string;
  selectedVendor: string;
  selectedDepartment: string;
  financeFrom: Date;
  financeTo: Date;
  insurFrom: Date;
  insuranceTo: Date;
  supportFrom: Date;
  supportTo: Date;
  warrantyFrom: Date;
  warrantyTo: Date;

  @Output()  nextEvent  = new EventEmitter<any>();
  formControl = new FormControl('', [
    Validators.required
  ]);

  constructor(private fixedAssetService: FixedassetService, public router: Router, private messageService: MessageService,
    private route: ActivatedRoute) { 

    this.menuModuleName = this.route.snapshot.paramMap.get('name');
    this.subMenuModuleName = this.route.snapshot.paramMap.get('subname');

     console.log("In page 4",this.menuModuleName);
    if(this.menuModuleName === 'Updated')
    {
      this.isUpdateField = "false";
      this.isAmendField = "true";
      this.isDisposeField = "true";
    }
    if(this.menuModuleName === 'Dispose')
    {
      this.isUpdateField = "true";
      this.isAmendField = "true";
      this.isDisposeField = "false";
    }
    if((this.menuModuleName === Menu.update || this.menuModuleName === Menu.dispose) 
              && this.subMenuModuleName === Menu.Approve){
                this.isUpdateField = "true";
                this.isAmendField = "true";
                this.isDisposeField = "true";
              }
    this.clearMessage();
  }

  ngOnInit() {
    this.clearMessage();
    this.fixedAssetService.currentSelectedBranchInfoSource.subscribe(selBranch => this.selectedBranch = selBranch);
    this.fixedAssetService.currentSelectedVendorInfoSource.subscribe(selVen => this.selectedVendor = selVen);
    this.fixedAssetService.currentSelectedDeparmentInfoSource.subscribe(selDep => this.selectedDepartment = selDep);

    this.fixedAssetService.currentAddlInfoSource.subscribe(addlInfo => this.addlInfoMst = addlInfo);
    this.fixedAssetService.currentPcqrInfoSource.subscribe(pcQRInfoMst => this.pcQRInfoMst = pcQRInfoMst);
    this.fixedAssetService.currentFixedAssetInfoSource.subscribe(fixedAssetInfo => this.fixedAssetMst = fixedAssetInfo);
    this.fixedAssetService.currentCloneFixedAssetInfoSource.subscribe(cloneFixedAssetInfo => this.cloneFixedAssetMst = cloneFixedAssetInfo);
    this.fixedAssetService.currentFAStatus.subscribe(st =>this.fixedAssetStatus = st);
    
    this.isDisabledField = true;
    this.getVendorList();
    this.register = this.fixedAssetMst.register;
    this.draft = this.fixedAssetMst.draft;
    this.amend = this.fixedAssetMst.amend;
    this.amendApprove = this.fixedAssetMst.amendApprove;
    this.fixedAssetMst.addlInfo = this.addlInfoMst;
    this.fixedAssetMst.imgInfo = this.pcQRInfoMst;
    this.selectedInsurance = this.addlInfoMst.insuranceCode;
    this.selectedTax = this.addlInfoMst.taxCode;
    this.selectedWarranty = this.addlInfoMst.warrantyCode;
    this.selectedFinancing = this.addlInfoMst.financeCode;
    this.selectedSupport = this.addlInfoMst.supportCode;
    if (this.addlInfoMst.financeFrom !== null) {
      this.financeFrom = new Date(this.addlInfoMst.financeFrom);
    }
    if (this.addlInfoMst.financeTo !== null) {
      this.financeTo = new Date(this.addlInfoMst.financeTo);
    }
    if (this.addlInfoMst.supportFrom !== null) {
      this.supportFrom = new Date(this.addlInfoMst.supportFrom);
    }
    if (this.addlInfoMst.supportTo !== null) {
      this.supportTo = new Date(this.addlInfoMst.supportTo);
    }
    if (this.addlInfoMst.insuranceFrom !== null) {
      console.log('not null from ', this.addlInfoMst.insuranceFrom);
      this.insurFrom = new Date(this.addlInfoMst.insuranceFrom);
      console.log('insuranceFrom ', this.insurFrom);
    }
    if (this.addlInfoMst.insuranceTo !== null) {
      this.insuranceTo = new Date(this.addlInfoMst.insuranceTo);
    }
    if (this.addlInfoMst.warrantyFrom !== null) {
      this.warrantyFrom = new Date(this.addlInfoMst.warrantyFrom);
    }
    if (this.addlInfoMst.warrantyTo !== null) {
      this.warrantyTo = new Date(this.addlInfoMst.warrantyTo);
    }
    if (this.fixedAssetMst.register || this.fixedAssetMst.amendApprove) {
      this.isUpdateField = "true";
      this.isAmendField = "true";
      this.isDisposeField = "true";
      console.log('register ' , this.fixedAssetMst.register);
      console.log('amendApprove ' , this.fixedAssetMst.amendApprove);
    } else if (this.fixedAssetMst.amend) {
      console.log('loop');
      this.isUpdateField = "true";
      this.isAmendField = "false";
      this.isDisposeField = "true";
      console.log('Amend ' , this.fixedAssetMst.amend);
  }
    console.log('fixed ' ,this.fixedAssetMst);
    console.log('addlInfo ' , this.addlInfoMst);
    console.log('pcQRInfoMst ' ,this.pcQRInfoMst);
    console.log('register ', this.register);
    console.log('draft ', this.draft);
    console.log('amend ', this.amend);
    console.log('selectedTax ', this.selectedTax);
  }

  back() {
    if (this.fixedAssetMst.register || this.fixedAssetMst.draft || this.fixedAssetMst.amend || this.fixedAssetMst.amendApprove) {
      this.changeInfo();
      const  navigationExtra: NavigationExtras = {
        queryParams: this.fixedAssetMst
      };
      this.router.navigate(['app-fixedasset-input-page3'], navigationExtra);
    } else {
      this.changeInfo();

      if(this.menuModuleName === Menu.update) {
           this.router.navigate(['app-fixedasset-input-page3', { name: Menu.update , subname: this.subMenuModuleName}]);
      }
      if(this.menuModuleName === Menu.dispose) {
        this.router.navigate(['app-fixedasset-input-page3', { name: Menu.dispose , subname: this.subMenuModuleName}]);
      }
      // else {
      //   this.router.navigate(['app-fixedasset-input-page3']);
      // }
    }
  }

  goToNextPage4() {
    this.changeInfo();
    this.router.navigate(['app-fixedasset-input-page3']);
  }

 changeInfo(): void {
  this.addlInfoMst.insuranceCode = this.selectedInsurance;
  this.addlInfoMst.taxCode = this.selectedTax;
  this.addlInfoMst.warrantyCode = this.selectedWarranty;
  this.addlInfoMst.financeCode = this.selectedFinancing;
  this.addlInfoMst.supportCode = this.selectedSupport;
  this.fixedAssetService.changeAddlInfoData(this.addlInfoMst);
  this.fixedAssetService.changePcQRInfoData(this.pcQRInfoMst);
  this.fixedAssetService.changeFixedAssetInfoData(this.fixedAssetMst);
  this.fixedAssetService.changeCloneFixedAssetInfoData(this.cloneFixedAssetMst);

  this.fixedAssetService.changeSelectedBranchInfoData(this.selectedBranch);
  this.fixedAssetService.changeSelectedDepartmentInfoData(this.selectedDepartment);
  this.fixedAssetService.changeSelectedVendorInfoData(this.selectedVendor);


 }

 getErrorMessage(msg: string) {
  return this.formControl.hasError('required') ? 'Required ' + msg : '';

}

// getVendorList(): void {
//   this.fixedAssetService.getSelectBindingCodeValue('005').subscribe(d => {
//     this.vendorLst = d;
//   });
// }

getVendorList(): void {

  this.fixedAssetService.getAllVendors().subscribe(v => {
    this.vendorLst = v;
  });
}

updateFAData() {
  this.fixedAssetService.updateFAData(this.fixedAssetMst,this.addlInfoMst,this.pcQRInfoMst,this.dataTnx,this.cloneFixedAssetMst);
  this.router.navigate( [
    'app-fixedasset-list-screen', { status: Menu.Approve} , {name: this.menuModuleName}
  ]);
}

disposeFAData() {
  this.fixedAssetService.disposeFAData(this.fixedAssetMst,this.addlInfoMst,this.pcQRInfoMst,this.dataTnx,this.cloneFixedAssetMst);
  this.router.navigate( [
    'app-fixedasset-list-screen', { status: Menu.Approve} , {name: this.menuModuleName}
  ]);
}

saveDraft() {
   console.log(this.addlInfoMst);
   console.log(this.pcQRInfoMst);
   console.log(this.fixedAssetMst);
  this.fixedAssetService.saveAsDraftUpdateFA(this.fixedAssetMst , this.addlInfoMst, this.pcQRInfoMst,this.dataTnx,this.cloneFixedAssetMst);
  this.router.navigate( [
    'app-fixedasset-list-screen', { status: 'pending'}
  ]);
}

saveDraftDispose() {
  
  this.fixedAssetService.saveAsDraftDisposeFA(this.fixedAssetMst , this.addlInfoMst, this.pcQRInfoMst,this.dataTnx,this.cloneFixedAssetMst);
  this.router.navigate( [
    'app-fixedasset-list-screen', { status: 'DisposePending'}
  ]); 
}

deleteEntry():void {
  this.fixedAssetService.deleteUpdateFA(this.fixedAssetMst , this.addlInfoMst, this.pcQRInfoMst,this.dataTnx,this.cloneFixedAssetMst);
  this.router.navigate( ['app-fixedasset-list-screen']);
}

approveUpdateFa(): void {
  console.log("Enter Approval Update FA");
  this.fixedAssetService.approveUpdateFA(this.fixedAssetMst , this.addlInfoMst, this.pcQRInfoMst,this.dataTnx,this.cloneFixedAssetMst);
  this.router.navigate(['app-fixedasset-list-screen',{ status: Menu.Approve},{name : this.menuModuleName}]) 
}

approveDisposeFa():void {
  this.fixedAssetService.approveDisposeFA(this.fixedAssetMst , this.addlInfoMst, this.pcQRInfoMst,this.dataTnx,this.cloneFixedAssetMst);
  this.router.navigate(['app-fixedasset-list-screen',{ status: Menu.Approve,name : this.menuModuleName, subname : Menu.Approve}]) 

}

backToListScreen() : void {
  //status: 'Approval'
  this.router.navigate(['app-fixedasset-list-screen',{name: this.menuModuleName,subname : Menu.Approve }]) 
}
    approveRegister() {
      this.clearMessage();
      this.fixedAssetService.changeAddlInfoData(this.addlInfoMst);
      this.fixedAssetService.changePcQRInfoData(this.pcQRInfoMst);
      this.fixedAssetService.changeFixedAssetInfoData(this.fixedAssetMst);
      this.fixedAssetMst.addlInfo = this.addlInfoMst;
      this.fixedAssetMst.imgInfo = this.pcQRInfoMst;
      this.fixedAssetService.approveRegister(this.fixedAssetMst);
    }

    completeRegister() {
      this.clearMessage();
      this.fixedAssetService.changeAddlInfoData(this.addlInfoMst);
      this.fixedAssetService.changePcQRInfoData(this.pcQRInfoMst);
      this.fixedAssetService.changeFixedAssetInfoData(this.fixedAssetMst);
      this.fixedAssetMst.addlInfo = this.addlInfoMst;
      this.fixedAssetMst.imgInfo = this.pcQRInfoMst;
      this.fixedAssetService.complete(this.fixedAssetMst);
    }

    RequestForAmendFixedAsset() {
      // this.fixedAssetService.changeAddlInfoData(this.addlInfoMst);
      // this.fixedAssetService.changePcQRInfoData(this.pcQRInfoMst);
      // this.fixedAssetService.changeFixedAssetInfoData(this.fixedAssetMst);
      // this.fixedAssetMst.addlInfo = this.addlInfoMst;
      // this.fixedAssetMst.imgInfo = this.pcQRInfoMst;
      this.clearMessage();
      this.changeInfo();
      console.log(this.fixedAssetMst);
      console.log(this.addlInfoMst);
      console.log(this.pcQRInfoMst);
      this.fixedAssetService.requestForAmend(this.fixedAssetMst);
    }
    
    ApproveForAmendFixedAsset() {
      // this.fixedAssetService.changeAddlInfoData(this.addlInfoMst);
      // this.fixedAssetService.changePcQRInfoData(this.pcQRInfoMst);
      // this.fixedAssetService.changeFixedAssetInfoData(this.fixedAssetMst);
      // this.fixedAssetMst.addlInfo = this.addlInfoMst;
      // this.fixedAssetMst.imgInfo = this.pcQRInfoMst;
      this.clearMessage();
      this.changeInfo();
      console.log(this.fixedAssetMst);
      console.log(this.addlInfoMst);
      console.log(this.pcQRInfoMst);
      this.fixedAssetService.amendApprove(this.fixedAssetMst);
    }

    public clearMessage() {
      this.messageService.clearErrorMessage();
    }

}
