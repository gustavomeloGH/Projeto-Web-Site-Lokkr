import { AuthService } from '../services/auth.service';
import { Share } from '../entity/Share';
import { CarViewModel } from '../entity/CarViewModel';
import { ENTITIES } from '../../util/ENTITIES';
import { DaoService } from '../services/dao.service';
import { CarViewService } from 'app/services/car-view.service';
import { User } from '../entity/User';
import { Car } from '../entity/Car';
import { Router } from '@angular/router';
import { CarService } from '../services/car.service';
import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

declare var jQuery: any;

@Component({
  selector: 'app-car-view',
  providers: [CarService, DaoService, CarViewService, AuthService],
  templateUrl: './car-view.component.html',
  styleUrls: ['./car-view.component.css']
})

export class CarViewComponent implements OnInit {

  thisUserKey: string;
  anotherUser: User;
  car: Car;
  thisUser: User;
  carView: CarViewModel;
  boo: boolean;
  notIsMyCar: boolean;
  initialDate: Date;
  finalDate: Date;
  initialHour: string;
  finalHour: string;
  shareList: Array<Share>;
  alreadyRequestCarLogin: boolean;
  awaitAccept: boolean;
  modalMsg: string;

  constructor( private router: Router,
               private carService: CarService,
               private daoService: DaoService,
               private carViewService: CarViewService,
               private authService: AuthService) {

     this.alreadyRequestCarLogin = false;
     this.awaitAccept = true;
     this.boo = true;
     this.notIsMyCar = true;
     this.getUserByKey();
     this.modalMsg = '';
   }

   initializeElements(){
     jQuery('.parallax').parallax();
     jQuery('.materialboxed').materialbox();
     jQuery(document).ready(function(){
      jQuery('.modal').modal();
    });

  }

  ngAfterViewChecked() {
    if(this.carView !== undefined && this.boo) {
      this.initializeElements();
      this.boo = false;
    }
  }

  ngOnInit() {
  }

  getUserKey() {
    this.thisUserKey = this.carService.getKeyFromRouter(this.router.url);
  }

  getUserByKey() {
     this.getUserKey();
     this.daoService.getByKey<User>(ENTITIES.user, this.thisUserKey)
       .then( user => {
         this.thisUser = user;
         if(user === undefined) {
            this.goToNotFound();
         } else {
            this.getCarByUserEmail();
         }
       })
       .catch(error => this.goToNotFound());
   }

  getCarByUserEmail() { 
      this.daoService.get<Car>(ENTITIES.car, 'userEmail', this.thisUser.email)
       .then(car => {
         this.car = car;
         if (this.car === undefined) {
           this.goToDashboard();
         } else {
           this.getShareList();
         }
      })
      .catch(error => this.goToNotFound());
  }

  getShareList() {
     this.daoService.list<Share>(ENTITIES.share)
        .subscribe( shareList => {
            this.shareList = shareList;
            this.checkIsMyCar();
        });
  }

  checkIsMyCar() {
    this.authService.getCurrentUser()
      .then(currentUserLoged => {
          if ( currentUserLoged ) {
            if (this.thisUser.email === currentUserLoged.email) {
              this.notIsMyCar = false;
           } else {
              this.notIsMyCar = true;
           }
           this.getUserByEmailAndCheckShare(currentUserLoged.email);
        }
      });
    this.mergeObjects();
  }

  getUserByEmailAndCheckShare(email) {
    this.daoService.get<User>(ENTITIES.user, 'email', email)
      .then( user => {
        this.anotherUser = user;
        const isAlreadyRequest = this.filterRequest();
        if (isAlreadyRequest) {
          this.alreadyRequestCarLogin = true;
        };
      });
  }

  filterRequest() {
    let isAlreadyRequest = new Array<Share>();
    if (this.shareList) {
       isAlreadyRequest = this.shareList.filter( current => {
            return (current.emAberto
                    && current.solicitadorKey === this.anotherUser.$key
                    && current.proprietarioKey === this.thisUser.$key);
        });
        if (isAlreadyRequest.length > 0) {
            this.awaitAccept = isAlreadyRequest[0].status !== 2;
        }
    }
    return isAlreadyRequest.length > 0;
  }

   className(checkItem, list: Array<string>) {
      const check = list.some( current => current === checkItem);
      return check ? 'ok' : 'notOk';
   }

  makeLease() {

    if (this.anotherUser) {
        if (!this.carViewService.checkValidData
              (this.initialDate, this.finalDate, this.initialHour, this.finalHour)) {
            this.openModal('O horário é inválido! Verifique se digitou corretamente.');

       } else {

            if (this.carViewService.haveRentAtThisTime
                  (this.shareList, this.thisUser, this.initialDate, this.finalDate)) {
              this.openModal('Já existe um aluguel para este período de tempo, tente outra data!');

            } else if (this.carViewService.thereIsConflitTime
                        (this.shareList, this.anotherUser, this.initialDate, this.finalDate )) {
                this.openModal('Você já solicitou um aluguel neste período de tempo digitado!');

            } else {
              this.doCarRental();
            }

        }
    } else {
      this.openModal('Primeiro efetue o login para poder realizar o aluguel');
    }
  }


  doCarRental() {
      const newShare = new Share(this.anotherUser.$key, this.thisUser.$key, this.car.$key,
                               this.initialDate.toString(), this.initialHour,
                               this.finalDate.toString(), this.finalHour);

    this.daoService.insert<Share>(ENTITIES.share, newShare)
        .then (resShare => {
            this.openModal('Carro solicitado com sucesso, verifique no seu dashboard o status!');
            this.goToDashboard();
      });
  }

  openModal(msg: string) {
      this.modalMsg = msg;
      jQuery('#modalCarView').modal('open');
  }

   goToDashboard() {
     setTimeout(() => {
        this.router.navigate(['dashboard']); }, 3000);
  }

   goToNotFound() {
     this.router.navigate(['not-found-404']);
  }


  checkAvg() {
    let index;
    if(this.car.avaliacao <= 10) {
        index = 1;
    }else if(this.car.avaliacao <= 20) {
        index = 2;
    } else if(this.car.avaliacao <= 30) {
      index = 3;
    } else if (this.car.avaliacao <= 50) {
      index = 4;
    } else {
      index = 5;
    }
    return new Array(index);
  }

  mergeObjects() {
      const mergeObjects = new CarViewModel(
        this.thisUser.$key,
        this.thisUser.nome,
        this.thisUser.sobrenome,
        this.thisUser.fotoPerfil,
        this.thisUser.bairro,
        this.thisUser.cidade,
        this.car.marca,
        this.car.modelo,
        this.car.ano,
        this.car.delivery,
        this.car.permissao,
        this.car.detalhes,
        this.car.descricao,
        this.car.preco,
        this.car.fotosCarro,
        this.car.avaliacao);
        this.carView = mergeObjects;
   }

}



