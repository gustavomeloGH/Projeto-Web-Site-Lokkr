export class CarViewModel {
    $key: string;
    nome: string;
    sobrenome: string;
    profileFoto: string;
    marca: string;
    modelo: string;
    ano: string;
    bairro: string;
    cidade: string;
    delivery: boolean;
    permissoes: Array<string>;
    detalhes: Array<string>;
    descricao: string;
    preco: number;
    fotosCarro: Array<string>;
    avaliacao: number;

    constructor($key: string, nome, sobrenome, profileFoto, bairro, cidade, marca, modelo,
                 ano, delivery, permissoes, detalhes, descricao, preco, fotosCarro, avaliacao) {
        this.$key = $key;
        this.nome = nome;
        this.sobrenome = sobrenome;
        this.profileFoto = profileFoto;
        this.marca = marca;
        this.modelo = modelo;
        this.ano = ano;
        this.bairro = bairro;
        this.cidade = cidade;
        this.delivery = delivery;
        this.permissoes = permissoes;
        this.detalhes = detalhes;
        this.descricao = descricao;
        this.preco = preco;
        this.fotosCarro = fotosCarro;
        this.avaliacao = avaliacao;
    }

}