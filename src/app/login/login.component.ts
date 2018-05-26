import { AuthService } from '../services/auth.service';
import { DaoService } from '../services/dao.service';
import { UserService } from '../services/user.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

declare var jQuery: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  providers: [UserService, DaoService, AuthService],
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  currentEmail: string;
  currentSenha: string;
  currentEmailResetPw: string;
  modalMsg: string;
  modalSignal: string;
  checkAuth: boolean;

  constructor(private router: Router,
              private userService: UserService,
              private daoService: DaoService,
              private authService: AuthService) {
      this.checkAuth = false;
      this.modalMsg = '';
      this.modalSignal = '';
   }

 ngOnInit() {
    this.checkIsLogin();
    jQuery('.slider').slider({height: 622});
    jQuery(document).ready(function(){
      jQuery('.modal').modal();
    });
   }

  checkIsLogin() {

    this.authService.getCurrentUser()
      .then(user => {
        if ( user ) {
          this.goToDashboard();
        }
      });
  }

  toCloseModal() {
     jQuery('#modal1').modal('close');
  }

  goToHome() {
    this.router.navigate(['home']);
  }

  goToDashboard() {
    this.router.navigate(['dashboard']);
  }

  goToRegister() {
    this.router.navigate(['register']);
  }

   goToHowWorks() {
    this.router.navigate(['how-works']);
   }

  tryLogin() {
    this.checkAuth = true;
    if(this.currentEmail === undefined || this.currentSenha === undefined) {
        this.openErrorModal('!', 'Preencha todos os campos!');
        this.releaseEnterButton();
    } else {
        this.authService.signinUser(this.currentEmail, this.currentSenha)
          .then(result => {
              this.openSucessModal('Login realizado com sucesso');
              setTimeout(() =>{
                this.goToDashboard(); }, 2000);
                this.releaseEnterButton();
          }).catch(error => {
              this.openErrorModal('!', 'Login e/ou senha inválidos, tente novamente');
              this.releaseEnterButton();
          });
    }
  }

  releaseEnterButton() {
     this.checkAuth = false;
  }


  openSucessModal(msg) {
    this.modalMsg = msg;
    jQuery('#modal2').modal('open');
  }

   openErrorModal(signal, msg) {
     this.modalSignal = signal;
     this.modalMsg = msg;
      jQuery('#modal3').modal('open');
  }

  sendEmail() {
    if(this.currentEmailResetPw === undefined) {
        this.openErrorModal('!', 'Campo e-mail vazio, digite o seu e-mail!');
    } else {
      this.userService.resetPassword(this.currentEmailResetPw)
        .then(result => {
            this.openSucessModal('Aguarde a verificação de e-mail! Enviaremos uma mensagem em breve');
            this.toCloseModal();
            this.currentEmailResetPw = '';
        }).catch(error => {
            this.openSucessModal('Aguarde a verificação de e-mail! Enviaremos uma mensagem em breve');
        });
    }
  }

}