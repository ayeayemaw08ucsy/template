import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FixedAsset } from 'src/app/model/fixedasset.model';
import { FixedassetService } from '../../../../../service/fixedasset/fixedasset.service';
import { FixedAssetAdditionalInfo } from 'src/app/model/fixedassetadditionalinfo.model';
import { PictureAndQRInfo } from 'src/app/model/pictureandqrinfo.model';
import { CodeValue } from 'src/app/model/codevalue.model';
import { FormControl, Validators, AbstractControl, FormGroup, FormBuilder } from '@angular/forms';
import { FixedAssetTnx } from 'src/app/model/fixedassettnx.model';
import { BOOL_TYPE } from '@angular/compiler/src/output/output_ast';
import { Menu } from 'src/app/model/menu';

@Component({
  selector: 'app-fixedasset-input-screen',
  templateUrl: './fixedasset-input-screen.component.html',
  styleUrls: ['./fixedasset-input-screen.component.css']
})
export class FixedassetInputScreenComponent implements OnInit {

  fixedAssetMst: FixedAsset;
  addlInfoMst: FixedAssetAdditionalInfo;
  pcQRInfoMst: PictureAndQRInfo;
 
  cloneFixedAssetMst: FixedAsset;
  cloneAddlInfoMst: FixedAssetAdditionalInfo;
  clonePcQRInfoMst: PictureAndQRInfo;

  data: any;
  dataTnx: any;
  addlDataTnx: any;

  selectedBranch: string;
  selectedVendor: string;
  selectedDep: string;
  branchLst: CodeValue[];
  depLst: CodeValue[];
  vendorLst: CodeValue[];
  isDisabledField: boolean;
  isNonDisabledField: boolean;

  /**For Data Carry of FixedAssetTnx. */
  fixedAssetTnx: FixedAssetTnx;
  addlInfoTnx: FixedAssetAdditionalInfo;
  pcQRInfoTnx: PictureAndQRInfo;
  
  fixedAssetStatus :string;
  title: string;
  menuModuleName : string;
  subMenuModuleName : string;
  isUpdateField : string;
  isAmendField : string;
  isDisposeField : string;
  formControl = new FormControl('', [Validators.required]);
  @Output() nextEvent = new EventEmitter<any>();
  invoiceDate: Date;

