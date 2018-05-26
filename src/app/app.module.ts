import { LocationService } from './services/location.service';

import { SearchComponent } from './search/search.component';
import { RegisterComponent } from './register/register.component';
import { CarRegistrationComponent } from './car-registration/car-registration.component';
import { LoginComponent } from './login/login.component';
import { HowWorkComponent } from './how-work/how-work.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { ShareComponent } from './share/share.component';
import { CarViewComponent } from './car-view/car-view.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { AppComponent } from './app.component';

import { AngularFireDatabase, AngularFireDatabaseModule, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2';
import * as firebase from 'firebase';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { MaterializeModule } from 'angular2-materialize';
import { Angular2FontAwesomeModule } from 'angular2-font-awesome/angular2-font-awesome';
import { InputMaskDirective } from '../../node_modules/ng2-inputmask';

import { RouterModule, Routes } from '@angular/router';
import { routes, partialComponents } from './app.routing';

export const firebaseConfig = {
  apiKey: 'key',
  authDomain: 'domain',
  databaseURL: 'url',
  projectId: 'id',
  storageBucket: 'storage',
  messagingSenderId: 'senderid'
};

  // export const firebaseAuthConfig = {
  //   provider: AuthProviders.Password,
  //   method: AuthMethods.Password
  // };


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    HowWorkComponent,
    LoginComponent,
    RegisterComponent,
    CarRegistrationComponent,
    SearchComponent,
    partialComponents,
    AppComponent,
    InputMaskDirective,
    ShareComponent,
    CarViewComponent,
    DashboardComponent,
    NotfoundComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
    HttpModule,
    NguiDatetimePickerModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
  ],
    providers: [LocationService],
    bootstrap: [AppComponent]
  })

export class AppModule { }


