export class Car {
    chassi: number;
    placa: string;
    marca: string;
    modelo: string;
    ano: string;
    quilometragem: string;
    combustivel: string;
    tipoCarro: string;
    detalhes: Array<string>;
    permissao: Array<string>;
    delivery: boolean;
    fotosCarro: any;
    descricao: string;
    preco: number;
    $key: string;
    userEmail: string;
    cor: string;
    pathFotos: Array<any>;
    avaliacao: number;

    constructor () {
        this.detalhes = new Array<string>();
        this.permissao = new Array<string>();
        this.preco = 0;
        this.avaliacao = 0;
    }
}