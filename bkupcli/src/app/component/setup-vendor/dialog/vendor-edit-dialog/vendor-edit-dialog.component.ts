import { Component, OnInit , Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { VendorService} from 'src/app/service/vendor/vendor.service';
import { FormControl, Validators } from '@angular/forms';
import { CodeValue } from '../../../../model/codevalue.model';

@Component({
  selector: 'app-vendor-edit-dialog',
  templateUrl: './vendor-edit-dialog.component.html',
  styleUrls: ['./vendor-edit-dialog.component.css']
})
export class VendorEditDialogComponent implements OnInit {

    selectedCountry: any;
    countries: CodeValue[];
    bsnDate: any = '';
    checked: boolean ;
    labelAlign: string ;
    disabled: boolean;

    constructor(public dialogRef: MatDialogRef<VendorEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public dataService: VendorService) {
      this.selectedCountry = data.country;
      this.bsnDate = data.businessDate;
      this.labelAlign = 'before';
      this.disabled = false;
      console.log('status', data.activeStatus);
      if (data.activeStatus === 'Y') {
        this.checked = true;
      } else {
        this.checked = false;
      }
     }


      formControl = new FormControl('', [
      Validators.required
      // Validators.email,
      ]);

    ngOnInit() {
       this.getAllCountryCodes('301');
    }

    getErrorMessage() {
      return this.formControl.hasError('required') ? 'Required field' : this.formControl.hasError('email') ? 'Not a valid email' : '';
    }

    submit() {
      // emppty stuff
    }

    onNoClick(): void {
      this.dialogRef.close();
    }

    stopEdit(): void {
      console.log('service ');
      this.data.country = this.selectedCountry;
      this.data.businessDate = this.bsnDate;
      console.log('bns date ', this.data.bsnDate);
      console.log('data', this.data);
      this.dataService.updateVendor(this.data, this.dialogRef);
    }

     /**Get Data From  Code API.  */
  getAllCountryCodes(code_id: string): void {
    this.dataService.getAllVendorCodes(code_id).subscribe(c => {
       this.countries = c;
       console.log('countries ', this.countries);
    });
  }

  countryCodeChangeAction() {
    console.log('Drop Down On Change Selection');
 }

 // On Change Event of CheckBox
 OnChange($event) {
  this.data.activeStatus = $event.checked ? 'Y' : 'N';
  console.log('In OnChange', this.data);
 }
}
