import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { JobOffers } from 'src/app/models/jobOffers.model';
import { Role } from 'src/app/models/role.model';
import { AccountService } from 'src/app/services/account.service';
import { AlertService } from 'src/app/services/alert.service';
import { JobService } from 'src/app/services/job.service';

@Component({
  selector: 'app-favorite-jobs',
  templateUrl: './favorite-jobs.component.html',
  styleUrls: ['./favorite-jobs.component.scss']
})
export class FavoriteJobsComponent implements OnInit {
  jobs: JobOffers[];
  shouldHide: boolean= false;
  constructor(private jobService: JobService, private accService: AccountService, private alertService: AlertService) {
      this.shouldHide = this.accService.userValue.userType == Role.Recruiter ? true : false;
   }
  ngOnInit() {
    this.getjobs();
  }

  // deleteJob(id: string) {
  //   this.jobService.deleteFavorites(id)
  //     .then(() => {
  //       this.getjobs();
  //     });
  // }
  getjobs(){
    this.jobService.getFavorites()
    .then(job => {
      this.jobs = job.docs.map(e => {
        return {
          id: e.id,
          ...e.data() as JobOffers
        };
      });
    })
    .catch(err => {
      this.alertService.error(err);
    });
  }

}
