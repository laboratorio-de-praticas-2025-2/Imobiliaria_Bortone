import RecomendacaoImovel from '../models/recomendacaoImovelModel.js'; 
import Imovel from '../models/imovelModel.js';
import { Sequelize } from 'sequelize';
// Importa o Lodash para simplificar a manipulação de arrays e objetos.
import _ from 'lodash'; 

// Insere um novo registro de visita na tabela `recomendacao_imovel`.
export const createRecomendacao = async (data) => {
    try {
        const novaRecomendacao = await RecomendacaoImovel.create(data);
        return novaRecomendacao;
    } catch (error) {
        throw new Error('Não foi possível criar a recomendação: ' + error.message);
    }
};

// Busca os 5 imóveis mais visitados por um usuário específico.
const getTopImoveisVisitados = async (usuario_id) => {
    return await RecomendacaoImovel.findAll({
        attributes: [
            'imovel_id',
            // Usa COUNT para contar a frequência de cada `imovel_id`.
            [Sequelize.fn('COUNT', Sequelize.col('imovel_id')), 'visitas']
        ],
        where: { usuario_id },
        group: ['imovel_id'],
        // Ordena do mais visitado para o menos visitado.
        order: [[Sequelize.fn('COUNT', Sequelize.col('imovel_id')), 'DESC']],
        limit: 5,
        raw: true
    });
};

// Infere o perfil de preferência do usuário com base em seu histórico de visitas.
// Retorna um objeto com o `tipo`, `cidade`, `estado` e faixa de `preco` preferidos.
const inferirPreferencias = async (idsImoveis) => {
    if (_.isEmpty(idsImoveis)) {
        return null;
    }

    // Busca no banco de dados os dados completos (tipo, cidade, estado, preco) dos imóveis visitados.
    const imoveisReferencia = await Imovel.findAll({
      // É um operador do Sequelize. Ele representa o operador SQL IN
        where: { id: { [Sequelize.Op.in]: idsImoveis } },
        attributes: ['tipo', 'cidade', 'estado', 'preco'],
        raw: true
    });

    if (_.isEmpty(imoveisReferencia)) {
        return null;
    }

    // Com o lodash, encontra o 'tipo', 'cidade' e 'estado' mais frequentes.
    // 1. `_.countBy`: Conta a frequência de cada atributo (ex: {"Casa": 3, "Terreno": 2}).
    // 2. `_.toPairs`: Converte o objeto de contagem em um array de pares (ex: [["Casa", 3], ["Terreno", 2]]).
    // 3. `_.maxBy`: Encontra o par com o maior valor (a maior contagem).
    // 4. `_.head`: Pega o primeiro elemento do par, que é o nome do atributo (ex: "Casa").
    const preferencias = {
        tipo: _.head(_.maxBy(_.toPairs(_.countBy(imoveisReferencia, 'tipo')), _.last)),
        cidade: _.head(_.maxBy(_.toPairs(_.countBy(imoveisReferencia, 'cidade')), _.last)),
        estado: _.head(_.maxBy(_.toPairs(_.countBy(imoveisReferencia, 'estado')), _.last)),
    };
    
    // Pega todos os preços dos imóveis de referência.
    const precos = _.map(imoveisReferencia, 'preco');
    // Calcula o preço médio.
    const precoMedio = _.mean(precos);

    // Define uma faixa de preço (entre 80% e 120% do preço médio) para a recomendação.
    preferencias.precoMin = precoMedio * 0.8;
    preferencias.precoMax = precoMedio * 1.2;
    
    return preferencias;
};

// Retorna os 20 imóveis mais populares do sistema (geral), usados como fallback.
const getImoveisPopulares = async () => {
    // `attributes` define as colunas que vão vir como resposta.
    const imoveisPopulares = await RecomendacaoImovel.findAll({
        attributes: [
            'imovel_id', 
            // `Sequelize.fn` permite usar funções SQL, como COUNT.
            [Sequelize.fn('COUNT', Sequelize.col('imovel_id')), 'visitas']
        ],
        group: ['imovel_id'],
        // A consulta ordena pelo número de visitas (a contagem) de forma descendente (`DESC`), ou seja, do mais visitado para o menos visitado.
        order: [[Sequelize.fn('COUNT', Sequelize.col('imovel_id')), 'DESC']],
        // Retornará os 20 imóveis mais visitados.
        limit: 20,
        // `raw: true` garante que o Sequelize retorne um array de objetos JSON
        raw: true
    });
    
    // Extrai apenas os IDs dos imóveis mais populares.
    const idsPopulares = _.map(imoveisPopulares, 'imovel_id');

    // Retorna os dados completos desses imóveis, filtrando por status 'disponivel'.
    return await Imovel.findAll({
        where: {
            id: {
                [Sequelize.Op.in]: idsPopulares
            },
            status: 'disponivel' 
        },
        limit: 20
    });
};

// Função principal que gera as recomendações de imóveis para um usuário. Se o usuário tiver histórico, usa-o para inferir preferências; caso contrário, retorna imóveis populares.
export const getRecomendacoesByUserId = async (usuario_id) => {
    try {
        // Pega o histórico de imóveis visitados pelo usuário.
        const imoveisVisitados = await getTopImoveisVisitados(usuario_id);

        // Neste caso, retorna os imóveis mais populares do sistema como fallback.
        if (_.isEmpty(imoveisVisitados)) {
            console.log('Usuário sem histórico. Retornando imóveis populares.');
            return await getImoveisPopulares();
        }

        // Extrai os IDs dos imóveis visitados para evitar recomendá-los novamente.
        const idsImoveisVisitados = _.map(imoveisVisitados, 'imovel_id');
        // Infere as preferências do usuário com base no histórico.
        const preferencias = await inferirPreferencias(idsImoveisVisitados);

        // Constrói o objeto de filtros para a busca, incluindo status 'disponivel'.
        const filtros = {
            id: {
                [Sequelize.Op.notIn]: idsImoveisVisitados
            },
            status: 'disponivel',
            tipo: preferencias.tipo,
            cidade: preferencias.cidade,
            estado: preferencias.estado
        };

        // Adiciona a condição de preço APENAS se os valores calculados (`precoMin` e `precoMax`) forem números válidos. Isso previne erros de consulta no banco de dados.
        if (!_.isNaN(preferencias.precoMin) && !_.isNaN(preferencias.precoMax)) {
            filtros.preco = {
                [Sequelize.Op.between]: [preferencias.precoMin, preferencias.precoMax]
            };
        }

        // Realiza a busca final no banco de dados com todos os filtros.
        const imoveisRecomendados = await Imovel.findAll({
            where: filtros,
            limit: 20 
        });

        // Retorna a lista de imóveis recomendados.
        return imoveisRecomendados;

    } catch (error) {
        console.error(error);
        throw new Error('Não foi possível buscar as recomendações: ' + error.message);
    }
};