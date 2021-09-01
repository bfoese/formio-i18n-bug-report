import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErecFormBuilderComponent } from './app-form-builder.component';

describe('ErecFormBuilderComponent', () => {
  let component: ErecFormBuilderComponent;
  let fixture: ComponentFixture<ErecFormBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ErecFormBuilderComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErecFormBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
