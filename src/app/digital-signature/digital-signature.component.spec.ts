import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalSignatureComponent } from './digital-signature.component';

describe('DigitalSignatureComponent', () => {
  let component: DigitalSignatureComponent;
  let fixture: ComponentFixture<DigitalSignatureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DigitalSignatureComponent]
    });
    fixture = TestBed.createComponent(DigitalSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
