import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare var jQuery: any;


@Component({
  selector: 'app-how-work',
  templateUrl: './how-work.component.html',
  styleUrls: ['./how-work.component.css']
})
export class HowWorkComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    jQuery(document).ready(function(){
    jQuery('.parallax').parallax();
    });
    jQuery(document).ready(function(){
    jQuery('.collapsible').collapsible();
  });
}

goToLogin() {
    this.router.navigate(['login']);
  }

  goToSearch() {
    this.router.navigate(['search']);
  }


}
