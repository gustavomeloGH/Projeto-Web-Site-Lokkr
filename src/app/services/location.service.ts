import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Address } from '../entity/address';

@Injectable()
export class LocationService {

    readonly BASE_URL = 'https://viacep.com.br/ws';

    constructor(private http: Http) {

    }

    getAddress(cep): Promise<Address> {
        return new Promise<Address>((resolve, reject) => {
            let unmaskedCep = cep.replace('-', '');
            unmaskedCep = unmaskedCep.replace('.', '');

            this.http.get(`${this.BASE_URL}/${unmaskedCep}/json/`, {headers: this.getHeaders()})
                .map(res => res.json())
                .subscribe(
                    address => resolve(this.parseAddress(address)),
                    error => reject(error)
                );
        });
    }

    parseAddress(resultingAddres): Address {
        let address = new Address();
        address.street = resultingAddres.logradouro;
        address.neighborhood = resultingAddres.bairro;

        address.city = resultingAddres.localidade;
        address.state = resultingAddres.uf;
        address.ibge = resultingAddres.ibge;
        return address;
    }

    private getHeaders(): Headers {
        let headers = new Headers();
        headers.append('Accept', 'application/json');
        return headers;
    }
}
