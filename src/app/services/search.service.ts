import { IConfigurationLoadResult } from 'tslint/lib/configuration';
import {Http, Response} from '@angular/http';
import { Search } from '../entity/Search';
import { Car } from '../entity/Car';
import { User } from '../entity/User';
import { ENTITIES } from '../../util/ENTITIES';
import { DaoService } from './dao.service';
import { Injectable } from '@angular/core';
import { CarService } from '../services/car.service';

declare  var google: any;

@Injectable()
export class SearchServiceService {
    listUsers: User[];
    atributeSearchArray: string[];
    listSearch: Car[];

  constructor( private daoService: DaoService, private _http: Http ) {

      this.daoService.list<User>(ENTITIES.user)
          .subscribe( list => this.listUsers = list);

      this.constructorAtributeSearchArray();
   }

    searchResults(searchOptions: Search): Promise<Car[]> {

      return new Promise<Car[]>((resolve, reject) => {
        this.daoService.list<Car>(ENTITIES.car)
            .subscribe(cars => {
              this.listSearch = cars;

              this.checkAddress(searchOptions)
                .then( res => resolve(this.listSearch))
                .catch( error => reject(error) );
            });
      });
    }


    checkAddress(searchOptions) {
      return new Promise<any> ((resolve, reject) => {
          if (searchOptions.localizacao !== undefined && searchOptions.localizacao !== '') {
          this.searchByAddress(searchOptions.localizacao)
              .then( res => {
                if (res.results[0] !== undefined) {
                    const lat = res.results[0].geometry.location.lat;
                    const lng = res.results[0].geometry.location.lng;

                    this.findBetterDistance(lat, lng);
                    resolve(this.searchByColor(searchOptions));
                } else {
                  this.listSearch = new Array<Car>();
                  resolve ();
                }
            })
            .catch( error => reject(error) );
          } else {
              resolve(this.searchByColor(searchOptions));
          }
      });
    }

    searchByAddress(adreess: string) {
      return new Promise<any> ((resolve, reject) => {
           this.getGoelocation(adreess)
             .then( res => resolve(res))
             .catch( error => reject(error));
      });
    }

    findBetterDistance(lat, lng) {
      const newList = new Array<Car>();
        this.listUsers.forEach(user => {
            const pos_1 = new Array(lat, lng);
            const pos_2 = user.geolocation;
            const distancia = this.getDistance(pos_1, pos_2);

            let km: number = (distancia / 1000);
            km = Math.floor(km * 1000) / 1000;

             if (km <= 0.010) {
             this.listSearch.forEach(car => {
                if (car.userEmail === user.email) { newList.push(car); }
             });
            }
        });
        this.listSearch = newList;
    }

    searchByColor(searchOptions: Search) {
      if (searchOptions.cor !== undefined) {
          if (searchOptions.cor !== 'Outros') {
            const newList = new Array<Car>();
             this.listSearch.forEach(car => {
                  if (car.cor === searchOptions.cor) {
                    newList.push(car);
                  }
             });
             this.listSearch = newList;
          }
      }
      this.searchByType(searchOptions);
    }

    orderByRelevance(searchOptions: Search) {
       if (searchOptions.relevancia !== undefined) {
          const relevance = searchOptions.relevancia;
          const newList = this.listSearch;
            newList.sort((a,b) => {
                return relevance === 'true' ?  a.preco - b.preco :  b.preco - a.preco;
            });
            this.listSearch = newList;
       }
    }


    searchByDetail(searchOptions: Search) {
      if (searchOptions.detalhes !== undefined) {
        const detailArray = searchOptions.detalhes;
        const newList = new Array<Car>();
            this.listSearch.forEach(car => {
              let cont = 0;
              car.detalhes.forEach( detalhe => {
                  detailArray.forEach( detalheSelect => {
                    if (detalheSelect === detalhe) {
                      cont++;
                    }
                  });
              });
              if (cont === detailArray.length) {
                newList.push(car);
              }
          });
          this.listSearch = newList;
        }
       this.orderByRelevance(searchOptions);
    }

    searchByType(searchOptions: Search) {
        const selectArray = searchOptions.tipoCarro;
        if (selectArray !== undefined) {
          const newList = new Array<Car>();
           this.listSearch.forEach (car => {
             let cont = 0;
             selectArray.forEach ( currentType => {
                if ( currentType === car.tipoCarro ) {
                  cont++;
                }
             });
             if (cont > 0) {
                newList.push(car);
             }
          });
          this.listSearch = newList;
        }
         this.searchByDetail(searchOptions);
    }

    constructorAtributeSearchArray() {
       this.atributeSearchArray = new Array('localizacao', 
       /*'dataInicial', 'horaInicial', 'dataFinal', 'horaFinal', -> Atributos para uma futura utilidade */
      'relevancia', 'cor', 'tipoCarro', 'detalhes');
    }


    getGoelocation(address: string) {
        // tslint:disable-next-line:max-line-length
        const a = 'https://maps.googleapis.com/maps/api/geocode/json?address="' + address + '"&key=AIzaSyCFWe35wKScc5XbiyRN4LqL3Qdgnq198G0&sensor=false"';
        return this._http.get(a).toPromise().then(res => res.json());
    }

    getDistance(p1, p2) {
       let R = 6378137;
       let dLat = this.rad(p2[0] - p1[0]);
       let dLong = this.rad(p2[1] - p1[1]);
       let a = Math.sin(dLat / 2)
               * Math.sin(dLat / 2)
               + Math.cos(this.rad(p1[0]))
               * Math.cos(this.rad(p2[0]))
               * Math.sin(dLong / 2)
               * Math.sin(dLong / 2);
       let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
       let d = R * c;
       d/=1000;
       return d;
    }

    rad(x) {
       return x * Math.PI / 180;
    }

    getValueFromUrl(url) {
      let routerArray = url.split('/');
      return routerArray[2];
    }


}
