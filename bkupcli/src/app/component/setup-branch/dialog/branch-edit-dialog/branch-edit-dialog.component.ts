import { Component, OnInit , Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { BranchService} from 'src/app/service/branch/branch.service';
import { FormControl, Validators } from '@angular/forms';
import { CodeValue } from '../../../../model/codevalue.model';

@Component({
  selector: 'app-branch-edit-dialog',
  templateUrl: './branch-edit-dialog.component.html',
  styleUrls: ['./branch-edit-dialog.component.css']
})
export class BranchEditDialogComponent implements OnInit {

    countries: CodeValue[];
    regions: CodeValue[];
    selectedCountry: any;
    selectedRegion: any;
    bnsDate: any = '';
    checked: boolean ;
    labelAlign: string ;
    disabled: boolean;
  constructor(public dialogRef: MatDialogRef<BranchEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public dataService: BranchService) {
        this.selectedCountry = data.country;
        this.selectedRegion = data.region;
        console.log('c r', data.region, data.country);
        this.bnsDate = data.businessDate;
        this.labelAlign = 'before';
        this.disabled = false;
        console.log('status', data.activeStatus);
        if (data.activeStatus === 'Y') {
          this.checked = true;
        } else {
          this.checked = false;
        }
    }


    formControl = new FormControl('', [Validators.required]);

    ngOnInit() {
        this.getAllCountryCodes('301');
        this.getAllRegionCodes('002');
    }

    getErrorMessage() {
        return this.formControl.hasError('required') ? 'Required field' :
        this.formControl.hasError('email') ? 'Not a valid email' :
        '';
    }

    submit() {
        // emppty stuff
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    stopEdit(): void {
        console.log('edit');
        this.data.country = this.selectedCountry;
        this.data.region = this.selectedRegion;
        this.data.businessDate = this.bnsDate;
        console.log('bns date ', this.bnsDate);
        console.log('this data ', this.data);
        this.dataService.updateBranch(this.data, this.dialogRef);
    }

    getAllCountryCodes(code_id: string): void {
    this.dataService.getAllBranchCodes(code_id).subscribe(c => {
       this.countries = c;
       console.log('countries ', this.countries);
    });
    }

    getAllRegionCodes(code_id: string): void {
    this.dataService.getAllBranchCodes(code_id).subscribe(c => {
       this.regions = c;
       console.log('regions ', this.regions);
    });
    }

    countryCodeChangeAction() {
        //console.log('Drop Down On Change Selection' + country);
    }

    regionCodeChangeAction() {
//console.log('Drop Down On Change Selection' + region);
    }

    // On Change Event of CheckBox
    OnChange($event) {
        this.data.activeStatus = $event.checked ? 'Y' : 'N';
        console.log('In OnChange', this.data);
    }
}
