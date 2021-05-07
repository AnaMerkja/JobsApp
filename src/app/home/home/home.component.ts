import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { first, map, startWith } from 'rxjs/operators';
import { JobOffers } from '../../models/jobOffers.model';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { User } from '../../models/user.model';
import { AccountService } from '../../services/account.service';
import { AlertService } from '../../services/alert.service';
import { JobService } from '../../services/job.service';
import { JobDetailsDialog } from '../dialog/job-details-dialog'

@Component({
    styleUrls: ['home.component.scss'],
    templateUrl: 'home.component.html'
})
export class HomeComponent implements OnInit {
    user: User;
    jobs: JobOffers[] = null;
    FilteredJobs: JobOffers[] = null;
    loading = false;

    visible = true;
    selectable = true;
    removable = true;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    jobCategoryCtrl = new FormControl();
    filteredCategories: Observable<string[]>;
    categories: string[];
    allJobCategories: string[] = ['Developer', 'Data Entry', 'QA', 'Designer', 'Business Analyst'];

    @ViewChild('jobInput') jobInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto') matAutocomplete: MatAutocomplete;
    constructor(private accountService: AccountService, private jobservice: JobService, private alertService: AlertService, public dialog: MatDialog) {
        this.user = this.accountService.userValue;
        this.categories = [this.user.jobProfile];
        this.filteredCategories = this.jobCategoryCtrl.valueChanges.pipe(
            startWith(null),
            map((category: string | null) => category ? this._filter(category) : this.allJobCategories.slice()));
    }

    ngOnInit() {
        //get all jobs
        this.jobservice.getAll()
            .pipe(first())
            .subscribe(job => {
                this.jobs = job.map(e => {
                    return {
                        id: e.payload.doc.id,
                        ...e.payload.doc.data() as JobOffers
                    };
                });
                this.FilteredJobs = this.jobs.filter(jp => jp.jobCategory === this.user.jobProfile.replace(/\s/g, ''))
            });
    }

    AddFavorite(jId) {
        let fav = {
            userId: this.accountService.userValue.uid,
            jobId: jId
        }
        this.jobservice.createFavorite(fav)
            .then(
                data => {
                    this.alertService.success('Job added successfully as favorite', { keepAfterRouteChange: true });
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    openDialog(id) {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        let data: JobOffers;
        this.jobservice.getById(id).pipe(first()).subscribe(x => {
            data = x.data() as JobOffers;
            dialogConfig.data = data;
            this.dialog.open(JobDetailsDialog, dialogConfig);
        });
    }
    //below methods are used for filtering jobs based on chips
    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.allJobCategories.filter(category => category.toLowerCase().indexOf(filterValue) === 0);
    }

    add(event: MatChipInputEvent): void {
        //filter data when type a new chip
        const input = event.input;
        const value = event.value;

        if ((value || '').trim()) {
            this.categories.push(value.trim());
        }
        if (input) {
            input.value = '';
        }
        this.jobCategoryCtrl.setValue(null);
        let nospace = [];
        this.categories.forEach(d =>
            nospace.push(d.replace(/\s/g, '')));
        if (this.categories.length == 1) {
            this.FilteredJobs = this.jobs.filter(jp => jp.jobCategory === this.categories[0].replace(/\s/g, ''));
        }
        else {
            this.FilteredJobs = this.jobs.filter(a => nospace.some(b => b === a.jobCategory));
        }
    }

    remove(category: string): void {
        //fitler data when remove one chip
        const index = this.categories.indexOf(category);
        if (index >= 0) {
            this.categories.splice(index, 1);
        }
        let nospace = [];
        this.categories.forEach(d =>
            nospace.push(d.replace(/\s/g, '')));
        if (this.categories.length == 0) {
            this.FilteredJobs = this.jobs;
        }
        else {
            this.FilteredJobs = this.jobs.filter(a => nospace.some(b => b === a.jobCategory));
        }

    }

    selected(event: MatAutocompleteSelectedEvent): void {
        //fitler data when select one value from shown dropdown
        this.categories.push(event.option.viewValue);
        this.jobInput.nativeElement.value = '';
        this.jobCategoryCtrl.setValue(null);
        let nospace = [];
        this.categories.forEach(d =>
            nospace.push(d.replace(/\s/g, '')));
        if (this.categories.length == 1) {
            this.FilteredJobs = this.jobs.filter(jp => jp.jobCategory === this.categories[0].replace(/\s/g, ''));
        }
        else {
            this.FilteredJobs = this.jobs.filter(a => nospace.some(b => b === a.jobCategory));
        }
    }
    
}