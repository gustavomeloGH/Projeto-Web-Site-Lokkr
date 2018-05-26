export class Share {
    $key: string;
    solicitadorKey: string;
    proprietarioKey: string;
    proprietarioCarKey: string;
    dataInicial: Date;
    dataFinal: Date;
    horaInicial: string;
    horaFinal: string;
    status: number;
    emAberto: boolean;

    constructor ($solicitadorKey, $proprietarioKey, $proprietarioCarKey, dataInicial, horaInicial, dataFinal, horaFinal) {
        this.status = 0;
        this.emAberto = true;
        this.solicitadorKey = $solicitadorKey;
        this.proprietarioKey = $proprietarioKey;
        this.proprietarioCarKey = $proprietarioCarKey;
        this.dataInicial = dataInicial;
        this.horaInicial = horaInicial;
        this.dataFinal = dataFinal;
        this.horaFinal = horaFinal;
    }


    /*
         ! STATUS GUIA:
         0 - pendente
         1 - recusado
         2 - aceito
         3 - prazo esgotado
         4 - aguardando entrega
         5 - aguardando avaliação
         6 - entregue

     */
}