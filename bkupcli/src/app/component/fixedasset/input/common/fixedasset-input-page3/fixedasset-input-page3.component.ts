import { Component, OnInit , Output , EventEmitter} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FixedassetService } from '../../../../../service/fixedasset/fixedasset.service';
import { ActivatedRoute ,Router, NavigationExtras } from '@angular/router';
import { FixedAssetAdditionalInfo } from 'src/app/model/fixedassetadditionalinfo.model';
import { PictureAndQRInfo } from 'src/app/model/pictureandqrinfo.model';
import { FixedAsset } from 'src/app/model/fixedasset.model';
import { Menu } from 'src/app/model/menu';

@Component({
  selector: 'app-fixedasset-input-page3',
  templateUrl: './fixedasset-input-page3.component.html',
  styleUrls: ['./fixedasset-input-page3.component.css']
})
export class FixedassetInputPage3Component implements OnInit {

  @Output()  nextEvent  = new EventEmitter<any>();
  formControl = new FormControl('', [
    Validators.required
  ]);

 
  addlInfoMst : FixedAssetAdditionalInfo;
  pcQRInfoMst : PictureAndQRInfo;
  fixedAssetMst : FixedAsset;
  dataTnx : any;
  cloneFixedAssetMst : FixedAsset;
  fixedAssetStatus :string;
  menuModuleName : string;
  subMenuModuleName : string;

  isUpdateField : string;
  isAmendField : string;
  isDisposeField : string;
  moduleName: string;

  selectedBranch: string;
  selectedVendor: string;
  selectedDepartment: string;

  constructor(private fixedAssetService: FixedassetService, public router: Router,private route: ActivatedRoute) { 
    this.menuModuleName = this.route.snapshot.paramMap.get('name');
    this.subMenuModuleName = this.route.snapshot.paramMap.get('subname');

    console.log("In page 3",this.menuModuleName);
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
  
  }

  ngOnInit() {
    this.fixedAssetService.currentSelectedBranchInfoSource.subscribe(selBranch => this.selectedBranch = selBranch);
    this.fixedAssetService.currentSelectedVendorInfoSource.subscribe(selVendor => this.selectedVendor = selVendor);
    this.fixedAssetService.currentSelectedDeparmentInfoSource.subscribe(selDep => this.selectedDepartment = selDep);

    this.fixedAssetService.currentAddlInfoSource.subscribe(addlInfo => this.addlInfoMst = addlInfo);
    this.fixedAssetService.currentPcqrInfoSource.subscribe(pcQRInfoMst => this.pcQRInfoMst = pcQRInfoMst);
    this.fixedAssetService.currentFixedAssetInfoSource.subscribe(fixedAssetInfo => this.fixedAssetMst = fixedAssetInfo);
    this.fixedAssetService.currentCloneFixedAssetInfoSource.subscribe(cloneFixedAssetInfo => this.cloneFixedAssetMst = cloneFixedAssetInfo);
    this.fixedAssetService.currentFAStatus.subscribe(st =>this.fixedAssetStatus = st);
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
  }
   
  }
 

  changeInfo(): void {
    this.fixedAssetService.changeAddlInfoData(this.addlInfoMst);
    this.fixedAssetService.changePcQRInfoData(this.pcQRInfoMst);
    this.fixedAssetService.changeFixedAssetInfoData(this.fixedAssetMst);
    this.fixedAssetService.changeCloneFixedAssetInfoData(this.cloneFixedAssetMst);

    this.fixedAssetService.changeSelectedBranchInfoData(this.selectedBranch);
    this.fixedAssetService.changeSelectedVendorInfoData(this.selectedVendor);
    this.fixedAssetService.changeSelectedDepartmentInfoData(this.selectedDepartment);
   }

   getErrorMessage(msg: string) {
    return this.formControl.hasError('required') ? 'Required ' + msg : '';

  }
  goToNextPage4() {
    this.changeInfo();
    this.router.navigate(['app-fixedasset-input-page4',{name: this.menuModuleName , subname: this.subMenuModuleName}]);
  }

  back() {
    if (this.fixedAssetMst.register || this.fixedAssetMst.draft || this.fixedAssetMst.amend || this.fixedAssetMst.amendApprove) {
      this.changeInfo();
      const  navigationExtra: NavigationExtras = {
        queryParams: this.fixedAssetMst
      };
      this.router.navigate(['app-fixedasset-input-page2'], navigationExtra);
    } else {
      this.changeInfo();
        
        if(this.menuModuleName === Menu.update) {
            this.router.navigate(['app-fixedasset-input-page2',{name: Menu.update , subname : this.subMenuModuleName}]);
        }
        if(this.menuModuleName === Menu.dispose) {
          this.router.navigate(['app-fixedasset-input-page2',{name: Menu.dispose , subname : this.subMenuModuleName}]);
        }
        //  else {
        //   this.router.navigate(['app-fixedasset-input-page2']);
        // }
    }    
  }

  saveDraft() {
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

}
