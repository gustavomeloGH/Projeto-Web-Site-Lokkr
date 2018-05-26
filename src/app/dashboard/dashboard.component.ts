import { AuthService } from '../services/auth.service';
import { RequestData } from '../entity/RequestData';
import { Solicitation } from '../entity/Solicitation';
import { checkAndUpdateNode } from '@angular/core/src/view/view';
import { DaoService } from '../services/dao.service';
import { Share } from '../entity/Share';
import { CarService } from '../services/car.service';
import { ENTITIES } from '../../util/ENTITIES';
import { User } from '../entity/User';
import { Car } from '../entity/Car';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import 'rxjs/add/operator/first';

declare var jQuery: any;

@Component({
  selector: 'app-dashboard',
  providers: [CarService, DaoService, AuthService],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  optionClick: number;
  contentCheck: number;
  car: Car;
  user: User;
  shareList: Array<Share>;
  currentList: Array<Share>;
  loaded: boolean;
  thisSolicitation: Array<Share>;
  thisSolicitationData: Array<Solicitation>;
  thisRequests: Array<Share>;
  thisRequestsData: Array<RequestData>;
  selectRequest: RequestData;
  acceptRequestOk: boolean;
  modalMsg: string;
  otherRequestSameTime: Array<RequestData>;

  constructor( private router: Router,
               private carService: CarService,
               private daoService: DaoService,
               private authService: AuthService) {
    this.loaded = false;
    this.acceptRequestOk = false;
    this.optionClick = 0;
    this.contentCheck = 0;
    this.modalMsg = '';
  }

  ngOnInit() {
    this.check();
     jQuery(document).ready(function(){
      jQuery('.modal').modal();
    });
  }

  goToSearch() {
    this.router.navigate(['search']);
  }

  goToHowWorks() {
    this.router.navigate(['how-works']);
  }

  goToHome() {
    this.router.navigate(['home']);
  }

  goToCarViewFromSolicitation(key) {
    this.router.navigate([`car-view/${key}`]);
  }

  changeOptionClick(clickNumber: number) {
    if (this.loaded) {
      switch (clickNumber) {
      case 0:
        this.checkNotifications();
      break;
      case 1:
        this.checkRequests();
      break;
    }
      this.optionClick = clickNumber;
    }
  }

  checkNotifications() {
    this.contentCheck = this.thisSolicitation
      .filter(e => e.status === 0 || e.status === 2  || e.status === 4 || e.status === 5).length > 0 ? 1 : 2;
   }

  checkRequests() {
    if ( !this.car ) {
        this.contentCheck = 4;
    } else if ( this.thisRequests
                  .filter(e => e.status === 0 || e.status === 2 || e.status === 4 || e.status === 5).length === 0 ) {
      this.contentCheck = 3;
    } else {
      this.contentCheck = 1;
    }
  }

  openSolicitationData() {
    if (this.selectRequest) {
        this.contentCheck = 2;
    }
  }

  goToRegister() {
     this.router.navigate([`register/${this.user.$key}update`]);
  }

  goToRegisterCar() {
    this.router.navigate([`new-car/${this.user.$key}insert`]);
  }

  goToNewCar() {
     this.router.navigate([`new-car/${this.user.$key}update`]);
  }

  check() {
    this.authService.getCurrentUser()
      .then(currentUser => {
          if ( currentUser ) {
            this.getUser(currentUser.email);
          } else {
            this.goToHome();
          }
      });
  }

  getUser(email) {
     this.daoService.get<User>(ENTITIES.user, 'email', email)
       .then(user => {
         this.user = user;
         this.getCar(user.email);
      });
  }

  getCar(email) {
     this.daoService.get<Car>(ENTITIES.car, 'userEmail', email)
       .then(car => {
         this.car = car;
         this.getList();
      });
  }

  getList() {
      this.daoService.list<Share>(ENTITIES.share)
      .subscribe( res => {
        this.shareList = res;
        this.checkLoad();
      });
  }

   checkLoad() {
     this.initializeArrays();
     if ( this.shareList.length > 0 ) {
       this.thisSolicitation = this.findFromShareList('solicitadorKey');
       this.thisRequests = this.findFromShareList('proprietarioKey');
     }
     if (this.thisSolicitation.length > 0) {
        this.getSolicitationsData();
     } else if (this.thisRequests.length > 0) {
        this.getRequestData();
     } else {
        this.endLoad();
     }
  }

  initializeArrays() {
      this.thisSolicitation = new Array<Share>();
      this.thisSolicitationData = new Array<Solicitation>();
      this.thisRequests = new Array<Share>();
      this.thisRequestsData = new Array<RequestData>();
      this.otherRequestSameTime = new Array<RequestData>();
  }

   findFromShareList(atribute: string) {
     const arrayFind = new Array<Share>();
     this.shareList.forEach( curr => {
        if (curr[atribute] === this.user.$key) {
          arrayFind.push(curr);
        }
     });
     return arrayFind;
   }

  endLoad() {
    this.checkNotifications();
    this.loaded = true;
  }

  getSolicitationsData() {
    this.thisSolicitation.forEach( (curr, index, arr) => {
       this.daoService.getByKey<Car>(ENTITIES.car, curr.proprietarioCarKey)
         .then( car => {
              this.thisSolicitationData.push(new Solicitation(curr, car));
              if (arr.length - 1 === index) {
                this.thisRequests.length > 0 ? this.getRequestData() : this.endLoad();
              }
         });
    });
  }

  getRequestData() {
    this.thisRequests.forEach( (curr, index, arr) => {
       this.daoService.getByKey<User>(ENTITIES.user, curr.solicitadorKey)
         .then( user => {
              this.thisRequestsData.push(new RequestData(curr, user));
              if (arr.length - 1 === index) {
                this.endLoad();
              }
         });
    });
  }

  goToCarView() {
    this.router.navigate([`car-view/${this.user.$key}`]);
  }

  closeModal() {
      jQuery('.modal').modal('close');
  }

  isOpened(boolean, typeData: any) {
      return this[typeData].filter(e => e.share.emAberto  === boolean);
  }

  getStatusName(statusNumber) {
    let name;
    switch (statusNumber) {
      case 0:
        name = 'Pendente';
        break;
      case 1:
        name = 'Recusado';
        break;
      case 2:
        name = 'Aceito';
        break;
      case 3:
        name = 'Prazo esgotado';
        break;
      case 4:
        name = 'Aguardando entrega';
        break;
      case 5:
        name = 'Aguardando avaliação';
        break;
      case 6:
        name = 'Entregue';
        break;
    }
    return name;
  }

  setSelectUser(requestUser: RequestData) {
    this.selectRequest = requestUser;
  }

  replyRequest(aswer: boolean) {
    if (aswer) {
        this.acceptRequest();
    } else {
        this.rejectRequest();
    }
  }

  acceptRequest() {
       this.otherRequestSameTime = this.showConflitTimeRequests();
      if (this.otherRequestSameTime.length === 0) {
          this.finishAcceptRequest();
      }
  }

  finishAcceptRequest() {
    this.daoService.update<Share>(ENTITIES.share, this.selectRequest.share.$key, { status : 2 })
          .then( resShare => {
               this.finishRequestMsg();
         });
  }

  showConflitTimeRequests() {
      let thereIsConflitTime: Array<RequestData>;
      const initialDate = new Date(this.selectRequest.share.dataInicial);
      const finalDate = new Date(this.selectRequest.share.dataFinal);

      thereIsConflitTime = this.thisRequestsData.filter( current => {
          const currentInitialDate = new Date(current.share.dataInicial);
          const currentFinalDate = new Date(current.share.dataFinal);

          if (current.share.emAberto
              && this.selectRequest !== current
              && initialDate <= currentFinalDate
              && currentInitialDate <= finalDate) {
                  return current;
              }
       });

       if (thereIsConflitTime.length > 0) {
            let msg = 'Existem outras solicitações nesta mesmo horário! \nAceitando, automaticamente iremos recusar as demais abaixo:\n\n';
            thereIsConflitTime.forEach(e => msg += `${e.user.nome} ${e.user.sobrenome} \n`);
            msg += '\n\nPara confirmar clique em "ok" abaixo';
            this.openModal(msg);
       }

      return thereIsConflitTime;
  }

  rejectOtherRequestSameTime() {
    if(this.otherRequestSameTime.length > 0) {
        this.otherRequestSameTime.forEach( (curr, index, arr) => {
          this.daoService.update<Share>(ENTITIES.share, curr.share.$key, { status : 1, emAberto : false })
            .then( res => {
              if (arr.length - 1 === index) {
                  this.finishAcceptRequest();
                }
            });
      });
    }
  }

  finishRequestMsg() {
    this.openModal('Solicitação aceita com sucesso! Pegue o carro no dia combinado.');
    this.changeOptionClick(0);
  }

  rejectRequest() {
      this.daoService.update<Share>(ENTITIES.share, this.selectRequest.share.$key, { status : 1, emAberto : false })
        .then( res => {
          this.openModal('Recusado com sucesso! \nMandaremos sua resposta ao solicitador!');
          this.changeOptionClick(0);
        });
  }

  openModal(msg: string) {
      this.modalMsg = msg;
      jQuery('#modalDashboard').modal('open');
  }

  sendEvaluation(evaluation, currSolct: Solicitation) {

    this.daoService.update<Share>(ENTITIES.share, currSolct.share.$key, { status : 6, emAberto : false })
        .then( res => {
          const newEvaluation = currSolct.car.avaliacao + evaluation;
          this.daoService.update<Car>(ENTITIES.car, currSolct.car.$key, { avaliacao : newEvaluation })
              .then( resCar => {
                  this.openModal('Enviado sua avaliação para o proprietário do carro \ncom sucesso!');
                  this.changeOptionClick(0);
              });
      });
  }


    carDeliveryConfirm(currRqst: RequestData) {

     this.daoService.update<Share>(ENTITIES.share, currRqst.share.$key, { status : 5 })
        .then( res => {
          this.openModal('Confirmado a entrega do veículo com sucesso! \nO solicitador irá avaliar seu carro.');
          this.changeOptionClick(0);
      });
  }

  deleteAccount(boolean) {
    if (!boolean) {
      jQuery('#modalDashboard-delete').modal('open');
    } else {
      this.openModal('Sua conta foi removida com sucesso! /nEstaremos sempre aqui, caso você mude de ideia!');
      setTimeout(() => {
        this.goToHome();
      }, 3500);

      this.authService.logout()
        .then(res0 => {
          this.daoService.remove<User>(ENTITIES.user, this.user.$key)
            .then( res1 => {
              this.daoService.remove<Car>(ENTITIES.car, this.car.$key)
            });
          });
    }
  }



}
