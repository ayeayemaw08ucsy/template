import { Component, OnInit , Inject} from '@angular/core';
import { CodesetupService} from 'src/app/service/codesetup/codesetup.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { MessageService } from 'src/app/service/common/message.service';

@Component({
  selector: 'app-code-andvalue-approve-dialog',
  templateUrl: './code-andvalue-approve-dialog.component.html',
  styleUrls: ['./code-andvalue-approve-dialog.component.css']
})
export class CodeAndvalueApproveDialogComponent implements OnInit {
  IsChecked:boolean ;
  LabelAlign:string ;
  IsDisabled:boolean;
  
  constructor(public dialogRef: MatDialogRef<CodeAndvalueApproveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public dataService: CodesetupService ,public messageService: MessageService) {
      this.IsChecked = data.codeValUpdateFlag === 'Y' ? true : false;
      this.messageService.clearErrorMessage();
      this.IsDisabled = true;
     }

    ngOnInit() {
    }

formControl = new FormControl('', [
  Validators.required
  // Validators.email,
]);

getErrorMessage() {
  return this.formControl.hasError('required') ? 'Required field' :
      this.formControl.hasError('email') ? 'Not a valid email' : '';
}

submit() {
  // emppty stuff
}

onNoClick(): void {
  this.dialogRef.close();
}

  stopEdit(): void {
        this.dataService.updateCodeAndValue(this.data , this.dialogRef);
}

 //On Change Event of CheckBox
 OnChange($event){
  this.data.codeValUpdateFlag = $event.checked ? 'Y' :'N';
 
}

/**
 * 
 */
startApprove() {
   this.dataService.approve(this.data,this.dialogRef);
}
}
