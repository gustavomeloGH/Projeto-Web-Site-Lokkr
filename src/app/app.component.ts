import { ENTITIES } from '../util/ENTITIES';
import { Share } from './entity/Share';
import { DaoService } from './services/dao.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Renderer } from '@angular/core';
import * as firebase from 'firebase';

declare var jQuery: any;

@Component({
  selector: 'app-root',
  providers: [DaoService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  constructor(private router: Router, private renderer: Renderer,
              private daoService: DaoService) {
                this.checkTimesOverRequest();
               }

  isShowBasic () {
    if(this.router.url.includes('/search')) {
      jQuery('nav').css('position', 'fixed');
     } else {
       jQuery('nav').css('position', 'initial');
     }

    return this.router.url !== '/login';
  }

  ngOnInit() {
  }

  onDeactivate() {
    this.renderer.setElementProperty(document.body, 'scrollTop', 0);
  }

  isNotDashboard() {
    return this.router.url === '/dashboard';
  }

  checkTimesOverRequest() {
    const today = new Date('2017-08-06');

    this.daoService.list<Share>(ENTITIES.share)
      .subscribe( shareList => {
          shareList.forEach(currShare => {
            if (currShare.emAberto) {
                if (currShare.status === 0) {
                    const initialD = new Date(currShare.dataInicial);
                    if (today >= initialD) {
                      this.updateShare(currShare, 3, false);
                    }
                } else if (currShare.status === 2) {
                    const finalD = new Date(currShare.dataFinal);
                    if (today >= finalD) {
                      this.updateShare(currShare, 4, true);
                    }
                }
            }
          });
      });
  }

  updateShare(currShare, newStatus, tipo) {
    this.daoService.update<Share>
        (ENTITIES.share, currShare.$key,
        { status : newStatus, emAberto : tipo });
  }
}
