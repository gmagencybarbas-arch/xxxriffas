/**
 * Configurações globais (no futuro vêm do painel admin / API).
 * Ajuste aqui até existir backend.
 */
export const siteConfig = {
  /** Popup “Espere!” ao sair da rifa / checkout / abrir carrinho */
  exitPromo: {
    /** Ligar ou desligar a função inteira */
    enabled: true,
    /** Bilhetes extras se finalizar dentro do prazo (mesmo número no texto do modal) */
    bonusTickets: 15,
    /** Prazo do bônus: countdown do modal + alinhado ao timer do checkout (3 min = 180s) */
    modalOfferSeconds: 180,
  },
  /** Checkout — urgência para concluir a compra (mesmo prazo da promo do popup) */
  checkout: {
    urgencySeconds: 180,
  },
} as const;
