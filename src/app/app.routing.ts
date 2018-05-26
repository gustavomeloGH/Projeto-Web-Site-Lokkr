import { SearchComponent } from './search/search.component';
import { CarRegistrationComponent } from './car-registration/car-registration.component';
import { RegisterComponent } from './register/register.component';
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { HowWorkComponent } from './how-work/how-work.component';
import { ShareComponent } from 'app/share/share.component';
import { CarViewComponent } from 'app/car-view/car-view.component';
import { DashboardComponent } from 'app/dashboard/dashboard.component';
import { NotfoundComponent } from 'app/notfound/notfound.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full'},
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'register/:id', component: RegisterComponent },
    { path: 'new-car/:id', component: CarRegistrationComponent },
    { path: 'share', component: ShareComponent },
    { path: 'search', component: SearchComponent },
    { path: 'search/:id', component: SearchComponent },
    { path: 'car-view/:id', component: CarViewComponent },
    { path: 'how-works', component: HowWorkComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: '**', component: NotfoundComponent }
];

export const partialComponents = [];
