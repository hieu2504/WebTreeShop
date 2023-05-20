import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopIntroduceComponent } from './shop-introduce.component';

describe('ShopIntroduceComponent', () => {
  let component: ShopIntroduceComponent;
  let fixture: ComponentFixture<ShopIntroduceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopIntroduceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopIntroduceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
