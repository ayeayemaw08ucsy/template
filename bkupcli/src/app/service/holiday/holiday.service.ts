import { Holiday } from 'src/app/model/holiday.model';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MatSnackBarComponent } from '../../component/mat-snack-bar/mat-snack-bar.component';
import { Injectable } from '@angular/core';
import { WeeklyPolicy } from '../../model/weeklypolicy.mode';
import { map, catchError } from 'rxjs/operators';
import { WorkingDay } from '../../model/workingday.model';
import { ApiError } from '../../model/apierror.model';
import { MatDialogRef } from '@angular/material';
import { AddDialogComponent } from '../../dialog/add-dialog/add-dialog.component';
import { EditDialogComponent } from '../../dialog/edit-dialog/edit-dialog.component';
import { MessageService } from '../common/message.service';
import { errormessage } from 'src/environments/errormessage';
const BASE_URL = environment.baseUrl;
const HOLIDAY_CAL_ADDEDED=errormessage.added;
const HOLIDAY_CAL_EDITED=errormessage.edited;
const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',

    })
};

@Injectable({
    providedIn: 'root'
})
export class HolidayService {
    dataChange: BehaviorSubject<Holiday[]> = new BehaviorSubject<Holiday[]>([]);

    businessDataChange: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
    // Temporarily stores data from dialogs
    dialogData: any;

    policyData: WeeklyPolicy = new WeeklyPolicy();

    workingData: WorkingDay = new WorkingDay();

    accessToken: string;


    constructor(private httpClient: HttpClient, private snackBar: MatSnackBarComponent, public messageService: MessageService) { }


    get data(): Holiday[] {
        return this.dataChange.value;
    }

    get businessData(): string[] {
        return this.businessDataChange.value;
    }

    getDialogData() {
        return this.dialogData;
    }

    getAllBusinessDays(): void {
        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
        this.httpClient.get<string[]>(`${BASE_URL}/holidays/business-date?access_token=${this.accessToken}`).subscribe(data => {
            this.businessDataChange.next(data);
        },
            (err: ApiError) => {
                this.snackBar.openSnackBar(err.error.message, 'close', 'red-snackbar');
            });
    }

    getWorkingPolicy(): WeeklyPolicy {
        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
        this.httpClient.get<WeeklyPolicy>(`${BASE_URL}/weekly-policys/weekly-policy?access_token=${this.accessToken}`).subscribe(data => {
            this.policyData.id = data.id;
            this.policyData.monday = data.monday;
            this.policyData.tuesday = data.tuesday;
            this.policyData.wednesday = data.wednesday;
            this.policyData.thursday = data.thursday;
            this.policyData.friday = data.friday;
            this.policyData.saturday = data.saturday;
            this.policyData.sunday = data.sunday;
        },
            (err: ApiError) => {
                this.snackBar.openSnackBar(err.error.message, 'close', 'red-snackbar');
            });
        return this.policyData;
    }

    getWorkingDay(): WorkingDay {
        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
        this.httpClient.get<WorkingDay>(`${BASE_URL}/holidays/working-day?access_token=${this.accessToken}`).subscribe(data => {
            this.workingData.current = data.current;
            this.workingData.next = data.next;
            this.workingData.previous = data.previous;
        },
            (err: ApiError) => {
                this.snackBar.openSnackBar(err.error.message, 'close', 'red-snackbar');
            });
        return this.workingData;
    }

    getWorkingDayLive(): Observable<WorkingDay> {
        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
        return this.httpClient.get<WorkingDay>(`${BASE_URL}/holidays/working-day?access_token=${this.accessToken}`).pipe(
            map((res: this, extractData) => {
                //this.snackBar.openSnackBar(HOLIDAY_CAL_EDITED, 'Close', 'green-snackbar');
                return new WorkingDay(res);
            }),
            catchError(this.handleError<WorkingDay>(`Working Day`))

        );

    }

    /** CRUD METHODS */
    getAllHolidays(): void {
        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
        this.httpClient.get<Holiday[]>(`${BASE_URL}/holidays/holiday?access_token=${this.accessToken}`).subscribe(data => {
            this.dataChange.next(data);
        },
            (err: ApiError) => {
                this.snackBar.openSnackBar(err.error.message, 'close', 'red-snackbar');
            });

    }

    addHoliday(holiday: Holiday, dialogRef: MatDialogRef<AddDialogComponent>): void {
        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
        this.httpClient.post<Holiday>(`${BASE_URL}/holidays/holiday?access_token=${this.accessToken}`, holiday).subscribe(data => {
            this.dialogData = holiday;
            this.snackBar.openSnackBar(HOLIDAY_CAL_ADDEDED, 'Close', 'green-snackbar');
            dialogRef.close();
        },
            (err: ApiError) => {
                this.messageService.addErrMessage(err.error.message);
            });

    }

    updateHoliday(holiday: Holiday, dialogRef: MatDialogRef<EditDialogComponent>): void {
        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
        this.httpClient.put(`${BASE_URL}/holidays/holiday/${holiday.id}?access_token=${this.accessToken}`, holiday).subscribe(data => {
            this.snackBar.openSnackBar(HOLIDAY_CAL_EDITED, 'Close', 'green-snackbar');
            dialogRef.close();
        },
            (err: ApiError) => {
                this.messageService.addErrMessage(err.error.message);
            });
    }

    updatePolicy(weeklyPolicy: WeeklyPolicy): Observable<WeeklyPolicy> {
        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
        return this.httpClient.put<WeeklyPolicy>(`${BASE_URL}/weekly-policys/weekly-policy?access_token=${this.accessToken}`, weeklyPolicy, httpOptions).pipe(
            map((res: this, extractData) => {
                this.snackBar.openSnackBar(HOLIDAY_CAL_EDITED, 'Close', 'green-snackbar');
                return new WeeklyPolicy(res);
            }),
            catchError(this.handleError<WeeklyPolicy>(`Update WeeklyPolicy`))

        );
        console.log("weekpolucsdf");
    }

    private handleError<T>(operation = 'operation', result?: T) {

        return (error: any): Observable<T> => {
            console.error(error);

            return of(result as T);

        }

    }

    deleteHoliday(id: number): void {
        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
        this.httpClient.delete(`${BASE_URL}/holidays/holiday/${id}?access_token=${this.accessToken}`).subscribe(data => {
            this.snackBar.openSnackBar('Successfully deleted', 'close', 'green-snackbar');
        },
            (err: ApiError) => {
                this.snackBar.openSnackBar(err.message, 'close', 'red-snackbar');
            }
        );
    }

}
