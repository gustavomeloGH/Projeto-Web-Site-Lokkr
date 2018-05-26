import { User } from '../entity/User';
import { Car } from '../entity/Car';
import { ObjectSearchCar } from '../entity/ObjectSearchCar';
import { Injectable } from '@angular/core';

declare var jQuery: any;

@Injectable()
export class CarService {
    validateArray: string[];
    errorMessage: string;


  constructor() {
     this.constructorMap();
     this.errorMessage = '';
   }

  public replaceNumber(listAnos: Array<ObjectSearchCar>): Array<ObjectSearchCar> {
       listAnos.forEach(a => { a.nome = a.nome.replace(/[^0-9]/g, ''); });
       return listAnos;
  }

  public checkAcessData(car: Car): string {
      if (!this.checkEmpty(car)) {
          return 'Os campos com o símbolo (*) em vermelho são obrigatórios.';
      } else {
        return this.checkCarNumber(car);
      }
  }

  public checkEmpty(car: Car): boolean {
   let cont = 0;
    this.validateArray.forEach((textField) => {
      if (Array.isArray(car[textField])) {
          if (car[textField].length === 0) {
            cont++;
          }
      } else if (car[textField] === undefined || car[textField] === '') {
          cont++;
      }
    });
    return cont === 0;
  }

  public genericGetCheckBox(list: Array<string>, item) {
    let check = false;
    list.forEach(currentItem => {
        if (currentItem === item) {
            check = true;
        }
    });
    if (check) {
      list.splice(list.indexOf(item) , 1);
    } else {
      list.push(item);
    }
    return list;
  }

  public checkCarNumber(car: Car) {
    if (car.chassi.toString().length !== 18){
      return 'Número de CHASSI inválido! Verifique o número digitado';
    }
    if (car.placa.toString().length !== 8) {
      return 'Número de PLACA inválido! Verifique o número digitado';
    }
  }

  public checkPermission (permissao: Array<string>) {
      return permissao.length === 0 ?  this.genericGetCheckBox(permissao, 'Nenhum') : permissao;
  }

  public checkDependences (car: Car, listaMarcas: Array<ObjectSearchCar>, listaModelos: Array<ObjectSearchCar>) {
      car.permissao = this.checkPermission (car.permissao);
      if(listaModelos !== undefined) {
          listaMarcas.forEach(m => { if (m.codigo.toString() === car.marca) { car.marca = m.nome; } return; });
          listaModelos.forEach(m => { if (m.codigo.toString() === car.modelo ) { car.modelo = m.nome; } return; });
      }
      return car;
  }

  getKeyFromRouter (router: string) {
      router = router.replace('insert', '');
      router = router.replace('update', '');
      const routerArray = router.split('/');
      return routerArray[2];
  }

  getCurrentAction(router: string) {
      let action = '';
     if(router.includes('insert')) {
          action = 'insert';
      } else if (router.includes('update')) {
          action = 'update';
      }
      return action;
  }

  slice(cars: Car[]) {
    cars.forEach(currentCar => {
       currentCar.modelo = currentCar.modelo.slice(0, 11);
       currentCar.marca = currentCar.marca.slice(0, 5);
    });
    return cars;
  }

  setOthersData(car: Car) {
    jQuery(`#${car.tipoCarro}`).prop('checked', true);

    if(car.delivery) {
         jQuery(`#sim-delivery`).prop('checked', true);
    } else {
         jQuery(`#nao-delivery`).prop('checked', true);
    }

    this.setList(car.detalhes);
    this.setList(car.permissao);

  }

  getNewCar(oldCar: Car) {
    const newCar = new Car();
    const atributeList = this.validateArray;
        atributeList.push('pathFotos', 'permissao', 'userEmail');

        atributeList.forEach((textField) => {
              newCar[textField] = oldCar[textField];
        });
        return newCar;
  }

  setList(list) {
    list.forEach( curr => {
       jQuery(`#${curr}`).prop('checked', true);
    })
  }

   public constructorMap() {
    this.validateArray = new Array('chassi' , 'placa', 'marca', 'modelo', 'ano',
                      'quilometragem', 'combustivel', 'tipoCarro', 'detalhes',
                      'delivery', 'fotosCarro', 'descricao', 'preco', 'cor' );
  }


}
