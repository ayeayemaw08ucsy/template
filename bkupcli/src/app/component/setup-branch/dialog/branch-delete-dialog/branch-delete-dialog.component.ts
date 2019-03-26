import { Component, OnInit , Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BranchService} from 'src/app/service/branch/branch.service';
import { CodeValue } from '../../../../model/codevalue.model';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-branch-delete-dialog',
  templateUrl: './branch-delete-dialog.component.html',
  styleUrls: ['./branch-delete-dialog.component.css']
})
export class BranchDeleteDialogComponent implements OnInit {

  selectedCountry: any;
  selectedRegion: any;
  constructor(public dialogRef: MatDialogRef<BranchDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public dataService: BranchService) {
      this.selectedCountry = data.country;
      this.selectedRegion = data.region;
    }

  formControl = new FormControl('', [Validators.required]);
  ngOnInit() {
    // this.getAllCountryCodes('301');
    // this.getAllRegionCodes('002');
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete() {
    this.dataService.removeBranch(this.data.branchSeqId, this.dialogRef);
  }

  // getAllCountryCodes(code_id: string): void {
  //   this.dataService.getAllBranchCodes(code_id).subscribe(c => {
  //      this.countries = c;
  //      console.log('countries ', this.countries);
  //   });
  // }

  // getAllRegionCodes(code_id: string): void {
  //   this.dataService.getAllBranchCodes(code_id).subscribe(c => {
  //      this.regions = c;
  //      console.log('regions ', this.regions);
  //   });
  // }

  submit() {
  }
}
