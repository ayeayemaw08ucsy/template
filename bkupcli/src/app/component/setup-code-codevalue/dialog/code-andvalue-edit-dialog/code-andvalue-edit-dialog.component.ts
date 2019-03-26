import { Component, OnInit , Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CodesetupService} from 'src/app/service/codesetup/codesetup.service';
import { FormControl, Validators } from '@angular/forms';
import { MessageService } from 'src/app/service/common/message.service';


@Component({
  selector: 'app-code-andvalue-edit-dialog',
  templateUrl: './code-andvalue-edit-dialog.component.html',
  styleUrls: ['./code-andvalue-edit-dialog.component.css']
})
export class CodeAndvalueEditDialogComponent implements OnInit {

  IsChecked:boolean ;
  LabelAlign:string ;
  IsDisabled:boolean;
  
  constructor(public dialogRef: MatDialogRef<CodeAndvalueEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public dataService: CodesetupService ,public messageService: MessageService) {
      this.IsChecked = data.codeValUpdateFlag === 'Y' ? true : false;
      this.messageService.clearErrorMessage();
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

    console.log('CodeValue Edit Data',this.data);
      //  this.dataService.updateCodeAndValue(this.data , this.dialogRef);
      this.dataService.updateCodeValueTnx(this.data, this.dialogRef);
}

 //On Change Event of CheckBox
 OnChange($event){
  this.data.codeValUpdateFlag = $event.checked ? 'Y' :'N';
 
}

}
