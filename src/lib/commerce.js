import Commerce from '@chec/commerce.js';

export const commerce = new Commerce(process.env.REACT_APP_CHEC_PUBLIC_KEY, true);
// Ahora puedo usar esta instancia/objeto en todo el proyecto para llamar funciones del commerce