import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout/layout.component';
import { JobOfferListComponent } from './jobOffer-list/jobOffer-list.component';
import { CrudComponent } from './crud/crud.component';

const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: '', component: JobOfferListComponent },
            { path: 'add', component: CrudComponent },
            { path: 'edit/:id', component: CrudComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class JobOfferRoutingModule { }