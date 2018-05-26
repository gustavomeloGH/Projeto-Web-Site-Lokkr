import { User } from '../entity/User';
import { CarSelect } from '../entity/CarSelect';
import { ENTITIES } from '../../util/ENTITIES';
import { Router } from '@angular/router';
import { ObjectSearchCar } from '../entity/ObjectSearchCar';

import { Renderer } from '@angular/core';
import { Component, OnInit } from '@angular/core';

import { Car } from '../entity/Car';

import { FipeCarService } from '../services/fipe-car.service';
import { DaoService } from 'app/services/dao.service';
import { CarService } from 'app/services/car.service';

declare var jQuery: any;

@Component({
  selector: 'app-car-registration',
  providers: [FipeCarService, DaoService, CarService],
  templateUrl: './car-registration.component.html',
  styleUrls: ['./car-registration.component.css'],
})

export class CarRegistrationComponent implements OnInit {

  errorMessage: string;
  car: Car;
  listCor: CarSelect[];
  listQuilometragem: CarSelect[];
  listCombustivel: CarSelect[];
  listaMarcas: ObjectSearchCar[];
  listaModelos: ObjectSearchCar[];
  listaAnos: ObjectSearchCar[];
  user: User;
  filesInput: Array<any>;
  checkData: boolean;
  isUpdate: boolean;
  modalMsg: string;
  showLabel: boolean;

  constructor( private router: Router,
               private renderer: Renderer,
               private fipeService: FipeCarService,
               private daoService: DaoService,
               private carService: CarService)
    {

      this.modalMsg = '';
      this.showLabel = true;
      this.checkData = true;
      this.errorMessage = '';
      this.car = new Car();
      this.isUpdate = false;

      this.daoService.list<CarSelect>(ENTITIES.cor)
      .subscribe(colors =>  this.listCor = colors);

      this.daoService.list<CarSelect>(ENTITIES.quilometragem)
      .subscribe(listQ =>  this.listQuilometragem = listQ);

       this.daoService.list<CarSelect>(ENTITIES.combustivel)
      .subscribe(listC =>  this.listCombustivel = listC);

   }

  ngOnInit() {
    jQuery(document).ready(function(){
        jQuery('.modal').modal({
          dismissible: false
        });
    });

    this.getUserKey();
    this.getMarcas();
  }

   getUserKey() {
       const key = this.carService.getKeyFromRouter(this.router.url);
       this.daoService.getByKey<User>(ENTITIES.user, key)
         .then( user => {
           if (user) {
              this.user = user;
              this.getCarFromEmail();
           } else {
              this.goToDashboard();
           }
         });
  }

  getCarFromEmail() {
      const typeAction = this.carService.getCurrentAction(this.router.url);
      this.daoService.get<Car>(ENTITIES.car, 'userEmail', this.user.email)
        .then(res => {
          switch (typeAction) {
            case 'insert':
                this.checkInsertCondition(res);
              break;
            case 'update':
                 this.updateFields(res);
              break;
            default:
                 this.goToRegister();
              break;
          }
       }).catch (error => {
           this.goToDashboard();
       });
  }

  checkInsertCondition(carUser) {
    if (carUser !== undefined) {
        this.openModal('Car3', 'Você não pode cadastrar mais de um carro!');
      } else {
        this.openModal('Car4', 'Deseja cadastrar seu carro ?');
        this.checkData = false;
        this.showLabel = false;
      }
  }

  updateFields(car) {
      this.car = car;
      this.checkData = false;
      this.errorMessage = 'As fotos de seu carro atuais PERMANECERÃO SALVAS, caso você queira alterar, selecione novas fotos!';
      this.carService.setOthersData(this.car);
      this.isUpdate = true;
  }

  openModal(currentModal: string, msg: string) {
      this.modalMsg = msg;
      jQuery(`#modal${currentModal}`).modal('open');
  }

  checkAcessData() {
    this.errorMessage = this.carService.checkAcessData(this.car);
    return !this.errorMessage;
  }

  getValueCarType(type) {
      this.car.tipoCarro = type;
  }

  getDeliveryBoolean (boolean) {
    this.car.delivery = boolean;
  }