  constructor(private route: ActivatedRoute, public fixedAssetService: FixedassetService, public router: Router, ) {
    this.menuModuleName = this.route.snapshot.paramMap.get('name');
    this.subMenuModuleName = this.route.snapshot.paramMap.get('subname');

    this.menuModuleName = this.menuModuleName ? this.menuModuleName : '';
    
    this.route.queryParams.subscribe((params: FixedAsset) => {
             this.fixedAssetMst = params;             
     });
    console.log('register ', this.fixedAssetMst.register);
    console.log('draft ', this.fixedAssetMst.draft);
    console.log('amend ', this.fixedAssetMst.amend);
    console.log('amendApprove ', this.fixedAssetMst.amendApprove);
    console.log(this.subMenuModuleName);
    if (String(this.fixedAssetMst.register)  === 'true') {
        console.log('in the register');
        this.menuModuleName = "Approve";
        this.fixedAssetService.currentFixedAssetInfoSource.subscribe(fixedAssetInfo => this.fixedAssetMst = fixedAssetInfo);
        this.loadDataByFixedAssetTnxSeqId(this.fixedAssetMst.fixedAssetTnxSeqId);
        this.getBranchList();
        this.getDepList();
        this.getVendorList();
        this.selectedBranch = this.fixedAssetMst.branchCode;
        this.selectedDep = this.fixedAssetMst.deptCode;
        this.selectedVendor = this.fixedAssetMst.vendorCode;        
        this.fixedAssetService.currentAddlInfoSource.subscribe(addlInfo => this.addlInfoMst = addlInfo);
        this.fixedAssetService.currentPcqrInfoSource.subscribe(pcQRInfoMst => this.pcQRInfoMst = pcQRInfoMst);
        
        this.isUpdateField = "true";
        this.isAmendField = "true";
        this.isDisposeField = "true";

    } else if (String(this.fixedAssetMst.draft) == 'true') {
        console.log('in the draft');
        this.menuModuleName = "Draft";
        this.fixedAssetService.currentFixedAssetInfoSource.subscribe(fixedAssetInfo => this.fixedAssetMst = fixedAssetInfo);
        this.loadDataByFixedAssetTnxSeqId(this.fixedAssetMst.fixedAssetTnxSeqId);
        this.getBranchList();
        this.getDepList();
        this.getVendorList();
        this.selectedBranch = this.fixedAssetMst.branchCode;
        this.selectedDep = this.fixedAssetMst.deptCode;
        this.selectedVendor = this.fixedAssetMst.vendorCode;
        this.fixedAssetService.currentAddlInfoSource.subscribe(addlInfo => this.addlInfoMst = addlInfo);
        this.fixedAssetService.currentPcqrInfoSource.subscribe(pcQRInfoMst => this.pcQRInfoMst = pcQRInfoMst);
        
        this.isUpdateField = "true";
        this.isAmendField = "true";
        this.isDisposeField = "true";    
    } else if (String(this.fixedAssetMst.amend) == 'true') {
      console.log('in the amend');
      this.menuModuleName = "Amend";
      console.log('title ', this.title);
      this.fixedAssetService.currentFixedAssetInfoSource.subscribe(fixedAssetInfo => this.fixedAssetMst = fixedAssetInfo);
      this.loadAmendDataByFixedAssetSeqId(this.fixedAssetMst.fixedAssetMstSeqId);
      this.getBranchList();
      this.getDepList();
      this.getVendorList();
      this.selectedBranch = this.fixedAssetMst.branchCode;
      this.selectedDep = this.fixedAssetMst.deptCode;
      this.selectedVendor = this.fixedAssetMst.vendorCode;
      this.fixedAssetService.currentAddlInfoSource.subscribe(addlInfo => this.addlInfoMst = addlInfo);
      this.fixedAssetService.currentPcqrInfoSource.subscribe(pcQRInfoMst => this.pcQRInfoMst = pcQRInfoMst);
      
      this.isUpdateField = "true";
      this.isAmendField = "true";
      this.isDisposeField = "true";
      console.log('title ', this.title);

  } else if (String(this.fixedAssetMst.amendApprove) == 'true') {
      console.log('in the amend approve');
      this.menuModuleName = "Amend Approval";
      this.fixedAssetService.currentFixedAssetInfoSource.subscribe(fixedAssetInfo => this.fixedAssetMst = fixedAssetInfo);
      this.loadAmendApprovalByFixedAssetTnxSeqId(this.fixedAssetMst.fixedAssetTnxSeqId);
      this.getBranchList();
      this.getDepList();
      this.getVendorList();
      this.selectedBranch = this.fixedAssetMst.branchCode;
      this.selectedDep = this.fixedAssetMst.deptCode;
      this.selectedVendor = this.fixedAssetMst.vendorCode;
      this.fixedAssetService.currentAddlInfoSource.subscribe(addlInfo => this.addlInfoMst = addlInfo);
      this.fixedAssetService.currentPcqrInfoSource.subscribe(pcQRInfoMst => this.pcQRInfoMst = pcQRInfoMst);
      
      this.isUpdateField = "true";
      this.isAmendField = "true";
      this.isDisposeField = "true";

  }else {   
    console.log('in the update');
    if(this.menuModuleName === 'Updated') {
      this.isUpdateField = "false";
      this.isAmendField = "true";
      this.isDisposeField = "true";
    }
    if(this.menuModuleName === 'Dispose') {
      this.isUpdateField = "true";
      this.isAmendField = "true";
      this.isDisposeField = "false";
    }
    if(this.menuModuleName === Menu.update && this.subMenuModuleName === Menu.Approve) {
      this.isUpdateField = "true";
      this.isAmendField = "true";
      this.isDisposeField = "true";
    }
    if(this.menuModuleName === "UpdateApprove" || this.menuModuleName === 'DisposeApprove') {
      this.isUpdateField = "true";
      this.isAmendField = "true";
      this.isDisposeField = "true";
    }
    
    this.getBranchList();
    this.getDepList();
    this.getVendorList();
    this.fixedAssetService.currentFixedAssetInfoSource.subscribe(fixedAssetInfo => this.fixedAssetMst = fixedAssetInfo);
    this.fixedAssetService.currentFAStatus.subscribe(st => this.fixedAssetStatus = st);
    this.fixedAssetService.currentCloneFixedAssetInfoSource.subscribe(cloneFA => this.cloneFixedAssetMst = cloneFA);

    this.fixedAssetService.currentSelectedBranchInfoSource.subscribe(selBranch => this.selectedBranch = selBranch);
    this.fixedAssetService.currentSelectedVendorInfoSource.subscribe(selVen => this.selectedVendor = selVen);
    this.fixedAssetService.currentSelectedDeparmentInfoSource.subscribe(selDep => this.selectedDep = selDep);

    let fxAssetMstSeqId;
    let prodRefId;
   
    if(this.fixedAssetStatus === 'pending') {
      
      fxAssetMstSeqId = this.fixedAssetMst.fixedAsset ? this.fixedAssetMst.fixedAsset.fixedAssetMstSeqId : this.fixedAssetMst.fixedAssetMstSeqId;
      prodRefId = this.fixedAssetMst.fixedAsset ? this.fixedAssetMst.fixedAsset.prodRefId : this.fixedAssetMst.prodRefId;
      this.fixedAssetMst = this.fixedAssetMst.fixedAsset ? this.fixedAssetMst.fixedAsset : this.fixedAssetMst;
     
      console.log("If Pending");
    }else {
   
      fxAssetMstSeqId = this.fixedAssetMst.fixedAssetMstSeqId;
      prodRefId = this.fixedAssetMst.prodRefId;
      console.log("Else Pending")
    }
      
    console.log('Befor Calling FixedAsset Mst',this.fixedAssetMst,this.fixedAssetStatus);
    // this.loadDataById(this.fixedAssetMst.prodRefId, this.fixedAssetMst.fixedAssetMstSeqId);
    
    this.loadDataById(prodRefId, fxAssetMstSeqId);
    if(!this.selectedBranch) {
      this.selectedBranch  = this.fixedAssetMst.branchCode;
    }
    if(!this.selectedVendor) {
      this.selectedVendor = this.fixedAssetMst.vendorCode;
    }
    if(!this.selectedDep) {
      this.selectedDep = this.fixedAssetMst.deptCode;
    }
   
    this.fixedAssetService.currentAddlInfoSource.subscribe(addlInfo => this.addlInfoMst = addlInfo);
    this.fixedAssetService.currentPcqrInfoSource.subscribe(pcQRInfoMst => this.pcQRInfoMst = pcQRInfoMst);
    
    //added status
    this.fixedAssetService.currentFAStatus.subscribe(st =>this.fixedAssetStatus = st);

    //this.fixedAssetService.currentAddlInfoSource.subscribe(addlInfo => this.addlInfoMst = addlInfo);
    //this.fixedAssetService.currentPcqrInfoSource.subscribe(pcQRInfoMst => this.pcQRInfoMst = pcQRInfoMst);
}

    console.log('Input Screen',this.fixedAssetStatus);
    console.log('menuModuleName ', this.menuModuleName);
  }

