import { Component, OnInit ,Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DepreciationpolicysetupService } from 'src/app/service/depreciationpolicysetup/depreciationpolicysetup.service';

@Component({
  selector: 'app-depreciationpolicy-delete-dialog',
  templateUrl: './depreciationpolicy-delete-dialog.component.html',
  styleUrls: ['./depreciationpolicy-delete-dialog.component.css']
})
export class DepreciationpolicyDeleteDialogComponent implements OnInit {

  
  constructor(public dialogRef: MatDialogRef<DepreciationpolicyDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public dataService: DepreciationpolicysetupService) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete() {
    console.log('Confirm Delete',this.data)
    console.log(this.data.id);
    this.dataService.deleteDepreciationPolicyTnx(this.data.id);
  }

}
