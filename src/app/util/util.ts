export function formatValorEnMoneda(valor: number) {
    return new Intl.NumberFormat().format(valor);
  }