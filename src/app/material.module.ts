import { NgModule } from "@angular/core";
import { 
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    MatDialogModule,
    MatProgressBarModule,
    MatListModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    
} 
from '@angular/material';

@NgModule({
    imports: [
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatChipsModule,
        MatIconModule,
        MatDialogModule,
        MatProgressBarModule,
        MatListModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatToolbarModule,
        MatSnackBarModule,
        MatProgressSpinnerModule
    ],
    exports: [
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatChipsModule,
        MatIconModule,
        MatDialogModule,
        MatProgressBarModule,
        MatListModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatToolbarModule,
        MatSnackBarModule,
        MatProgressSpinnerModule
    ]
})

export class MaterialModule {}