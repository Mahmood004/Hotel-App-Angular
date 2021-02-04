import { Component, ViewChild, ElementRef } from "@angular/core";
import { MatDialogRef } from "@angular/material";
import { AdService } from "./ad.servis";
import { forkJoin } from "rxjs";

@Component({
    selector: 'app-dialog',
    template: `
        <input type="file" #fileInput style="display: none;" (change)="onFilesAdded()" />
        <div class="container" fxLayout="column" fxLayoutAlign="space-evenly stretch">
            <h1 mat-dialog-title>Upload</h1>
            <div>
                <button 
                    [disabled]="uploading" 
                    mat-raised-button
                    color="primary"
                    class="add-files-btn"
                    (click) = "addFiles()"
                >Add Files
                </button>
            </div>

            <mat-dialog-content fxFlex>
                <mat-list>
                    <mat-list-item 
                        *ngFor="let file of files"
                    >
                        <h4>{{ file.name }}</h4>
                        <mat-progress-bar
                            *ngIf="progress"
                            mode="deterministic"
                            [value]="progress[file.name].progress | async"
                        >
                        </mat-progress-bar>
                    </mat-list-item>
                </mat-list>
            </mat-dialog-content>

            <mat-dialog-actions class="actions">
                <button *ngIf="showCancelButton" mat-button mat-dialog-close>Cancel</button>
                <button [disabled]="!canBeClosed" mat-raised-button color="primary" (click)="closeDialog()">{{ primaryButtonText }}</button>
            </mat-dialog-actions>
        </div>
    `,
    styles: [`
        .add-files-btn {
            float: right;
        }
      
        .actions {
            justify-content: flex-end;
        }
      
        .container {
            height: 100%;
        }
    `]
})

export class DialogComponent {

    @ViewChild('fileInput') fileInput: ElementRef;
    progress;
    canBeClosed = true;
    primaryButtonText = 'Upload';
    showCancelButton = true;
    uploading = false;
    uploadSuccessful = false;

    files: Set<File> = new Set();

    constructor(private dialogRef: MatDialogRef<DialogComponent>, private adService: AdService) {}

    addFiles() {
        this.fileInput.nativeElement.click();
    }

    onFilesAdded() {
        const files: { [key: string]: File } = this.fileInput.nativeElement.files;

        for (let key in files) {
            if (!isNaN(parseInt(key))) {
                this.files.add(files[key]);
            }
        }
    }

    closeDialog() {
        if (this.uploadSuccessful) {
            return this.dialogRef.close();
        }

        this.uploading = true;
        this.progress = this.adService.upload(this.files);

        let allProgressObservables = [];
        for (let key in this.progress) {
            allProgressObservables.push(this.progress[key].progress);
        }

        this.primaryButtonText = 'Finish';
        this.canBeClosed = false;
        this.dialogRef.disableClose = true;
        this.showCancelButton = false;

        forkJoin(allProgressObservables).subscribe(
            end => {
                this.canBeClosed = true;
                this.dialogRef.disableClose = false;
                this.uploadSuccessful = true;
                this.uploading = false;
            }
        )

    }
}