import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OutputGraphComponent } from './output-graph/output-graph.component';
import { AboutComponent } from './about/about.component';
import { BuildChartComponent } from './build-chart/build-chart.component';


const routes: Routes = [
  {
    path: '',
    component: OutputGraphComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'build',
    component: BuildChartComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
