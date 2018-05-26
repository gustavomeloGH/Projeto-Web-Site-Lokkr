import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as firebase from 'firebase';

@Injectable()
export class DaoService {

    image: string;

    constructor(private angularFire: AngularFireDatabase) {}

    insert<T>(entity: string, obj: T): Promise<string> {
      return new Promise<string>((resolve, reject) => {

        this.angularFire.list(entity).push(obj)
          .then(key => resolve(key))
          .catch(error => reject(error)); ;
      });
    }

    update<T>(entity: string, key: string, data: any): Promise<void> {
        return new Promise<void>((resolve, reject) => {

            this.angularFire.list(entity).update(key, data)
                .then(() => resolve())
                .catch(error => reject(error));
        });
    }

    remove<T>(entity: string, key: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {

            this.angularFire.list(entity).remove(key)
                .then(() => resolve())
                .catch(error => reject(error));
        });
    }

    list<T>(entity: string): Observable<T[]> {
        return this.angularFire.list(entity);
    }

    search<T>(entity: string, property: string, value: any): Observable<T[]> {
        return this.angularFire.list(entity, {
            query: {
                orderByChild: property,
                equalTo: value
            }
        });
    }

    get<T>(entity: string, property: string, value: any): Promise<T> {
        return new Promise<T>((resolve, reject) => {

            this.angularFire.list(entity, {
                query: {
                    orderByChild: property,
                    equalTo: value
                }
                })
                .subscribe(
                    result => resolve(result[0]),
                    error => reject(error)
                );
        });
    }
     getByKey<T>(entity: string,  value: any): Promise<T> {
        return new Promise<any>((resolve, reject) => {

            this.angularFire.list(entity, {
                query: {
                    orderByKey: value,
                    equalTo: value
                }
                })
                .subscribe(
                    result => resolve(result[0]),
                    error => reject(error)
                );
        });
    }

    uploadImg(img, userKey, path) {
        let fileName = img.name;
        const storageRef = firebase.storage().ref(`${path}/${userKey}/${fileName}`);
        let uploadTask = storageRef.put(img);
        // tslint:disable-next-line:no-unused-expression
        uploadTask.on('state_changed', snapshot => {
             return uploadTask.snapshot.downloadURL;
        }), (error) => {
           return ('Imagem inválida! Tente outra imagem.');
        };
    }

     upload(img, userKey, path) {
        let fileName = img.name;
        const storageRef = firebase.storage().ref(`${path}/${userKey}/${fileName}`);
        return new Promise<any> ((resolve, reject) => {
            // tslint:disable-next-line:no-unused-expression
            storageRef.put(img)
                .then( (res) => resolve(res.downloadURL))
                .catch((error) => reject(error));
        });
    }

    removeUpload(img, userKey, path) {
        const storageRef = firebase.storage().ref(`${path}/${userKey}`);
       const desertRef = storageRef.child(`/${img}`);
        desertRef.delete().then( () => {
        }).catch(function(error) {
        });
    }


    removeArrayUpload(img, userKey, path) {
        const storageRef = firebase.storage().ref(`${path}/${userKey}`);
        const desertRef = storageRef.child(`/${img}`);
        return new Promise<any> ((resolve, reject) => {
            desertRef.delete()
            .then( () => resolve())
            .catch( error => reject(error) );
        })
    }





}