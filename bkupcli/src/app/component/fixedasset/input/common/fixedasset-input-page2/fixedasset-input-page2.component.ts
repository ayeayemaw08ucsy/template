import { Component, OnInit , Output , EventEmitter} from '@angular/core';
import { FixedassetService } from '../../../../../service/fixedasset/fixedasset.service';
import { FixedAssetAdditionalInfo } from 'src/app/model/fixedassetadditionalinfo.model';
import { PictureAndQRInfo } from 'src/app/model/pictureandqrinfo.model';
import { FixedAsset } from 'src/app/model/fixedasset.model';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute , Router, NavigationExtras } from '@angular/router';
import * as moment from 'moment';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Menu } from 'src/app/model/menu';
import { CodeValue } from 'src/app/model/codevalue.model';


const DATE_FORMATTER = 'DD/MM/YYYY';
@Component({
  selector: 'app-fixedasset-input-page2',
  templateUrl: './fixedasset-input-page2.component.html',
  styleUrls: ['./fixedasset-input-page2.component.css']
})
export class FixedassetInputPage2Component implements OnInit {
   
  
  addlInfoMst : FixedAssetAdditionalInfo;
  pcQRInfoMst : PictureAndQRInfo;
  fixedAssetMst : FixedAsset;
  cloneFixedAssetMst : FixedAsset;
  selectedDisposeType: string;
  disposeTypeLst: CodeValue[];
  
  /**Asset Tracking CheckBox */
  IsDisabled: boolean;
  IsChecked: boolean ;
  LabelAlign: string ;
  myDate: Date;
  dpDate: Date;

  /**IsDisable Field .Its value changed depend on the FAmodule */
  isUpdateField : string;
  isAmendField : string;
  isDisposeField : string;
  dataTnx: any;
  
  fixedAssetStatus : string;
  menuModuleName : string;
  subMenuModuleName : string;
  moduleName: string;

  selectedBranch: string;
  selectedVendor: string;
  selectedDepartment: string;

 // date = new FormControl(new Date());
  // serializedDate = new FormControl((new Date()).toISOString());
  @Output()  nextEvent  = new EventEmitter<any>();
  formControl = new FormControl('', [
    Validators.required
  ]);
  constructor(private fixedAssetService: FixedassetService, public router: Router,private route: ActivatedRoute) {

    this.menuModuleName = this.route.snapshot.paramMap.get('name');
    this.menuModuleName = this.menuModuleName ? this.menuModuleName : '';
    this.subMenuModuleName = this.route.snapshot.paramMap.get('subname');

    console.log(this.route.snapshot.paramMap.get('name'));
    this.getDisposeTypeList();
    }

  ngOnInit() {

    this.isUpdateField = "false";
    this.isAmendField = "false";
    this.isDisposeField = "false";

    this.fixedAssetService.currentSelectedVendorInfoSource.subscribe(selVen => this.selectedVendor = selVen);
    this.fixedAssetService.currentSelectedBranchInfoSource.subscribe(selBranch => this.selectedBranch = selBranch);
    this.fixedAssetService.currentSelectedDeparmentInfoSource.subscribe(selDep => this.selectedDepartment = selDep);


    this.fixedAssetService.currentAddlInfoSource.subscribe(addlInfo => this.addlInfoMst = addlInfo);
    this.fixedAssetService.currentPcqrInfoSource.subscribe(pcQRInfoMst => this.pcQRInfoMst = pcQRInfoMst);
    this.fixedAssetService.currentFixedAssetInfoSource.subscribe(fixedAssetInfo => this.fixedAssetMst = fixedAssetInfo);
    
    this.fixedAssetService.currentFAStatus.subscribe(st =>this.fixedAssetStatus = st);

    //keep the currentCloneFixedAssetInfo.
    this.fixedAssetService.currentCloneFixedAssetInfoSource.subscribe(cloneFixedFixedAssetInfo => this.cloneFixedAssetMst = cloneFixedFixedAssetInfo);
    if(!this.fixedAssetMst.assetTracking) {
      this.fixedAssetMst.assetTracking = 'N';
    }
    this.IsChecked = this.fixedAssetMst.assetTracking === 'Y' ? true : false; 
    this.LabelAlign = "before";
    this.selectedDisposeType = this.fixedAssetMst.disposeType;

    if (this.fixedAssetMst.purchaseDate) {
       this.myDate = new Date(this.fixedAssetMst.purchaseDate);
    }
    if(this.fixedAssetMst.disposalDate) {
      this.dpDate = new Date(this.fixedAssetMst.disposalDate);
    }    
    if (this.fixedAssetMst.register || this.fixedAssetMst.amendApprove) {
      this.isUpdateField = "true";
      this.isAmendField = "true";
      this.isDisposeField = "true";
      this.menuModuleName = "Approve";
      this.moduleName = "Register";
      console.log('register ' , this.fixedAssetMst.register);
      console.log('amendApprove ' , this.fixedAssetMst.amendApprove);
   } else if (this.fixedAssetMst.amend) {
        console.log('loop');
        this.isUpdateField = "true";
        this.isAmendField = "false";
        this.isDisposeField = "true";
        this.menuModuleName = "Amend";
        this.moduleName = "Amend";
        console.log('Amend ' , this.fixedAssetMst.amend);
    }else if(this.menuModuleName == Menu.update)
    {
      this.isUpdateField = "false";
      this.isAmendField = "true";
      this.isDisposeField = "true";

      console.log("upd ", this.menuModuleName);
      console.log("upd ", this.isUpdateField);
      console.log("amd ", this.isAmendField);
      console.log("dsp ", this.isDisposeField);
    }
    if(this.menuModuleName == 'Dispose')
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
    console.log("upd ", this.menuModuleName);
    console.log("upd ", this.isUpdateField);
    console.log("amd ", this.isAmendField);
    console.log("dsp ", this.isDisposeField);
   }

