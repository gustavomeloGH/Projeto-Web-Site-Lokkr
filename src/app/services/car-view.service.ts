import { Share } from '../entity/Share';
import { Injectable } from '@angular/core';

@Injectable()
export class CarViewService {

  constructor() { }


  checkHour(hour: string) {
    let boo = false;
    if (hour) {
        if (hour.length >= 5) {
            const arrayCheck = hour.split(':');
            boo =  parseInt(arrayCheck[0]) <= 24 && parseInt(arrayCheck[1].substr(0, 2)) < 60;
        }
    }
    return boo;
  }

   checkValidData(initialDate, finalDate, initialHour, finalHour) {
      let boo = false;

      if (initialDate !== undefined
          && finalDate !== undefined
          && this.checkHour(initialHour)
          && this.checkHour(finalHour)) {

            const today = new Date();
            const ano = today.getFullYear();
            const initialD = initialDate;
            const finalD = finalDate;


            boo = (initialDate !== finalDate
                  && initialD < finalD
                  && initialD > today
                  && initialD.getFullYear() === ano
                  && finalD.getFullYear() === ano);
         }
        return boo;
    }

  haveRentAtThisTime(shareList, user, initialDate, finalDate) {
      return shareList.some( e => { return e.status === 2
                                          && this.checkDataIn(e, initialDate, finalDate)
                                          && e.proprietarioKey === user.$key; });
  }


  thereIsConflitTime(shareList, anotherUser,  initialDate, finalDate) {
      let thereIsConflitTime;
      if (shareList) {
           thereIsConflitTime = shareList.some( current => {
           return ( current.emAberto
                    && current.solicitadorKey === anotherUser.$key
                    && this.checkDataIn(current, initialDate, finalDate ));
        });
      } else {
        thereIsConflitTime = false;
      }
      return thereIsConflitTime;
  }

  checkDataIn(current, initialDate, finalDate): boolean {
      return new Date(initialDate) <= new Date(current.dataFinal)
              && new Date(current.dataInicial) <= new Date(finalDate);
  }

}