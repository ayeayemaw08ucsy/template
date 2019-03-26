import { Component, OnInit } from '@angular/core';
import { User } from '../../../model/user.model';
import { CodeValue } from '../../../model/codevalue.model';
import { FormControl, Validators, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { UserService } from '../../../service/user/user.service';
import { Router } from '@angular/router';
import { UserMatrix } from '../../../model/usermatrix.model';
import { UserLimit } from '../../../model/UserLimit.model';
import { MessageService } from '../../../service/common/message.service';

@Component({
    selector: 'app-add-user',
    templateUrl: './add-user.component.html',
    styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
    limits: UserLimit[];
    selectedLimit: any;

    roles: CodeValue[];
    selectedRole: any;

    groups: UserMatrix[];
    selectedGroup: any;

    branchs: CodeValue[];
    selectedBranch: any;

    depts: CodeValue[];
    selectedDept: any;

    genders: CodeValue[];
    selectedGender: any;

    functions: any[];

    selectedFunctions: any;

    form: FormGroup;

    temp: any;

    data: User = new User();
    myForm: FormGroup;
    constructor(public dataService: UserService, public fb: FormBuilder, private router: Router, private messageService: MessageService) { }

    formControl = new FormControl('', [
        Validators.required,
        Validators.email,
    ]);

    ngOnInit() {
        this.getAllLimitCodes();
        this.getAllRoleCodes('026');
        this.getAllGroupCodes();
        this.getAllBranchCodes('003');
        this.getAllGenderCodes('031');
        this.getAllDeptCodes('004');
        this.getAllFunctionCodes('027');
        this.myForm = this.fb.group({
            codeValueList: this.fb.array([])
        });

    }

    listUser() {
        this.router.navigate(['user-list']);
    }

    onChange(event) {
        const codeFormArray = <FormArray>this.myForm.controls.codeValueList;

        if (event.checked) {
            codeFormArray.push(new FormControl(event.source.value));
        } else {
            const index = codeFormArray.controls.findIndex(x => x.value === event.source.value);
            codeFormArray.removeAt(index);
        }
    }

    addNew() {
        this.messageService.clearErrorMessage();
        this.data.codeValueList = this.myForm.value;
        this.data.branchCode = this.selectedBranch;
        this.data.groupCode = this.selectedGroup;
        this.data.gender = this.selectedGender;
        this.data.userRole = this.selectedRole;
        this.data.deptCode = this.selectedDept;
        this.data.levelCode = this.selectedLimit;
        this.dataService.addUser(this.data);
    }

    getErrorMessage() {
        return this.formControl.hasError('required') ? '*' : '';
    }

    getAllRoleCodes(code_id: string): void {
        this.dataService.getAllRoleCodes(code_id).subscribe(l => {
            this.roles = l;
        });
    }

    getAllLimitCodes(): void {
        this.dataService.getAllLimitCodes().subscribe(l => {
            this.limits = l;
        });
    }

    getAllGroupCodes(): void {
        this.dataService.getAllGroupCodes().subscribe(l => {
            this.groups = l;
        });
    }

    getAllBranchCodes(code_id: string): void {
        this.dataService.getAllBranchCodes(code_id).subscribe(l => {
            this.branchs = l;
        });
    }

    getAllDeptCodes(code_id: string): void {
        this.dataService.getAllScreenCodes(code_id).subscribe(l => {
            this.depts = l;
        });
    }

    getAllGenderCodes(code_id: string): void {
        this.dataService.getAllGenderCodes(code_id).subscribe(l => {
            this.genders = l;
        });
    }

    getAllFunctionCodes(code_id: string): void {
        this.dataService.getAllFunctionCodes(code_id).subscribe(l => {
            this.functions = l;
        });
    }

     generatePassword() {
        this.data.password = Math.random().toString(36).slice(-8);
        console.log(this.data.password);
    }

}