  // recieveData($event) {
  //   console.log("Recieved Data from Page 1",$event);
  // }

  getErrorMessage(msg: string) {
    return this.formControl.hasError('required') ? 'Required ' + msg : '';

  }

  back() {
    
    if (this.fixedAssetMst.register || this.fixedAssetMst.draft || this.fixedAssetMst.amend || this.fixedAssetMst.amendApprove) {
       this.changeInfo();
      const  navigationExtra: NavigationExtras = {
        queryParams: this.fixedAssetMst
      };
      this.router.navigate(['app-fixedasset-input-screen'], navigationExtra);
    } else {
      this.changeInfo();
      console.log("In Page 2 Back", this.selectedBranch);
      console.log("In Page 2 Back", this.selectedVendor);
      console.log("In Page 2 Back", this.selectedDepartment);

      if(this.menuModuleName === Menu.update) {
        this.router.navigate(['app-fixedasset-input-screen',{name: Menu.update , subname: this.subMenuModuleName}]);
      }
      if(this.menuModuleName === Menu.dispose) {
        this.router.navigate(['app-fixedasset-input-screen',{name: Menu.dispose , subname: this.subMenuModuleName}]);
      }
      // else {
      //   this.router.navigate(['app-fixedasset-input-screen']);
      // }
    }
    
  }

  goToNextPage3() {
    this.fixedAssetMst.bookAmt = this.fixedAssetMst.tnxAmount;
    this.fixedAssetMst.disposeType = this.selectedDisposeType;
    console.log(this.addlInfoMst);
    console.log(this.fixedAssetMst);
    this.changeInfo();
    this.router.navigate(['app-fixedasset-input-page3',{ name: this.menuModuleName , subname : this.subMenuModuleName}]);
  }

 changeInfo(): void {
   
  this.fixedAssetService.changeAddlInfoData(this.addlInfoMst);
  this.fixedAssetService.changePcQRInfoData(this.pcQRInfoMst);
  console.log("In page 2", this.fixedAssetMst);
  this.fixedAssetService.changeCloneFixedAssetInfoData(this.cloneFixedAssetMst);
  this.fixedAssetService.changeFixedAssetInfoData(this.fixedAssetMst);
   
  this.fixedAssetService.changeSelectedVendorInfoData(this.selectedVendor);
  this.fixedAssetService.changeSelectedBranchInfoData(this.selectedBranch);
  this.fixedAssetService.changeSelectedDepartmentInfoData(this.selectedDepartment);
  

 }

  /** */
  saveDraft(): void {
    console.log("Pending SaveAsDraft update");
    this.fixedAssetMst.purchaseDate = new Date(this.myDate);
    this.fixedAssetMst.disposalDate = new Date(this.dpDate);
    this.fixedAssetMst.disposeType = this.selectedDisposeType;
    this.fixedAssetService.saveAsDraftUpdateFA(this.fixedAssetMst , {}, {},this.dataTnx,this.cloneFixedAssetMst);
    this.router.navigate( [
      'app-fixedasset-list-screen', { status: 'pending'}
    ]);
  }
 
   /** */
   saveDraftDispose(): void {
    console.log("Pending SaveAsDraft Dispose");
    this.fixedAssetMst.disposeType = this.selectedDisposeType;
    this.fixedAssetMst.purchaseDate = new Date(this.myDate);
    this.fixedAssetMst.disposalDate = new Date(this.dpDate);
    this.fixedAssetService.saveAsDraftDisposeFA(this.fixedAssetMst , {}, {},this.dataTnx,this.cloneFixedAssetMst);
    this.router.navigate( [
      'app-fixedasset-list-screen', { status: 'DisposePending'}
    ]);
  }
 
   
  deleteEntry():void {
    this.fixedAssetService.deleteUpdateFA(this.fixedAssetMst , {}, {},this.dataTnx,this.cloneFixedAssetMst);
    this.router.navigate( ['app-fixedasset-list-screen']);
  }

  //On Change Event of CheckBox Archive Flag
  OnChange($event) {
   
//    this.fixedAssetMst.archiveFlag = $event.checked ? 'Y' : 'N';
      this.fixedAssetMst.assetTracking = $event.checked ? 'Y' : 'N';
  }

  getDisposeTypeList(): void {
    this.fixedAssetService.getSelectBindingCodeValue('404').subscribe(d => {
      this.disposeTypeLst = d;
      console.log(this.disposeTypeLst);
    });
  }
}
