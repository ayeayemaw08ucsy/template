import { Component, OnInit , Inject, Input } from '@angular/core';
import { BranchService } from 'src/app/service/branch/branch.service';
import { Branch } from '../../../../model/branch.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CodeValue } from '../../../../model/codevalue.model';

@Component({
  selector: 'app-branch-binding',
  templateUrl: './branch-binding.component.html',
  styleUrls: ['./branch-binding.component.css']
})
export class BranchBindingComponent implements OnInit {

  branches: CodeValue[];
  @Input() selectedCode: CodeValue;

  constructor(@Inject(MAT_DIALOG_DATA)public data: Branch, private branchService: BranchService) { }

  ngOnInit() {
    this.getAllBranchCodes('003');
  }

  /**Get Data From  Code API.  */
  getAllBranchCodes(code_id: string): void {
    this.branchService.getAllBranchCodes(code_id).subscribe(b => {
       this.branches = b;
    });
  }

  branchCodeChangeAction(branch) {
      console.log('Drop Down On Change Selection' + branch);
  }

}
