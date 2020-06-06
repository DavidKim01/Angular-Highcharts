import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildChartComponent } from './build-chart.component';

describe('BuildChartComponent', () => {
  let component: BuildChartComponent;
  let fixture: ComponentFixture<BuildChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuildChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
