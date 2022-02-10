import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NetworkTraceComponent} from './network-trace/network-trace.component';
import {NavBannerComponent} from './nav-banner/nav-banner.component';
import {AppFooterComponent} from './app-footer/app-footer.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {NetworkChartComponent} from './network-trace/network-chart/network-chart.component';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSliderModule} from "@angular/material/slider";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {AngularFireModule} from "@angular/fire/compat";
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";
import {AngularFireAuthModule} from "@angular/fire/compat/auth";
import {AngularFireStorageModule} from "@angular/fire/compat/storage";
import {MatTableModule} from "@angular/material/table";
import {HomeComponent} from './home/home.component';
import {MatCardModule} from "@angular/material/card";
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {LifeGameComponent} from './life-game/life-game.component';
import {LifeGameObservablesComponent} from './life-game/life-game-observables/life-game-observables.component';
import {LifeGameBruteForceComponent} from './life-game/life-game-brute-force/life-game-brute-force.component';
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatSelectModule} from "@angular/material/select";
import {HttpClientModule} from "@angular/common/http";

const firebaseConfig = {
  apiKey: "AIzaSyBi0LvdNZleOvpPpZv9EXsQ9YqQ-aZRcaM",
  authDomain: "skill-demo-41dd3.firebaseapp.com",
  projectId: "skill-demo-41dd3",
  storageBucket: "skill-demo-41dd3.appspot.com",
  messagingSenderId: "542168834515",
  appId: "1:542168834515:web:c15a2bdc27c200675ccf26",
  measurementId: "G-VRYPK69560"
};

@NgModule({
  declarations: [
    AppComponent,
    NetworkTraceComponent,
    NavBannerComponent,
    AppFooterComponent,
    NetworkChartComponent,
    HomeComponent,
    LifeGameComponent,
    LifeGameObservablesComponent,
    LifeGameBruteForceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatToolbarModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatInputModule,
    FormsModule,
    MatSliderModule,
    MatProgressSpinnerModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule, // firestore
    AngularFireAuthModule, // auth
    AngularFireStorageModule,
    MatTableModule,
    MatCardModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    MatButtonToggleModule,
    MatSelectModule,
    // storage
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
