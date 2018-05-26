import { AuthService } from '../services/auth.service';
import { ENTITIES } from '../../util/ENTITIES';
import { User } from '../entity/User';
import { DaoService } from '../services/dao.service';
import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import * as firebase from 'firebase';

declare var jQuery: any;

@Component({
  selector: 'app-header',
  providers: [DaoService, AuthService],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  haveLogin: boolean;
  user: User;
  boo: boolean;
  modalMsg: string;
  modalSignal: string;

  constructor( private router: Router,
               private daoService: DaoService,
               private authService: AuthService) {
    this.haveLogin = null;
    this.boo = true;
    this.modalMsg = '';
    this.modalSignal = '';
  }

  ngOnInit() {
    this.checkLogin();
     jQuery('.button-collapse').sideNav();
   }

    ngAfterViewChecked() {
     if(this.user !== undefined && this.boo) {
        jQuery('.dropdown-button').dropdown();

        this.boo = false;
      }
    }

  checkLogin() {
     firebase.auth().onAuthStateChanged( (user) => {
      if (user) {
        this.setUserFromDB(user.email);
      } else {
        this.haveLogin = false;
      }
    });
  }

  goToRegister() {
    this.router.navigate(['register']);
  }

  goToHome() {
    this.router.navigate(['home']);
  }

  goToHowWorks() {
    this.router.navigate(['how-works']);
  }

  goToLogin() {
    this.router.navigate(['login']);
  }

  goToDashboard() {
    this.router.navigate(['dashboard']);
  }

  logOff() {
    this.authService.logout()
      .then( res => {
          this.haveLogin = false;
          this.goToHome();
      })
      .catch( error => {
         alert('Falha ao deslogar, tente pelo dashboard!')
      })
  }

  setUserFromDB(email) {
    this.daoService.search<User>(ENTITIES.user, 'email', email)
      .subscribe( user => {
        this.user = user[0];
        this.haveLogin = true;
      });
  }
}