  ngOnInit() {

    //   this.route.queryParams.subscribe((params : FixedAsset) => {
    //     this.fixedAssetMst = params;
    //     console.log('Param Object%%%%%%%%%',params);
    // });

    // this.fixedAssetService.currentFixedAssetInfoSource.subscribe(fixedAssetInfo => this.fixedAssetMst = fixedAssetInfo);
    // this.loadDataById(this.fixedAssetMst.prodRefId);
    // this.getBranchList();
    // this.getDepList();
    // this.getVendorList();
    // this.selectedBranch = this.fixedAssetMst.branchCode;
    // this.selectedDep = this.fixedAssetMst.deptCode;
    this.invoiceDate = new Date(this.fixedAssetMst.invoiceDate);
  }

  loadDataById(id: string, fixedAssetMstSeqId: string): void {
    // const fixedAssetMstSeqId = this.route.snapshot.paramMap.get('row');
    this.isDisabledField = true;
    this.isNonDisabledField = false;
  //this.cloneFixedAssetMst = this.cloneFixedAssetMst? this.cloneFixedAssetMst : Object.assign({},this.fixedAssetMst);
    this.cloneFixedAssetMst = Object.assign({},this.fixedAssetMst);
    
    console.log(id,fixedAssetMstSeqId);
    //fetch fixedAssetMstTnx Data.
    if(!this.fixedAssetMst.fixedAssetTnxSeqId) {
      this.fixedAssetService.geFixedAssetTnxDataForUpdate(id, fixedAssetMstSeqId).subscribe(data => {
        this.dataTnx = data;
        if (this.dataTnx) {
          this.swapFixedAssetTnxToMst();
          console.log('Swap FixedAssetTnxToMst',this.fixedAssetMst);
        } else {
          console.log("Empty No need to swap");
        }
      });
    }
   

     
    // fetch fixedAssetMst Data.
    this.fixedAssetService.getFixedAssetDataForUpdate(id).subscribe(data => {
      console.log(data);
      this.data = data;
      this.addlInfoMst = data.addlInfoMst;
      this.pcQRInfoMst = data.pictureAndQRInfoMst;
      this.addlDataTnx = data.addlInfoTnx;

      if(data.addlInfoTnx) {
         this.swapAddlInfoTnxToMst();
         console.log('Swap AddlInfoTnxtoMst'+this.addlInfoMst);
      }else {
        console.log("Not Exist");

      }
      // this.fixedAssetService.getFixedAssetAddlInfoTnxDataForUpdate(this.fixedAssetMst.prodRefId,
      //   data.addlInfoMst.fixedAssetAddlMstSeqId, this.fixedAssetMst.fixedAssetTnxSeqId).subscribe(data => {
      //       this.addlDataTnx = data;

      //       if (this.addlDataTnx) {
      //         this.swapAddlInfoTnxToMst();
      //       } else {
      //         console.log("Empty No need to swap");
      //       }
           
      //    });
    });

    //load data from addl Info Tnx.
    
       
      
  }

