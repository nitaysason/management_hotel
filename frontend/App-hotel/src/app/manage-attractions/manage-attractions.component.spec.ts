import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAttractionsComponent } from './manage-attractions.component';

describe('ManageAttractionsComponent', () => {
  let component: ManageAttractionsComponent;
  let fixture: ComponentFixture<ManageAttractionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageAttractionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageAttractionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
