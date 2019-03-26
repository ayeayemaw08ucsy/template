import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { User } from '../../../model/user.model';
import { Observable, BehaviorSubject, fromEvent, merge } from 'rxjs';
import { DataSource } from '@angular/cdk/table';
import { UserService } from '../../../service/user/user.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { MatSnackBarComponent } from '../../mat-snack-bar/mat-snack-bar.component';
import { MessageService } from '../../../service/common/message.service';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
    selector: 'app-list-user',
    templateUrl: './list-user.component.html',
    styleUrls: ['./list-user.component.css']
})
export class ListUserComponent implements OnInit {

    displayedColumns = ['username', 'branch', 'role', 'dept', 'status', 'actions'];
    exampleDatabase: UserService | null;
    dataSource: ExampleDataSource | null;
    index: number;
    id: string;
    newUser: User;

    constructor(public httpClient: HttpClient,
        public dialog: MatDialog,
        public userService: UserService, private snackBar: MatSnackBarComponent,
        private messageService: MessageService, private router: Router) { }

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('filter') filter: ElementRef;

    ngOnInit() {
        this.messageService.clearErrorMessage();
        this.loadData();
        this.newUser = new User();
    }

    refresh() {
        this.loadData();
    }

    addNew() {
        this.router.navigate(['add-user']);
    }

    startEdit(user: User) {
        this.newUser.id = user.id;
        this.newUser.firstName = user.firstName;
        this.newUser.lastName = user.lastName;
        this.newUser.username = user.username;
        this.newUser.password = user.password;
        this.newUser.entity = user.entity;
        this.newUser.email = user.email;
        this.newUser.phone = user.phone;
        this.newUser.mobile = user.mobile;
        this.newUser.gender = user.gender;
        this.newUser.branchCode = user.branchCode;
        this.newUser.deptCode = user.deptCode;
        this.newUser.levelCode = user.levelCode;
        this.newUser.groupCode = user.groupCode;
        this.newUser.userRole = user.userRole;
        this.newUser.pwdExpiryDate = user.pwdExpiryDate;
        this.newUser.lastLoginFail = user.lastLoginFail;
        this.newUser.enabled = user.enabled;
        this.newUser.accountNonExpired = user.accountNonExpired;
        this.newUser.accountNonLocked = user.accountNonLocked;
        this.newUser.credentialsNonExpired = user.credentialsNonExpired;
        this.newUser.codeValueList = user.codeValueList;
        window.sessionStorage.setItem('user', JSON.stringify(this.newUser));
        window.sessionStorage.setItem('authorities', JSON.stringify(user));
        this.router.navigate(['edit-user']);
    }


    private refreshTable() {
        // Refreshing table using paginator
        // Thanks yeager-j for tips
        // https://github.com/marinantonio/angular-mat-table-crud/users/12
        this.paginator._changePageSize(this.paginator.pageSize);
    }



    public loadData() {
        this.exampleDatabase = new UserService(null, this.httpClient, this.snackBar, null, null);
        this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort);
        fromEvent(this.filter.nativeElement, 'keyup')
            // .debounceTime(150)
            // .distinctUntilChanged()
            .subscribe(() => {
                if (!this.dataSource) {
                    return;
                }
                this.dataSource.filter = this.filter.nativeElement.value;
            });
    }
}

export class ExampleDataSource extends DataSource<User> {
    _filterChange = new BehaviorSubject('');

    get filter(): string {
        return this._filterChange.value;
    }

    set filter(filter: string) {
        this._filterChange.next(filter);
    }

    filteredData: User[] = [];
    renderedData: User[] = [];

    constructor(public _exampleDatabase: UserService,
        public _paginator: MatPaginator,
        public _sort: MatSort) {
        super();
        // Reset to the first page when the user changes the filter.
        this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<User[]> {
        // Listen for any changes in the base data, sorting, filtering, or pagination
        const displayDataChanges = [
            this._exampleDatabase.dataChange,
            this._sort.sortChange,
            this._filterChange,
            this._paginator.page
        ];

        this._exampleDatabase.getAllUsers();


        return merge(...displayDataChanges).pipe(map(() => {
            // Filter data
            this.filteredData = this._exampleDatabase.data.slice().filter((user: User) => {
                const searchStr = (user.username + user.branchCode + user.gender + user.userRole + user.deptCode).toLowerCase();
                return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
            });

            // Sort filtered data
            const sortedData = this.sortData(this.filteredData.slice());

            // Grab the page's slice of the filtered sorted data.
            const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
            this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
            return this.renderedData;
        }
        ));
    }

    disconnect() { }


    /** Returns a sorted copy of the database data. */
    sortData(data: User[]): User[] {
        if (!this._sort.active || this._sort.direction === '') {
            return data;
        }

        return data.sort((a, b) => {
            let propertyA: number | string = '';
            let propertyB: number | string = '';

            switch (this._sort.active) {
                case 'username': [propertyA, propertyB] = [a.username.toLowerCase(), b.username.toLowerCase()]; break;
                case 'branch': [propertyA, propertyB] = [a.branchCode.toLowerCase(), b.branchCode.toLowerCase()]; break;
                case 'role': [propertyA, propertyB] = [a.userRole.toLowerCase(), b.userRole.toLowerCase()]; break;
                case 'dept': [propertyA, propertyB] = [a.deptCode.toLowerCase(), b.deptCode.toLowerCase()]; break;
            }

            const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
        });
    }
}
