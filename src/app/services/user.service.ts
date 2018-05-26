import { LocationService } from './location.service';
// import { FirebaseAuthState } from 'angularfire2/auth';
import { ENTITIES } from '../../util/ENTITIES';
import { DaoService } from './dao.service';
import { User } from '../entity/User';
import {Http, Response} from '@angular/http';
import { Renderer } from '@angular/core';

import { Injectable } from '@angular/core';

import * as firebase from 'firebase';
import { Address } from 'app/entity/address';

declare var require: any;
declare var jQuery: any;


@Injectable()
export class UserService {
    errorMessage: string;
    validateArray: string[];
    arrayFunction: Array <any>;


  constructor(private daoService: DaoService,
              private _http: Http, private renderer: Renderer,
              private locationService: LocationService ) {
     this.errorMessage = '';
     this.constructorArrayData();
   }

  public checkAcessData(user: User): string {
      this.errorMessage = '';
     try {
        this.checkEmpty(user);
        this.checkEmail(user);
        this.checkPassword(user);
        this.checkCpf(user);
        this.checkData(user);
        this.checkCallNumber(user);
        this.checkPesquisaCep(user);
        this.checkCnh(user);
      } finally {
     return this.errorMessage;
    }
  }

  public checkExistCpf(user): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.daoService.get<User>(ENTITIES.user, 'cpf', user.cpf)
        .then(res => {
          if (res !== undefined) {
            reject('O Cpf já existe no sistema');
          } else {
            resolve();
          }
        });
    });
  }

  public checkExistEmail(user): Promise <void> {
    return new Promise<void> ((resolve, reject) => {
      this.daoService.get<User>(ENTITIES.user, 'email', user.email)
        .then(res => {
          if (res !== undefined) {
            reject('O Email já existe no sistema');
          } else {
            resolve();
          }
        });
    });
  }

  public validate(user: User): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.checkExistEmail(user)
        .then(() => {
          this.checkExistCpf(user)
            .then(() => resolve())
            .catch(error => reject(error));
        }).catch(error => reject(error));
    });
  }

  checkEmpty(user: User) {
    this.validateArray.forEach((textField) => {
        if (user[textField] === undefined || user[textField] === '') {
          this.errorMessage = 'Os campos com o símbolo (*) em vermelho são obrigatórios.';
          throw stop;
        }
    });
  }

  checkEmail(user) {
      let filter=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
      let testresults = filter.test(user.email);
      if(!testresults) {
        this.errorMessage = 'E-mail inválido! Tente e-mail no formato: me@exemple.com';
        throw stop;
      }
  }

  checkPassword(user) {
    let testresults = false;
    let filter = /^[a-z0-9]{6,12}$/i;

    testresults = filter.test(user.senha);
    if (!testresults) {
     this.errorMessage = 'Senha inválida! A senha deve conter entre 6 a 12 caracteres, utilizando apenas letras e números';
     throw stop;
    }
  }

  checkCpf(user) {
    const isCPF = require('is-cpf');
    if(!isCPF(user.cpf) || this.isEqualNumber(user.cpf)) {
      this.errorMessage = 'Cpf inválido, verifique o número de cpf digitado.';
      throw stop;
    }
  }

  isEqualNumber(cpf) {
    let first = cpf.charAt(0);
    let cont = 0;
    for(let i = 1; i < cpf.length; i++) {
      if(cpf.charAt(i) === first) {
        cont++;
      }
    }
    return cont === 11;
  }


  checkCallNumber(user) {

    let errorMessage = '';
    if(user.celularP.length < 15) {
      this.errorMessage = 'Celular principal inválido!';
      throw stop;
    }

    if(user.celularS !== undefined && user.celularS !== '') {
       if(user.celularS.length < 15) {
          this.errorMessage = 'Celular secundário inválido!';
          throw stop;
        }
    }

    if(user.telefone !== undefined && user.telefone !== '') {
      if(user.telefone.length !== 14) {
        this.errorMessage = 'Telefone inválido!';
        throw stop;
      }
    }

  }

  checkData(user) {
    let str = user.dataNascimento.toString();
    let date = new Date(str.split('/').join('/'));
    let novaData = new Date();
    let currentAge = (novaData.getFullYear() - date.getFullYear());
    if(currentAge < 18) {
      this.errorMessage = 'Data de Nascimento inválida! É necessário ter mais de 18 anos.';
      throw stop;
    }
  }


  limpaFormularioCep(user: User) {
      user.rua = '';
      user.bairro = '';
      user.cidade = '';
      user.estado = '';
      return 'CEP não encontrado.';
  }

  fillCepField(user, address: Address) {
        user.rua = address.street;
        user.bairro = address.neighborhood;
        user.cidade = address.city;
        user.estado = address.state;
  }

  checkPesquisaCep(user: User) {
      let endereco: Array<string> = new Array('bairro', 'rua', 'cidade', 'estado');
      let cont = 0;
      endereco.forEach(elemento => {
          if(user[elemento] === undefined || user[elemento] === '') {
            cont++;
          }
      });
      if(cont > 0) {
         this.errorMessage = 'Realize a pesquisa de seu endereço pelo CEP!';
         throw stop;
      }
  }

  checkCepNumber (cep) {
    cep = cep.replace(/\D/g, '');
    if (cep !== '') {
          let validaCep = /^[0-9]{8}$/;
          return (validaCep.test(cep));
    }
  }

   pesquisaCep(user: User) {
      return new Promise<string> ((resolve, reject) => {
        const errorMessage = '';
        this.loadCep(user);
        this.locationService.getAddress(user.cep.substr(0, 10))
          .then(address => {
            jQuery('.tooltipped').tooltip('remove');

            if (address.city === undefined) {
              reject('Cep não encontrado');
            } else {
              this.fillCepField(user, address);
              resolve(errorMessage);
            }
          })
          .catch( error => {
             this.limpaFormularioCep(user);
             reject('Cep não encontrado');
          })
        });
  }


    loadCep(user: User) {
          user.rua = '...';
          user.bairro = '...';
          user.cidade = '...';
          user.estado = '...';
    }

 
    checkCnh(user) {
      if(user.numCNH.length < 11 ) {
        this.errorMessage = 'Número de CNH inválido, verifique esse campo!';
        throw stop;
      }else if(user.senhaCNH.length < 11) {
        this.errorMessage = 'Número da senha CNH inválido, verifique esse campo!';
        throw stop;
      }
    }

    // signUp(email: string, senha: string): firebase.Promise<FirebaseAuthState> {
    //     let creds: any = {email: email, password: senha};
    //     return this.af.auth.createUser(creds);
    // }

    // login(email: string, senha: string) {
    //  return this.af.auth.login({ email: email, password: senha });
    // }

     resetPassword(email: string) {
       return firebase.auth().sendPasswordResetEmail(email);
     }

     getLocation (user: User) {
        let address = user.rua + ' ' + user.numero + ' ' + user.bairro + ' ' + user.estado;
        return this.getGoelocation(address);
     }

      getGoelocation(address: string) {
        let a = 'https://maps.googleapis.com/maps/api/geocode/json?address="' + address + '"&key=AIzaSyCFWe35wKScc5XbiyRN4LqL3Qdgnq198G0&sensor=false"';
        return this._http.get(a).toPromise().then(res => res.json());
    }


  getKeyFromRouter (router: string) {
      router = router.replace('insert', '');
      router = router.replace('update', '');
      const routerArray = router.split('/');
      return routerArray[2];
  }

    constructorArrayData() {
      this.validateArray = new Array('email' , 'senha', 'nome', 'sobrenome', 'cpf',
      'dataNascimento', 'celularP', 'cep', 'numero', 'fotoPerfil',
        'numCNH', 'senhaCNH'
      );
    }

    disableKeys() {
      jQuery('#email').prop('disabled', true);
      jQuery('#senha').prop('disabled', true);
    }

}

