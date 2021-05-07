import { Component, OnInit } from '@angular/core';
import { JobOffers } from 'src/app/models/jobOffers.model';

import { JobService } from '../../services/job.service';

@Component({
  selector: 'app-jobOffer-list',
  templateUrl: './jobOffer-list.component.html',
  styleUrls: ['./jobOffer-list.component.scss']
})
export class JobOfferListComponent implements OnInit {
  jobs = null;
  searchText: string = '';
  filteredJobs: JobOffers[];
  constructor(private jobService: JobService) {
  }

  ngOnInit() {
    this.getjobs();
  }

  deleteJob(id: string) {
    this.jobService.delete(id)
      .then(() => {
        this.getjobs();
      });
  }
  getjobs() {
    let that = this;
    this.jobService.getUserJobs()
      .then(function (querySnapshot) {
        that.jobs = querySnapshot.docs.map(e => {
          return {
            id: e.id,
            ...e.data() as JobOffers
          };
        });
        that.filteredJobs = that.jobs;
      });
  }

  search(value: string): void {
    //used for data filtering when users is typing in Searchbox
    this.filteredJobs = this.jobs.filter((val) => val.jobTitle.toLowerCase().includes(value));
  }
}
