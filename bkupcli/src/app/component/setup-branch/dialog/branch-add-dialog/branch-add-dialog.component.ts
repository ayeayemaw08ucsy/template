import { Component, OnInit , Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { BranchService} from 'src/app/service/branch/branch.service';
import { Branch } from '../../../../model/branch.model';
import { FormControl, Validators } from '@angular/forms';
import { CodeValue } from 'src/app/model/codevalue.model';
import { BranchMessageDialogComponent } from '../branch-message-dialog/branch-message-dialog.component';

@Component({
  selector: 'app-branch-add-dialog',
  templateUrl: './branch-add-dialog.component.html',
  styleUrls: ['./branch-add-dialog.component.css']
})
export class BranchAddDialogComponent implements OnInit {

  branches: CodeValue[];
  countries: CodeValue[];
  regions: CodeValue[];
  selectedRegion: any;
  selectedBranch: any;
  selectedCountry: any;
  checked: boolean ;
  labelAlign: string ;
  disabled: boolean;

  formControl  = new FormControl('', [Validators.required]);
  constructor(public addDiaglog: MatDialogRef<BranchAddDialogComponent>, public msgDiaglog: MatDialogRef<BranchMessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA)public data: Branch, public dialog: MatDialog,
    public dataService: BranchService) {
      this.checked = true;
      this.labelAlign = 'before';
      this.disabled = false;
      data.activeStatus = 'Y';
    }

  ngOnInit() {
    this.getAllBranchCodes('003');
    this.getAllCountryCodes('301');
    this.getAllRegionCodes('002');
  }

  getErrorMessage(msg: string) {
      return this.formControl.hasError('required') ? 'Required Field: ' + msg : '';
  }

  submit() {

  }

  onNoClick(): void {
    this.addDiaglog.close();
  }

  public confirmAdd(): void {
     console.log('comfirmAdd');
    console.log('data', this.data);
    console.log('selectedBranch', this.selectedBranch);
    console.log('selectedCountry', this.selectedCountry);
    this.data.branchCode = this.selectedBranch.codeValue;
    this.data.branchDesc = this.selectedBranch.shortDesc;
    this.data.country = this.selectedCountry;
    this.data.region = this.selectedRegion;
     this.dataService.addBranch(this.data, this.addDiaglog);
    //      .subscribe(data => {
    //     console.log(data);
    //     this.data = data;  // there is no variable data in your component
    //     this.msgDiaglog = this.dialog.open(BranchMessageDialogComponent, {
    //       data: {brn: data}
    //     });
    //   });
  }

  /**Get Data From  Code API.  */
  getAllBranchCodes(code_id: string): void {
    this.dataService.getAllBranchCodes(code_id).subscribe(b => {
       this.branches = b;
    });
  }

  /**Get Data From  Code API.  */
  getAllCountryCodes(code_id: string): void {
    this.dataService.getAllBranchCodes(code_id).subscribe(c => {
       this.countries = c;
    });
  }

  /**Get Data From  Code API.  */
  getAllRegionCodes(code_id: string): void {
    this.dataService.getAllBranchCodes(code_id).subscribe(r => {
       this.regions = r;
    });
  }

  branchCodeChangeAction() {
    console.log('Drop Down On Change Selection');
 }

 countryCodeChangeAction() {
    console.log('Drop Down On Change Selection');
 }

 regionCodeChangeAction() {
    console.log('Drop Down On Change Selection' );
 }

  // On Change Event of CheckBox
 OnChange($event) {
  this.data.activeStatus = $event.checked ? 'Y' : 'N';
  console.log('In OnChange', this.data);
 }

}
