import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPostDetailComponent } from './new-post-detail.component';

describe('NewPostDetailComponent', () => {
  let component: NewPostDetailComponent;
  let fixture: ComponentFixture<NewPostDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPostDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPostDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
