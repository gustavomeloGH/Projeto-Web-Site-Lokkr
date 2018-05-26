import { Router } from '@angular/router';
import { UserViewModel } from '../entity/UserViewModel';
import { UserService } from '../services/user.service';
import { User } from '../entity/User';
import { Car } from '../entity/Car';
import { CarService } from '../services/car.service';
import { Search } from '../entity/Search';
import { SearchServiceService } from '../services/search.service';
import { DaoService } from '../services/dao.service';
import { ENTITIES } from '../../util/ENTITIES';
import { CarSelect } from '../entity/CarSelect';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

declare var jQuery: any;

@Component({
  selector: 'app-search',
  providers: [DaoService, SearchServiceService, CarService, UserService],
  templateUrl: './search.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements OnInit {
    listCor: CarSelect[];
    searchOptions: Search;
    cars: Car[];
    users: User[];
    mergeCarsUsers: Array<any>;
    isEmpty: boolean;
    boo: boolean;

  constructor( private router: Router,
               private daoService: DaoService,
               private searchService: SearchServiceService,
               private carService: CarService,
               private UserService: UserService) {

    this.boo = true;
    this.isEmpty = false;
    this.daoService.list<CarSelect>(ENTITIES.cor)
      .subscribe(colors =>  this.listCor = colors);

    this.searchOptions = new Search();
    this.daoService.list<Car>(ENTITIES.car)
      .subscribe( cars => {
        this.cars = cars;
        this.cars = this.carService.slice(this.cars);
        this.checkLoad();
      });

      this.daoService.list<User>(ENTITIES.user)
      .subscribe( users => {
        this.users = users;
        this.checkLoad();
      });

  }

  ngOnInit() {
      this.getSearch();
      jQuery('select').material_select();
      jQuery(document).ready(function(){
        jQuery('.modal').modal();
    });
  }

  search() {
      this.getValueSelect();
      this.searchService.searchResults(this.searchOptions)
        .then(res => {
            if (res.length === 0) {
              this.infoListEmpty();
            } else {
              this.foundList(res);
            }
          });
  }

  infoListEmpty () {
    this.removePushPin();
    this.mergeCarsUsers = new Array<any>();
    this.isEmpty = true;
  }

  foundList(resultado) {
    this.isEmpty = false;
    this.cars = this.carService.slice(resultado);
    this.mergeLists();
    this.verifyPushPin();
  }

  verifyPushPin() {
    const size = this.cars.length;
    if (size > 3) {
      this.activePushPin(size);
    } else {
      this.removePushPin();
    }
  }

  getValueSelect() {
    const selectType = jQuery('#selectType').val();
    const selectDetail = jQuery('#selectDetail').val();
    const selectRelevance =  jQuery('#selectRelevance').val();
    this.searchOptions.tipoCarro = this.checkSelectValue(selectType, this.searchOptions.tipoCarro);
    this.searchOptions.detalhes = this.checkSelectValue(selectDetail, this.searchOptions.detalhes);
    this.searchOptions.relevancia = this.checkSelectValue(selectRelevance, this.searchOptions.relevancia);
  }

  checkSelectValue (selectClicked, selectList) {
    if (selectClicked !== null) {
        if (selectClicked.length !== 0) {
            return selectList = selectClicked;
        }
    }
  }

  checkLoad() {
     if (this.users !== undefined && this.cars !== undefined) {
        this.mergeLists();
        this.activePushPin(5);
     }
   }

   mergeLists() {
    const mergeArray = new Array<UserViewModel>();
    this.cars.forEach(car => {
      this.users.filter(user => car.userEmail === user.email)
        .forEach(currentUser => {
          const userViewModel = new UserViewModel(
            currentUser.$key,
            car.marca,
            car.modelo,
            car.ano,
            car.preco,
            car.avaliacao,
            currentUser.nome,
            currentUser.sobrenome,
            currentUser.bairro,
            currentUser.cidade,
            currentUser.estado,
            currentUser.fotoPerfil,
            car.fotosCarro,
            currentUser.email);
            mergeArray.push(userViewModel);
        });
    });
    this.mergeCarsUsers = mergeArray;
  }

  goToCarView(userKey: string) {
      this.router.navigate([`car-view/${userKey}`]);
   }

   activePushPin(size) {
     let btm;
     if(size < 5) {
        btm = 1800;
     } else {
       btm = 2350;
     }
     jQuery('#search-filter').pushpin({
          top: 0,
          bottom: btm,
          offset: 0
    });
   }

   removePushPin() {
    jQuery('#search-filter').pushpin('remove');
   }

   getSearch() {
     let search = this.searchService.getValueFromUrl(this.router.url);
     if ( search ) {
        search = decodeURIComponent(search);
        this.searchOptions.localizacao = search;
        jQuery('#location-input').val(search);
        this.search();
     }
   }

}

