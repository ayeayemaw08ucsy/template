import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule, MatCardModule, MatDialogModule, MatInputModule, MatTableModule,
    MatMenuModule, MatProgressSpinnerModule, MAT_DATE_LOCALE
} from '@angular/material';

@NgModule({
    imports: [
        CommonModule,
        MatSidenavModule,
        MatToolbarModule,
        MatIconModule,
        MatListModule,
        MatToolbarModule,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        MatDialogModule,
        MatTableModule,
        MatMenuModule,
        MatIconModule,
        MatProgressSpinnerModule
    ],
    exports: [
        CommonModule,
        MatSidenavModule,
        MatToolbarModule,
        MatIconModule,
        MatListModule,
        MatToolbarModule,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        MatDialogModule,
        MatTableModule,
        MatMenuModule,
        MatIconModule,
        MatProgressSpinnerModule
    ],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    ],
})
export class MaterialModule { }