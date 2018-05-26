import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css']
})
export class ShareComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
   goToHome() {
    this.router.navigate(['home']);
  }

  goToSearch() {
    this.router.navigate(['search']);
  }

   goToHowWorks() {
    this.router.navigate(['how-works']);
   }

   goToLogin() {
     this.router.navigate(['login']);
   }


}
