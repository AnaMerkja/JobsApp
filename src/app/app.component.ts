import { Component } from '@angular/core';
import { Role } from './models/role.model';
import { User } from './models/user.model';
import { AccountService } from './services/account.service';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  user: User;

  constructor(private accountService: AccountService) {
    this.accountService.user.subscribe(x => this.user = x);
  }
  get isRecruiter() {
    return this.user && this.user.userType === Role.Recruiter;
  }

  logout() {
    this.accountService.logout();
  }
}
