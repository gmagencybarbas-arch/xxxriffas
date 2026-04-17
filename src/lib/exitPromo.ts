/** localStorage: usuário aceitou ir ao checkout com a promo (v2 = ignora aceite antigo em testes). */
export const LS_EXIT_PROMO_ACCEPTED = "xxxriffas-exclusive-promo-accepted-v2";
/** sessionStorage: já mostramos o popup nesta sessão (trocar versão para invalidar testes antigos). */
export const SS_EXIT_PROMO_OFFERED = "xxxriffas-exit-promo-offered-session-v3";

export const EVENT_TRIGGER_EXIT_PROMO = "xxxriffas-trigger-exit-promo";
export const EVENT_OPEN_CART = "xxxriffas-open-cart";

export type ExitPromoAfterDismiss =
  | "home"
  | "open-cart"
  /** Checkout: voltar à página da rifa sem pagar */
  | "back-to-raffle";
