import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { JobOffers } from "src/app/models/jobOffers.model";

@Component({
    selector: 'job-details-dialog',
    templateUrl: 'job-details-dialog.html',
  })
  export class JobDetailsDialog {
    jobDetails: JobOffers;
    constructor(private dialogRef: MatDialogRef<JobDetailsDialog>,
      @Inject(MAT_DIALOG_DATA) data){
        this.jobDetails = data;
      }
  }