export const calcularSimulacao = async (req, res) => {
  
  //SAC
  function calcularSAC(principal, jurosMensal, parcelasNum) {
    const amortizacao = principal / parcelasNum;
    let saldoDevedor = principal;
    const parcelas = [];
    let totalPago = 0;

    for (let i = 0; i < parcelasNum; i++) {
      const juros = saldoDevedor * jurosMensal;
      const parcela = amortizacao + juros;
      parcelas.push(Number(parcela.toFixed(2)));
      totalPago += parcela;
      saldoDevedor -= amortizacao;
    }

    return {
      primeiraParcela: parcelas[0],
      ultimaParcela: parcelas[parcelas.length - 1],
      totalPago: Number(totalPago.toFixed(2)),
      parcelas
    };
  }

  const { tipo, valorImovel, entrada, parcelas, modalidade } = req.body;

  // normalizacao valores
  const valor = Number(valorImovel) || 0;
  const entradaNum = Number(entrada) || 0;
  const parcelasNum = parseInt(parcelas, 10) || 0;
  const mod = (modalidade || 'price').toLowerCase();

  function round(v) { return Number(v.toFixed(2)); }

  if (tipo === 'imovel' || tipo === 'IMOVEL') {
    if (parcelasNum <= 0) {
      return res.status(400).json({ sucesso: false, erro: 'Parcelas deve ser maior que 0' });
    }
    if (parcelasNum > 420) {
      return res.status(400).json({ sucesso: false, erro: 'Parcelas não pode ser maior que 420' });
    }
    if (entradaNum > valor) {
      return res.status(400).json({ sucesso: false, erro: 'A entrada não pode ser maior que o valor do imóvel.' });
    }
    const principal = Math.max(valor - entradaNum, 0);
    const jurosMensal = 0.0094; //0.94% ao mês
    const parcelaSemJuros = principal / parcelasNum;
    const totalSemJuros = principal + entradaNum;

    if (mod === 'sac') {
      const sac = calcularSAC(principal, jurosMensal, parcelasNum);
      return res.json({
        sucesso: true,
        tipo,
        modalidade: 'sac',
        valorImovel: valor,
        entrada: entradaNum,
        parcelas: parcelasNum,
        resultado: {
          valorFinanciado: round(principal),
          primeiraParcela: sac.primeiraParcela,
          ultimaParcela: sac.ultimaParcela,
          totalPago: sac.totalPago,
          parcelas: sac.parcelas
        }
      });
    } else {
      let parcelaComJuros;
      if (jurosMensal === 0) {
        parcelaComJuros = parcelaSemJuros;
      } else {
        const i = jurosMensal;
        const n = parcelasNum;
        const fator = Math.pow(1 + i, n);
        parcelaComJuros = principal * (i * fator) / (fator - 1);
      }
      const totalParcelasComJuros = parcelaComJuros * parcelasNum;
      const totalComJuros = totalParcelasComJuros;
      return res.json({
        sucesso: true,
        tipo,
        modalidade: 'price',
        valorImovel: valor,
        entrada: entradaNum,
        parcelas: parcelasNum,
        resultado: {
          valorFinanciado: round(principal),
          parcelaSemJuros: round(parcelaSemJuros),
          totalSemJuros: round(totalSemJuros),
          jurosMensal,
          parcelaComJuros: round(parcelaComJuros),
          totalComJuros: round(totalComJuros)
        }
      });
    }
  }

  if (tipo === 'terreno' || tipo === 'TERRENO') {
    if (parcelasNum <= 0) {
      return res.status(400).json({ sucesso: false, erro: 'Parcelas deve ser maior que 0' });
    }
    if (parcelasNum > 420) {
      return res.status(400).json({ sucesso: false, erro: 'Parcelas não pode ser maior que 420' });
    }
    if (entradaNum > valor) {
      return res.status(400).json({ sucesso: false, erro: 'A entrada não pode ser maior que o valor do terreno.' });
    }
    const principal = Math.max(valor - entradaNum, 0);
    const jurosMensal = 0.01; //1% ao mês
    const parcelaSemJuros = principal / parcelasNum;
    const totalSemJuros = principal + entradaNum;

    if (mod === 'sac') {
      const sac = calcularSAC(principal, jurosMensal, parcelasNum);
      return res.json({
        sucesso: true,
        tipo,
        modalidade: 'sac',
        valorImovel: valor,
        entrada: entradaNum,
        parcelas: parcelasNum,
        resultado: {
          valorFinanciado: round(principal),
          primeiraParcela: sac.primeiraParcela,
          ultimaParcela: sac.ultimaParcela,
          totalPago: sac.totalPago,
          parcelas: sac.parcelas
        }
      });
    } else {
      let parcelaComJuros;
      if (jurosMensal === 0) {
        parcelaComJuros = parcelaSemJuros;
      } else {
        const i = jurosMensal;
        const n = parcelasNum;
        const fator = Math.pow(1 + i, n);
        parcelaComJuros = principal * (i * fator) / (fator - 1);
      }
      const totalParcelasComJuros = parcelaComJuros * parcelasNum;
      const totalComJuros = totalParcelasComJuros;
      return res.json({
        sucesso: true,
        tipo,
        modalidade: 'price',
        valorImovel: valor,
        entrada: entradaNum,
        parcelas: parcelasNum,
        resultado: {
          valorFinanciado: round(principal),
          parcelaSemJuros: round(parcelaSemJuros),
          totalSemJuros: round(totalSemJuros),
          jurosMensal,
          parcelaComJuros: round(parcelaComJuros),
          totalComJuros: round(totalComJuros)
        }
      });
    }
  }

  // Caso o tipo da simualação seja inválido
  return res.status(400).json({ sucesso: false, erro: 'Tipo de simulação inválido.' });
};

export default {calcularSimulacao};