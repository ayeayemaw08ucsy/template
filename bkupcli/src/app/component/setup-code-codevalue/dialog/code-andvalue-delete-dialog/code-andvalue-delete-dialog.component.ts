import { Component, OnInit ,Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CodesetupService} from 'src/app/service/codesetup/codesetup.service';

@Component({
  selector: 'app-code-andvalue-delete-dialog',
  templateUrl: './code-andvalue-delete-dialog.component.html',
  styleUrls: ['./code-andvalue-delete-dialog.component.css']
})
export class CodeAndvalueDeleteDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<CodeAndvalueDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public dataService: CodesetupService) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete() {
    this.dataService.deleteCodeAndValue(this.data.id);
  }
}