  loadDataByFixedAssetTnxSeqId(fixedAssetTnxSeqId: string): void {

     this.fixedAssetService.getFixedAssetForRegisterApproval(fixedAssetTnxSeqId).subscribe(data => {
      console.log('data ' , data);
      this.data = data;
      this.fixedAssetMst = data;
      this.addlInfoMst = data.addlInfo;      
      this.pcQRInfoMst = data.imgInfo;
      this.invoiceDate = new Date(this.data.invoiceDate);
      console.log('fixedAssetMst register ' , this.fixedAssetMst);
    });
  }

  loadAmendDataByFixedAssetSeqId(fixedAssetMstSeqId: string): void {

    this.fixedAssetService.getFixedAssetForAmend(fixedAssetMstSeqId).subscribe(data => {
     console.log('data ' , data);
     this.data = data;
     this.fixedAssetMst = data;     
     this.addlInfoMst = data.addlInfo;     
     this.pcQRInfoMst = data.imgInfo;
     this.invoiceDate = new Date(this.data.invoiceDate);
     console.log('fixedAssetMst amend request ' , this.fixedAssetMst);
   });
 }

 loadAmendApprovalByFixedAssetTnxSeqId(fixedAssetTnxSeqId: string): void {

  this.fixedAssetService.getFixedAssetForAmendApproval(fixedAssetTnxSeqId).subscribe(data => {
   console.log('data ' , data);
   this.data = data;
   this.fixedAssetMst = data;
   this.addlInfoMst = data.addlInfo;   
   this.pcQRInfoMst = data.imgInfo;
   this.invoiceDate = new Date(this.data.invoiceDate);
   console.log('fixedAssetMst amend approval ' , this.fixedAssetMst);
 });
}


  getBranchList(): void {
    this.fixedAssetService.getSelectBindingCodeValue('003').subscribe(d => {
      this.branchLst = d;
    });
  }

  getDepList(): void {
    this.fixedAssetService.getSelectBindingCodeValue('004').subscribe(d => {
      this.depLst = d;
    });
  }

  getVendorList(): void {
    this.fixedAssetService.getSelectBindingCodeValue('005').subscribe(d => {
      this.vendorLst = d;
    });
  }


  getErrorMessage(msg: string) {
    return this.formControl.hasError('required') ? 'Required ' + msg : '';

  }


  sendFixedAssetData() {
    this.nextEvent.emit([this.fixedAssetMst, this.addlInfoMst, this.pcQRInfoMst]);
    this.router.navigate(['app-fixedasset-input-page2']);
  }

