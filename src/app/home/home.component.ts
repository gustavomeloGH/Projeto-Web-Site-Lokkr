import { UserViewModel } from '../entity/UserViewModel';
import { User } from '../entity/User';
import { UserService } from '../services/user.service';
import { CarService } from '../services/car.service';
import { ENTITIES } from '../../util/ENTITIES';
import { DaoService } from '../services/dao.service';
import { Car } from '../entity/Car';
import { Component, OnInit, ViewEncapsulation  } from '@angular/core';
import { Router } from '@angular/router';

declare var jQuery: any;


@Component({
  selector: 'app-home',
  providers: [DaoService, CarService, UserService],
  templateUrl: './home.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit {

  cars: Car[];
  users: User[];
  mergeCarsUsers: Array<any>;
  search: string;

  constructor( private router: Router,
               private daoService: DaoService,
               private carService: CarService,
               private UserService: UserService) {

      this.search = '';

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
    jQuery('.slider').slider();
    jQuery('.img-car img').width(390);
    jQuery(document).ready(function(){
    jQuery('.parallax').parallax();
    });
  }

  goToSearch() {
    this.router.navigate([`search/${this.search}`]);
  }

  goToLogin() {
    this.router.navigate(['login']);
  }

  goToHowWorks() {
    this.router.navigate(['how-works']);
  }

   checkLoad() {
     if (this.users !== undefined && this.cars !== undefined) {
        this.mergeLists();
     }
   }

   goToCarView(key: string) {
      this.router.navigate([`car-view/${key}`]);
   }

  mergeLists() {
    let mergeArray = new Array<UserViewModel>();
    this.users.forEach(user => {
      if(mergeArray.length < 6) {
          this.cars.filter(car => car.userEmail === user.email)
            .forEach(userCar => {
              const userViewModel = new UserViewModel(
                user.$key,
                userCar.marca,
                userCar.modelo,
                userCar.ano,
                userCar.preco,
                userCar.avaliacao,
                user.nome,
                user.sobrenome,
                user.bairro,
                user.cidade,
                user.estado,
                user.fotoPerfil,
                userCar.fotosCarro,
                user.email);
                mergeArray.push(userViewModel);
            });
          }
    });
     mergeArray = mergeArray.sort(( a, b ) => {
      return b.avaliacaoCar - a.avaliacaoCar;
    });
    this.mergeCarsUsers = mergeArray;
  }




}
