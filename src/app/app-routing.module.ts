import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OutputGraphComponent } from './output-graph/output-graph.component';
import { AboutComponent } from './about/about.component';


const routes: Routes = [
  {
    path: '',
    component: OutputGraphComponent
  },
  {
    path: 'about',
    component: AboutComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