  goToNextPage2() {

    this.changeInfo();
    console.log("In Pending",this.addlInfoMst);
    console.log(this.menuModuleName);
    console.log('Selected Branches',this.selectedBranch);
    this.router.navigate(['app-fixedasset-input-page2',{ name: this.menuModuleName ,subname : this.subMenuModuleName}]);
  }

  changeInfo(): void {
    this.fixedAssetService.changeAddlInfoData(this.addlInfoMst);
    this.fixedAssetService.changePcQRInfoData(this.pcQRInfoMst);
    this.fixedAssetService.changeFixedAssetInfoData(this.fixedAssetMst);
    
    this.fixedAssetService.changeCloneFixedAssetInfoData(this.cloneFixedAssetMst);
    this.fixedAssetService.changeSelectedBranchInfoData(this.selectedBranch);
    this.fixedAssetService.changeSelectedVendorInfoData(this.selectedVendor);
    this.fixedAssetService.changeSelectedDepartmentInfoData(this.selectedDep);
    
  }

  /** */
  saveDraft(): void {

    this.fixedAssetMst.branchCode = this.selectedBranch;
    this.fixedAssetMst.vendorCode = this.selectedVendor;
    this.fixedAssetMst.deptCode = this.selectedDep;

    this.fixedAssetService.saveAsDraftUpdateFA(this.fixedAssetMst, {}, {}, this.dataTnx, this.cloneFixedAssetMst);
    this.router.navigate( [
      'app-fixedasset-list-screen', { status: 'pending'}
    ]);
  }

  saveDraftDispose(): void {
    
    this.fixedAssetMst.branchCode = this.selectedBranch;
    this.fixedAssetMst.vendorCode = this.selectedVendor;
    this.fixedAssetMst.deptCode = this.selectedDep;

    this.fixedAssetService.saveAsDraftDisposeFA(this.fixedAssetMst, {}, {}, this.dataTnx, this.cloneFixedAssetMst);
    this.router.navigate( [
      'app-fixedasset-list-screen', { status: 'DisposePending'}
    ]);
  }

  swapFixedAssetTnxToMst() {

    this.fixedAssetMst = Object.assign({}, this.fixedAssetMst, {
      fixedAssetMstSeqId: this.dataTnx.fixedAsset.fixedAssetMstSeqId,
      fixedAssetTnxSeqId: this.dataTnx.fixedAssetTnxSeqId,
      entity: this.dataTnx.entity,
      productCode: this.dataTnx.productCode,
      assetType: this.dataTnx.assetType,
      assetSubType: this.dataTnx.assetSubType,
      prodRefId: this.dataTnx.prodRefId,
      businessDate: this.dataTnx.businessDate,
      invoiceDate: this.dataTnx.invoiceDate,
      invoiceRef: this.dataTnx.invoiceRef,
      invUnitPrice: this.dataTnx.invUnitPrice,
      invQuantity: this.dataTnx.invQuantity,
      invCurrency: this.dataTnx.invCurrency,
      invAmount: this.dataTnx.invAmount,
      exchRate: this.dataTnx.exchRate,
      tnxCurrency: this.dataTnx.tnxCurrency,
      tnxAmount: this.dataTnx.tnxAmount,
      bookCurrency: this.dataTnx.bookCurrency,
      bookAmt: this.dataTnx.bookAmt,
      purchaseDate: this.dataTnx.purchaseDate,
      assetDesc1: this.dataTnx.assetDesc1,
      assetDesc2: this.dataTnx.assetDesc2,
      assetModel: this.dataTnx.assetModel,
      serialNo: this.dataTnx.serialNo,
      uniqueId: this.dataTnx.uniqueId,
      assetQuantity: this.dataTnx.assetQuantity,
      branchCode: this.dataTnx.branchCode,
      deptCode: this.dataTnx.deptCode,
      depMethod: this.dataTnx.depMethod,
      depRate: this.dataTnx.depRate,
      depUsefulLife: this.dataTnx.depUsefulLife,
      depCollFrequency: this.dataTnx.depCollFrequency,
      residualCurrency: this.dataTnx.residualCurrency,
      residualValue: this.dataTnx.residualValue,
      accumDepCurrency: this.dataTnx.accumDepCurrency,
      accumDepAmt: this.dataTnx.accumDepAmt,
      depSequence: this.dataTnx.depSequence,
      netAssetCurrency: this.dataTnx.netAssetCurrency,
      netAssetAmount: this.dataTnx.netAssetAmount,
      disposalDate: this.dataTnx.disposalDate,
      disposeType: this.dataTnx.disposeType,
      archiveFlag: this.dataTnx.archiveFlag,
      vendorCode: this.dataTnx.vendorCode,
      vendorName: this.dataTnx.vendorName,
      prodStatusCode: this.dataTnx.prodStatusCode,
      tnxType: this.dataTnx.tnxType,
      currentCollectedPeriod: this.dataTnx.fixedAsset.currentCollectedPeriod,
      collectionPeriodsPerFreq: this.dataTnx.fixedAsset.collectionPeriodsPerFreq,
      nextCollectionDate: this.dataTnx.fixedAsset.nextCollectionDate,
      needDepreciate: this.dataTnx.fixedAsset.needDepreciate,

    });

    this.selectedBranch = this.fixedAssetMst.branchCode;
    this.selectedDep = this.fixedAssetMst.deptCode;
    this.selectedVendor = this.fixedAssetMst.vendorCode;
  }

