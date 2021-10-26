import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NetworkTraceComponent} from './network-trace/network-trace.component';
import {HomeComponent} from "./home/home.component";

const routes: Routes = [{
  path: '',
  component: HomeComponent
}, {
  path: 'network',
  component: NetworkTraceComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
