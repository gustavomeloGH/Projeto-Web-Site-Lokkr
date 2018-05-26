import { AuthService } from '../services/auth.service';
import { LocationService } from '../services/location.service';
import { CarService } from '../services/car.service';
import { ENTITIES } from '../../util/ENTITIES';
import { UserService } from '../services/user.service';
import { THROW_IF_NOT_FOUND } from '@angular/core/src/di/injector';
import { WithLatestFromSignature } from 'ng2-input-mask/node_modules/rxjs/operator/withLatestFrom';
import { TestResult } from 'tslint/lib/test';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Renderer } from '@angular/core';
import { User } from '../entity/User';

import { DaoService } from 'app/services/dao.service';
import * as firebase from 'firebase';

declare var jQuery: any;

@Component({
  selector: 'app-register',
  providers: [DaoService, UserService, CarService, LocationService, AuthService],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  clickedBtn: boolean;
  user: User;
  errorMessage: string;
  fileInput: string;
  checkData: boolean;
  isUpdate: boolean;
  fileName: string;
  msgModal: string;

  constructor( private router: Router,
               private renderer: Renderer,
               private daoService: DaoService,
               private userService: UserService,
               private carService: CarService,
               private locationService: LocationService,
               private authService: AuthService)
    {

      this.msgModal = '';
      this.isUpdate = false;
      this.user = new User();
      this.clickedBtn = false;
      this.errorMessage = '';
      this.checkData = false;
    }


  ngOnInit() {
      this.checkUpdate();
      jQuery(document).ready(function(){
        jQuery('.modal').modal();
      });
      jQuery(document).ready(function(){
        jQuery('.tooltipped').tooltip({delay: 50});
      });
  }

  checkUpdate(){
    if (this.router.url.includes('update')) {
      this.checkData = true;
      this.doUpdate();
    }
  }


  doUpdate() {
    const key = this.userService.getKeyFromRouter(this.router.url);
    this.daoService.getByKey<User>(ENTITIES.user, key)
        .then(res => {
          res ? this.updateFields(res) : this.goToNotFound();
        })
        .catch(error => {
            alert('Não foi possível acessar os dados do usuário, contate um administrador do sistema!');
        });
  }
  updateFields(user) {
      this.user = user;
      this.isUpdate = true;
      this.errorMessage = 'Sua foto atual PERMANECERÁ SALVA, caso você queira alterar, selecione uma nova foto!';
      this.checkData = false;
      this.userService.disableKeys();
  }

  toCloseModal() {
     jQuery('#modal1').modal('close');
  }

  toOpenSuccessModal() {
      jQuery('#modalRegister').modal('open');
  }

  showCnhImage() {
    this.clickedBtn = true;
  }

  hideCnhImage() {
    this.clickedBtn = false;
  }

  registerUser() {
    this.errorMessage = '';
    if (this.checkAcessData()) {
      this.checkData = true;
      if (this.isUpdate) {
           this.uploadData();
      } else {
        this.validateCpfAndEmail();
      }
    }
  }

  validateCpfAndEmail() {
      this.userService.validate(this.user)
        .then(() => this.uploadData())
        .catch(error => {
            this.errorMessage = error;
            this.checkData = false;
            this.renderer.setElementProperty(document.body, 'scrollTop', 0);
      });
  }

   private uploadData() {
     if (this.fileInput === undefined && this.isUpdate) {
          this.insertOnDB();
     } else {
        if (this.fileInput !== undefined && this.isUpdate) {
              this.daoService.removeUpload(this.user.pathFotoPerfil, this.user.email, ENTITIES.user);
        }
        this.doUpload();
       }
    }

    doUpload() {
        this.daoService.upload(this.fileInput, this.user.email, ENTITIES.user)
        .then(res => {
            this.user.fotoPerfil = res;
            this.user.pathFotoPerfil = this.fileName;
            this.isUpdate ? this.insertOnDB() : this.getLocationFromAddress();
        })
        .catch(error => this.errorMessage = error);
     }

      getLocationFromAddress() {
       this.setLocationFromAddress()
        .then( res => {
            const lat = res.results[0].geometry.location.lat;
            const lng = res.results[0].geometry.location.lng;
            this.user.geolocation = new Array(lat, lng);
            this.insertOnDB();
        })
        .catch(error => {
          this.errorMessage = 'Por alguma razão, seu endereço continua errado, verifique mais uma vez todos os dados.';
          this.checkData = false;
          this.renderer.setElementProperty(document.body, 'scrollTop', 0);
        });
    }


    insertOnDB() {
      if (!this.isUpdate) {
        this.daoService.insert<User>(ENTITIES.user, this.user)
          .then( res => {
              this.signUp();
           });
      } else {
          const copyUser = JSON.parse(JSON.stringify(this.user));
          delete copyUser.$key;
          this.daoService.update<User>(ENTITIES.user, this.user.$key, copyUser)
            .then( res =>  this.save('Cadastro atualizado com sucesso!'));
      }
    }

    private signUp() {
      this.authService.signupUser(this.user, this.user.senha)
        .then(() => {
           this.save('Cadastro realizado com sucesso!');
        });
    }

    save(msgModal) {
      this.msgModal = msgModal;
      this.toOpenSuccessModal();

      setTimeout(() => {
        this.isUpdate ? this.goToDashboard() : this.goToNewCar();
      }, 2000);
    }

  checkAcessData() {
    this.errorMessage = this.userService.checkAcessData(this.user);
    if(this.errorMessage) {
        this.renderer.setElementProperty(document.body, 'scrollTop', 0);
    }
    return !this.errorMessage;
  }

   goToNewCar() {
     this.daoService.get<User>(ENTITIES.user, 'email', this.user.email)
       .then(res => {
          this.router.navigate([`new-car/${res.$key}insert`]);
       }).catch( error => this.goToDashboard());
  }

  goToNotFound() {
     this.router.navigate(['not-found-404']);
  }

  goToDashboard() {
    this.router.navigate(['dashboard']);
  }

  searchCep() {
    this.userService.pesquisaCep(this.user)
      .then( res => {
          this.errorMessage = res;
      })
      .catch(error => {
          this.errorMessage = error;
          this.renderer.setElementProperty(document.body, 'scrollTop', 0);
      });
  }

  setLocationFromAddress() {
    return this.userService.getLocation(this.user);
  }

  fileChangeEvent(fileInput: any){
    this.user.fotoPerfil = 'not_empty';
    this.fileInput = fileInput.target.files[0];
    this.fileName = fileInput.target.files[0].name;
  }
}

