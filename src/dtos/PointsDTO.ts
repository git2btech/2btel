export type PointsItensDTO = {
    apontamentoId: number,
    codigoChave: string,
    codigoProduto: string,
    id: number,
    nFe: string,
    nomeProduto: string,
    numeroSelecao: number,
    produtoId: number,
    quantidade: number,
    serial: string,
    tipoApontamento: number
}

export type PointsDTO = {
    codigo: number,
    codigoDeposito: string,
    dataApontamento: string,
    dataRegistro: string,
    depositoId: number,
    id: number,
    items: PointsItensDTO[],
    latitude: string,
    loginRegistro: string,
    longitude: string,
    maquinaId: number,
    matricula: string,
    modeloMaquina: string,
    nomeDeposito: string,
    quantidade: number,
    tipoApontamento: string,
    total: number
}