  swapAddlInfoTnxToMst() {
      console.log('This data Tnx of AddlInfoTnx Mst',this.addlDataTnx)
    this.addlInfoMst = Object.assign({}, this.addlInfoMst, {
      businessDate: this.addlDataTnx.businessDate,
      entity: this.addlDataTnx.entity,
      financeAmt: this.addlDataTnx.financeAmt,
      financeCode: this.addlDataTnx.financeCode,
      financeCurrency: this.addlDataTnx.financeCurrency,
      financeFrom: this.addlDataTnx.financeFrom,
      financeName: this.addlDataTnx.financeName,
      financeTo: this.addlDataTnx.financeTo,
      financeType: this.addlDataTnx.financeType,
      fixedAssetAddlMstSeqId: this.addlDataTnx.fixedAssetAdditionalInfo.fixedAssetAddlMstSeqId,
      fixedAssetAddlTnxSeqId: this.addlDataTnx.fixedAssetAddlTnxSeqId,
      insuranceCode: this.addlDataTnx.insuranceCode,
      insuranceFrom: this.addlDataTnx.insuranceFrom,
      insuranceLocation: this.addlDataTnx.insuranceLocation,
      insuranceName: this.addlDataTnx.insuranceName,
      insuranceTo: this.addlDataTnx.insuranceTo,
      insuranceType: this.addlDataTnx.insuranceType,
      note1: this.addlDataTnx.note1,
      note2: this.addlDataTnx.note2,
      note3: this.addlDataTnx.note3,
      note4: this.addlDataTnx.note4,
      prodRefId: this.addlDataTnx.prodRefId,
      productCode: this.addlDataTnx.productCode,
      rate: this.addlDataTnx.rate,
      supportCode: this.addlDataTnx.supportCode,
      supportFrom: this.addlDataTnx.supportFrom,
      supportLocation: this.addlDataTnx.supportLocation,
      supportName: this.addlDataTnx.supportName,
      supportTo: this.addlDataTnx.supportTo,
      supportType: this.addlDataTnx.supportType,
      taxAmount: this.addlDataTnx.taxAmount,
      taxCode: this.addlDataTnx.taxCode,
      taxCurrency: this.addlDataTnx.taxCurrency,
      taxName: this.addlDataTnx.taxName,
      taxRate: this.addlDataTnx.taxRate,
      taxType: this.addlDataTnx.taxType,
      warrantyCode: this.addlDataTnx.warrantyCode,
      warrantyFrom: this.addlDataTnx.warrantyFrom,
      warrantyLocation: this.addlDataTnx.warrantyLocation,
      warrantyName: this.addlDataTnx.warrantyName,
      warrantyTo: this.addlDataTnx.warrantyTo,
      warrantyType: this.addlDataTnx.warrantyType,
      fixedAssetAdditionalInfo: this.addlDataTnx.fixedAssetAdditionalInfo
    })
  }

   
  isEmpty(obj): boolean {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
}
