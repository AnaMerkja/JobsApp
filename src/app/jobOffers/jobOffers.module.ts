import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { JobOfferListComponent } from './jobOffer-list/jobOffer-list.component';
import { LayoutComponent } from './layout/layout.component';
import { CrudComponent } from './crud/crud.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JobOfferRoutingModule } from './jobOffer-routing.module';
import { SearchFilterPipe } from '../helpers/search-filter.pipe';



@NgModule({
  declarations: [
    JobOfferListComponent,
    LayoutComponent,
    CrudComponent,
    SearchFilterPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    JobOfferRoutingModule,
    FormsModule  
  ],
  providers: [DatePipe, SearchFilterPipe]
})
export class JobOffersModule { }