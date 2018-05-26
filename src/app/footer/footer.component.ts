import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(private router: Router) {

   }

  ngOnInit() {
  }

 
  goToRegister() {
    this.router.navigate(['register']);
  }

  goToHome() {
    this.router.navigate(['home']);
  }

  goToHowWorks() {
    this.router.navigate(['how-works']);
  }

  goToLogin() {
    this.router.navigate(['login']);
  }

  goToSearch() {
    this.router.navigate(['search']);
  }

}
