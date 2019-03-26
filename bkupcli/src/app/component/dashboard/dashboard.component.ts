import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/service/report/report.service';
import { HttpClient } from '@angular/common/http';
import { MatSnackBarComponent } from '../mat-snack-bar/mat-snack-bar.component';
import { first } from 'rxjs/operators';
import { FaGraph } from 'src/app/model/fagraph.model';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    public chartType = 'bar';

    public chartType1 = 'doughnut';

    public chartType2 = 'pie';

    public chartType3 = 'line';

    exampleDatabase: ReportService | null;

    data: FaGraph = new FaGraph();


    public chartDatasets: Array<any> = [{data: [65, 59, 80, 81, 56, 55, 40], label: 'My First dataset'}];

    public chartLabels: Array<any> = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'];

    public chartColors: Array<any> = [
        {
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 2,
        }
    ];

    public chartOptions: any = {
        responsive: true
    };
    public chartClicked(e: any): void { }
    public chartHovered(e: any): void { }


    constructor(public httpClient: HttpClient, public holidayService: ReportService, private snackBar: MatSnackBarComponent) { 
        
    }

    ngOnInit() {
        this.exampleDatabase = new ReportService(null, this.httpClient, this.snackBar, null);
        this.data = this.exampleDatabase.getFaGraph();
        console.log(this.data);
    }
    

}
