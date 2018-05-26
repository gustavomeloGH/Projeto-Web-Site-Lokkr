export class UserViewModel { 
    $key: string;
    marca: string;
    modelo: string;
    ano: string;
    preco: number;
    avaliacaoCar: number;
    nome: string;
    sobrenome: string;
    bairro: string;
    cidade: string;
    estado: string;
    imgCar: Array<string>;
    imgUser: string;
    email: string;

    constructor($key, marca, modelo, ano, preco,  avaliacaoCar, nome, sobrenome, bairro, cidade, estado, imgUser, imgCar, email) {
        this.$key = $key;
        this.marca = marca;
        this.modelo = modelo;
        this.ano = ano;
        this.preco = preco;
        this.avaliacaoCar = avaliacaoCar;
        this.nome = nome;
        this.sobrenome = sobrenome;
        this.bairro = bairro;
        this.cidade = cidade;
        this.estado = estado;
        this.imgUser = imgUser;
        this.imgCar = imgCar;
        this.email = email;
    }
}