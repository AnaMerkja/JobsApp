import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService } from '../../services/account.service';
import { AlertService } from '../../services/alert.service';
import { JobService } from 'src/app/services/job.service';
import { JobOffers } from 'src/app/models/jobOffers.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.scss']
})
export class CrudComponent implements OnInit {

  form: FormGroup;
  id: string;
  isAddMode: boolean;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService,
    private jobService: JobService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    this.form = this.formBuilder.group({
      jobTitle: ['', Validators.required],
      jobDescription: ['', Validators.required],
      deadlineDate: [this.datePipe.transform(new Date(), 'yyyy-MM-dd'), Validators.required],
      postDate: [this.datePipe.transform(new Date(), 'yyyy-MM-dd'), Validators.required],
      applicantsNo: [0],
      userId: [0],
      jobCategory: ['', Validators.required]
    });

    if (!this.isAddMode) {
      this.jobService.getById(this.id).pipe(first()).subscribe(x => {
        let data: JobOffers = x.data() as JobOffers;
        this.f.jobTitle.setValue(data.jobTitle);
        this.f.jobDescription.setValue(data.jobDescription);
        this.f.deadlineDate.setValue(this.datePipe.transform(data.deadlineDate, 'yyyy-MM-dd'));
        this.f.postDate.setValue(this.datePipe.transform(data.postDate, 'yyyy-MM-dd'));
        this.f.applicantsNo.setValue(data.applicantsNo);
        this.f.userId.setValue(data.userId);
        this.f.userId.setValue(data.userId);
        this.f.jobCategory.setValue(data.jobCategory);
      });
    }
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    //clear any alert
    this.alertService.clear();
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    if (this.isAddMode) {
      this.createJob();
    } else {
      this.updateJob();
    }
  }

  private createJob() {
    let job: JobOffers = {
      jobTitle: this.f.jobTitle.value,
      jobDescription: this.f.jobDescription.value,
      jobid: 0,
      postDate: this.f.postDate.value,
      deadlineDate: this.f.deadlineDate.value,
      username: this.accountService.userValue.displayName,
      userId: this.accountService.userValue.uid,
      applicantsNo: this.f.applicantsNo.value,
      jobCategory: this.f.jobCategory.value
    };
    this.jobService.create(job)
      .then(
        data => {
          this.alertService.success('Job added successfully', { keepAfterRouteChange: true });
          this.router.navigate(['.', { relativeTo: this.route }]);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

  private updateJob() {
    let job: JobOffers = {
      jobTitle: this.f.jobTitle.value,
      jobDescription: this.f.jobDescription.value,
      jobid: 0,
      postDate: this.f.postDate.value,
      deadlineDate: this.f.deadlineDate.value,
      username: this.accountService.userValue.displayName,
      userId: this.accountService.userValue.uid,
      applicantsNo: this.f.applicantsNo.value,
      jobCategory: this.f.jobCategory.value
    };
    this.jobService.update(this.id, job)
      .then(
        data => {
          this.alertService.success('Update successful', { keepAfterRouteChange: true });
          this.router.navigate(['..', { relativeTo: this.route }]);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

}