  getDetailsCar(detail) {
    this.car.detalhes = this.carService.genericGetCheckBox(this.car.detalhes, detail);
  }

  getPermissionCar(permission) {
      this.car.permissao = this.carService.genericGetCheckBox(this.car.permissao, permission);
  }

  getMarcas() {
    return this.fipeService.getMarcas().then(marcas => {
      this.listaMarcas = marcas;
     });
  }

  getModelos(marca: string) {
    return this.fipeService.getModelos(marca).then(resultado => {
      this.listaModelos = resultado.modelos;
    });
  }

  getAnos(modelo: string) {
    return this.fipeService.getAnos(this.car.marca, modelo).then(resultado => {
        this.listaAnos = resultado;
        this.listaAnos = this.carService.replaceNumber(this.listaAnos);
    });
  }

  goToShare() {
    this.router.navigate(['share']);
  }

  goToRegister() {
    this.router.navigate(['register']);
  }

  goToHome() {
    this.router.navigate(['home']);
  }

  goToPageNotFound() {
    this.router.navigate(['page-not-found-404']);
  }

  goToDashboard() {
    this.router.navigate(['dashboard']);
  }

  hiddeOverlayUpdate() {
    if (this.showLabel && this.isUpdate) {
        this.car.marca = this.car.modelo = this.car.ano = undefined;
    }
    this.showLabel = false;
  }

  registerCar() {
      if (this.checkAcessData()) {
          this.checkData = true;
          this.car = this.carService.checkDependences(this.car, this.listaMarcas, this.listaModelos);
              this.car.userEmail = this.user.email;
              this.registerAllImg();
      } else {
        this.renderer.setElementProperty(document.body, 'scrollTop', 0);
      }
  }
 
  fileChangeEvent(fileInput: any) {
    this.car.fotosCarro = 'not_empty';
    this.filesInput = fileInput.target.files;
  }

  getPathFromFiles() {
      const newArray = new Array<any>();
      for ( let i = 0; i < this.filesInput.length; i++ ) {
         newArray.push(this.filesInput[i].name);
      }
      this.car.pathFotos = newArray;
   }


  registerAllImg() {
    if (this.filesInput === undefined && this.isUpdate) {
       this.save();
     } else {
        if (this.filesInput !== undefined && this.isUpdate) {
            if(this.car.pathFotos !== undefined) {
                this.deleteCurrentImageOnBD();
            }
        }
        this.doUpload();
     }
  }

  deleteCurrentImageOnBD() {
      for ( let i = 0; i < this.car.pathFotos.length; i++) {
        this.daoService.removeArrayUpload(this.car.pathFotos[i], this.user.email, ENTITIES.car)
            .then ( res => {
              if (this.car.pathFotos[i].length === (i - 1)) {
                  this.doUpload();
              }
            });
      }
  }

  doUpload() {
     this.car.fotosCarro = new Array<any>();
      const size = this.filesInput.length;

      for (let i = 0; i < size; i++) {
        this.daoService.upload(this.filesInput[i], this.car.userEmail, ENTITIES.car)
          .then(res => {
              this.car.fotosCarro.push(res);
              if(this.car.fotosCarro.length === size) {
                this.getPathFromFiles();
                this.save();
              }
          })
          .catch(error => {
            this.errorMessage = error;
              this.checkData = false;
          });
      }
  }

  save () {
      if (!this.isUpdate ) {
         this.daoService.insert<Car>(ENTITIES.car, this.car)
          .then(() => {
            this.redirectUrl('Carro cadastrado com sucesso!');
          });
      } else {
        const copyCar = JSON.parse(JSON.stringify(this.car));
        delete copyCar.$key;
        this.daoService.update<Car>(ENTITIES.car, this.car.$key, copyCar)
          .then( res => {
             this.openSucessModal('Carro atualizado com sucesso!');
             setTimeout(() => {
                this.goToDashboard();
             }, 3000);
           });
      }
  }

  redirectUrl(msgModal) {
    this.openSucessModal(msgModal);
      setTimeout(() => {
        this.goToShare();
      }, 3000);
    }

  openSucessModal (msgModal) {
    this.openModal('Car2', msgModal );
  }

  goToUrl() {
      this.isUpdate ? this.goToDashboard() : this.goToShare();
  }

}
