import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NetworkTraceComponent} from './network-trace/network-trace.component';
import {HomeComponent} from "./home/home.component";
import {LifeGameComponent} from "./life-game/life-game.component";
import {
  BloodMagicHealingCalculatorComponent
} from "./blood-magic-healing-calculator/blood-magic-healing-calculator.component";

const routes: Routes = [{
  path: '',
  component: HomeComponent
}, {
  path: 'network',
  component: NetworkTraceComponent
}, {
  path: 'life-game',
  component: LifeGameComponent
}, {
  path: 'bm-calculator',
  component: BloodMagicHealingCalculatorComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
