// Função auxiliar para verificar horário comercial
export function dentroHorario() {
  const hora = new Date().getHours();
  return hora >= 8 && hora < 18; // 08:00 até 17:59
}