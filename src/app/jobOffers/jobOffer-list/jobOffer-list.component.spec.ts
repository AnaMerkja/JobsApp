import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobOfferListComponent } from './jobOffer-list.component';

describe('ListComponent', () => {
  let component: JobOfferListComponent;
  let fixture: ComponentFixture<JobOfferListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobOfferListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobOfferListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
