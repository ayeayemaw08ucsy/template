import { Component, OnInit ,Inject, Input } from '@angular/core';
import { CodesetupService } from 'src/app/service/codesetup/codesetup.service';
import { Code } from '../../../../model/code.model'; 
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-code-selectvaluebinding',
  templateUrl: './code-selectvaluebinding.component.html',
  styleUrls: ['./code-selectvaluebinding.component.css']
})
export class CodeSelectvaluebindingComponent implements OnInit {

  codes: Code[];
  @Input() selectedCode: Code;

  constructor(@Inject(MAT_DIALOG_DATA)public data: Code,private codeService: CodesetupService) { }

  ngOnInit() {
    this.getAllCodes();
  }
  
  /**Get Data From  Code API.  */
  getAllCodes():void {
    this.codeService.getAllCodes().subscribe(data => {
        this.codes = data;
    })
  }
  
  codeIdChangeAction(code) {
      console.log("Drop Down On Change Selection"+code);
   }
}
