import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import {Observable} from 'rxjs/Observable';
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class FipeCarService  {

  constructor (private _http: Http) {}

   private _fipeURL = 'https://fipe-parallelum.rhcloud.com/api/v1';


  getMarcas () {
    const marcasURL = `${this._fipeURL}/carros/marcas`;

    return this._http
      .get(marcasURL)
      .toPromise()
      .then(res => res.json());
  }

  getModelos (marca: string) {
    const modelosURL = `${this._fipeURL}/carros/marcas/${marca}/modelos`;

    return this._http
      .get(modelosURL)
      .toPromise()
      .then(res => res.json());
  }

  getAnos (marca: string, modelo: string) {
    const anosURL = `${this._fipeURL}/carros/marcas/${marca}/modelos/${modelo}/anos`;

    return this._http
      .get(anosURL)
      .toPromise()
      .then(res => res.json());
  }

  getCodeFromMarca (marca: string) {
    const marcasURL = `${this._fipeURL}/carros/marcas`;
    this._http
      .get(marcasURL)
      .toPromise()
      .then(res => res.json())
        .then(list => {
          list.forEach( current => {
              if (marca === current.nome) {
                console.log(marca);
                console.log(current.nome);
                console.log(current.codigo);
              }
          })
        });
  }


   /* getValor (transporte: string, marca: string, modelo: string, ano: string) {
    const anosURL = `${this._fipeURL}/${transporte}/marcas/${marca}/modelos/${modelo}/anos/${ano}`;

    return this._http
      .get(anosURL)
      .toPromise()
      .then(res => res.json());
  }
}*/


//https://deividfortuna.github.io/fipe/ - LINK 


}