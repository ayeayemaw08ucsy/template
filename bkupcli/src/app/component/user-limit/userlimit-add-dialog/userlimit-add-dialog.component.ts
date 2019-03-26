import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserLimit } from '../../../model/UserLimit.model';
import { UserlimitService } from '../../../service/userlimit/userlimit.service';
import { FormControl, Validators } from '@angular/forms';
import { CodeValue } from '../../../model/codevalue.model';
import { MessageService } from 'src/app/service/common/message.service';

@Component({
    selector: 'app-userlimit-add-dialog',
    templateUrl: './userlimit-add-dialog.component.html',
    styleUrls: ['./userlimit-add-dialog.component.css']
})
export class UserlimitAddDialogComponent implements OnInit {
    limits: CodeValue[];
    selectedLimit: any;
    constructor(public dialogRef: MatDialogRef<UserlimitAddDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: UserLimit,
        public dataService: UserlimitService, private messageService: MessageService) { this.selectedLimit = data.levelCode; }

    formControl = new FormControl('', [
        Validators.required,
        Validators.min(0)
    ]);

    ngOnInit() {
        this.getAllLimitCodes('028');
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
        this.messageService.clearErrorMessage();
        this.data.levelCode = this.selectedLimit.codeValue;
        this.data.codeDesc = this.selectedLimit.shortDesc;
        this.dataService.addUserLimit(this.data, this.dialogRef);
    }

    getAllLimitCodes(code_id: string): void {
        this.dataService.getAllLimitCodes(code_id).subscribe(l => {
            this.limits = l;
        });
    }
}
