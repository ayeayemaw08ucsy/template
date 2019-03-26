import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ResetPassword } from '../../../model/resetpassword.model';
import { UserService } from '../../../service/user/user.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

    data = new ResetPassword();

  constructor(public dialogRef: MatDialogRef<ResetPasswordComponent>,
        public dataService: UserService) { }

    formControl = new FormControl('', [
        Validators.required
    ]);

    ngOnInit() {
    }

    getErrorMessage() {
        return this.formControl.hasError('required') ? 'Required field' : '';
    }

    submit() {
        // emppty stuff
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    public confirmAdd(): void {
        this.dataService.addResetPassword(this.data, this.dialogRef);
    }

}
