import { Component, OnInit } from '@angular/core';
import { WeeklyPolicy } from '../../model/weeklypolicy.mode';
import { MatSnackBarComponent } from '../mat-snack-bar/mat-snack-bar.component';
import { HolidayService } from '../../service/holiday/holiday.service';
import { first, tap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { WorkingDay } from '../../model/workingday.model';

@Component({
  selector: 'app-week-mask',
  templateUrl: './week-mask.component.html',
  styleUrls: ['./week-mask.component.css']
})
export class WeekMaskComponent implements OnInit {
    policy : WeeklyPolicy = new WeeklyPolicy();

     exampleDatabase: HolidayService | null;

     tmp: boolean = false;
     workingDay: WorkingDay = new WorkingDay();
     shortDate: string = '';

  constructor(public httpClient: HttpClient, public holidayService: HolidayService, private snackBar: MatSnackBarComponent) { }

  ngOnInit() {
      this.loadData();
  }

  updatePolicy() {
        this.exampleDatabase.getWorkingDayLive().pipe(first())
        .subscribe(
          data => {
              this.workingDay = data;
          },
          error => {
            this.snackBar.openSnackBar(error.name, 'close', 'red-snackbar');
          });
          this.exampleDatabase.updatePolicy(this.policy).pipe(first())
        .subscribe(
          data => {
              this.policy = data;
          },
          error => {
            this.snackBar.openSnackBar(error.name, 'close', 'red-snackbar');
          });


    }

    public loadData() {
        this.exampleDatabase = new HolidayService(this.httpClient, this.snackBar, null);
        this.policy = this.exampleDatabase.getWorkingPolicy();
        this.workingDay = this.exampleDatabase.getWorkingDay();
    }

}
