import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { AccountService } from 'src/app/services/account.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

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
    private alertService: AlertService
  ) { }

  ngOnInit() {

    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      jobProfile: ['', Validators.required]
    });

    let data: User = this.accountService.userValue;
    this.f.firstName.setValue(data.firstName);
    this.f.lastName.setValue(data.lastName);
    this.f.username.setValue(data.email);
    this.f.jobProfile.setValue(data.jobProfile);
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    this.alertService.clear();
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.updateProfile();
  }

  private updateProfile() {
    let user: User = {
      firstName: this.f.firstName.value,
      lastName: this.f.lastName.value,
      email: this.f.username.value,
      jobProfile: this.f.jobProfile.value,
      uid: this.accountService.userValue.uid,
      userType: this.accountService.userValue.userType,
      displayName: this.f.firstName.value + ' ' + this.f.lastName.value,
      emailVerified: this.accountService.userValue.emailVerified
    };
    this.accountService.update(this.accountService.userValue.uid, user)
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
