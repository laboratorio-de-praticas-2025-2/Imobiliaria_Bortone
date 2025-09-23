// Função auxiliar para verificar horário comercial
export function dentroHorario() {
  const hora = new Date().getHours();
  if (hora >= 8 && hora < 18) {
    return true;
  } else {
    return "Atendimento indisponível, tente novamente mais tarde";
  }
}
