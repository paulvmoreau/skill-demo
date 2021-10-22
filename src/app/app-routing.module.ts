import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NetworkTraceComponent } from './network-trace/network-trace.component';

const routes: Routes = [{ path: 'network', component: NetworkTraceComponent },];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
