import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './helpers/auth.guard';
import { Role } from './models/role.model';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const homeModule = () => import('./home/home.module').then(x => x.HomeModule);
const profileModule = () => import('./profile/profile.module').then(x => x.ProfileModule);
const jobOffersModule = () => import('./jobOffers/jobOffers.module').then(x => x.JobOffersModule);

const routes: Routes = [
    { path: '', loadChildren: homeModule, canActivate: [AuthGuard], data: { userRole: [Role.User] }  },//Only user role User has access
    { path: 'account', loadChildren: accountModule },
    { path: 'profile', loadChildren: profileModule },
    { path: 'jobOffers', loadChildren: jobOffersModule, canActivate: [AuthGuard], data: { userRole: [Role.Recruiter] } },//Only user role Recruiter has access

    //redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }