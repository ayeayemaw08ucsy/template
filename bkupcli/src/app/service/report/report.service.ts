import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Report } from 'src/app/model/report.model';
import { ApiService } from 'src/app/core/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from '../common/message.service';
import { MatSnackBarComponent } from 'src/app/component/mat-snack-bar/mat-snack-bar.component';
import { ApiError } from 'src/app/model/apierror.model';
import { tap, catchError } from 'rxjs/operators';
import { FaGraph } from 'src/app/model/fagraph.model';
import { environment } from 'src/environments/environment';

const BASE_URL = environment.baseUrl;


const httpOptions = {
  headers: new HttpHeaders({
      'Content-Type': 'application/pdf',
  } ),
  responseType: 'blob'
};

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  dataChange: BehaviorSubject<Report[]> = new BehaviorSubject<Report[]>([]);

    // Temporarily stores data from dialogs
    dialogData: any;

    accessToken: string;

    faGraph: FaGraph = new FaGraph();

    constructor(private api: ApiService, private httpClient: HttpClient,
        private snackBar: MatSnackBarComponent, public messageService: MessageService) { }


    get data(): Report[] {
        return this.dataChange.value;
    }

    getDialogData() {
        return this.dialogData;
    }

    /** CRUD METHODS */
    getAllReports(): void {
        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
        this.httpClient.get<Report[]>(`${BASE_URL}/reports/report?access_token=${this.accessToken}`)
            .subscribe(data => {
                this.dataChange.next(data);
            },
                (error: ApiError) => {
                    this.snackBar.openSnackBar(error.error.message, 'close', 'red-snackbar');
                });

    }

    getReport(url: any): void {
      this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
      this.httpClient.post(`${BASE_URL}/reports/report/?access_token=${this.accessToken}`, url,  {observe: 'response', responseType: 'arraybuffer'})
          .subscribe(data => {
            var file = new Blob([data.body], {type: 'application/pdf'});
            var fileURL = URL.createObjectURL(file);
            window.open(fileURL);
          },
              (error: ApiError) => {
                  this.snackBar.openSnackBar(error.error.message, 'close', 'red-snackbar');
              });

  }

  getFaGraph(): FaGraph {
    this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
    this.httpClient.get<FaGraph>(`${BASE_URL}/reports/fa-graph?access_token=${this.accessToken}`)
        .subscribe(data => {
          this.faGraph.data = data.data;
          this.faGraph.labels = data.labels;
        },
            (error: ApiError) => {
                this.snackBar.openSnackBar(error.error.message, 'close', 'red-snackbar');
            });
            return this.faGraph;
    }

}
