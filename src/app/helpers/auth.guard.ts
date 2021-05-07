import { Injectable, Inject } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Role } from '../models/role.model';
import { AccountService } from '../services/account.service';

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {

  constructor(
    @Inject(AccountService) private accountService: AccountService,
    @Inject(Router) private router: Router
  ) { }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const allowedUserRole = this.getRoutePermissions(route);
    return this.checkPermission(allowedUserRole, state);
  }

  private getRoutePermissions(route: ActivatedRouteSnapshot): Role {
    if (route.data && route.data.userRole) {
      return route.data.userRole as Role;
    }
    return null;
  }

  private checkPermission(allowedUserRole: Role, state: RouterStateSnapshot): boolean {
    const session = localStorage.getItem('user');
    if (session) {
      if (!allowedUserRole) {
        return true;
      }
      else {
        let userRole = this.accountService.userValue;
        if (userRole.userType.toLocaleLowerCase() == allowedUserRole[0].toLocaleLowerCase()) {
          return true;
        }
        else {
          return false;
        }
      }
    }
    else {
      this.router.navigate(['/account/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
}