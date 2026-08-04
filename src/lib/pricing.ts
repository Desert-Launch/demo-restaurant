import {
  DELIVERY_FEE_FILS,
  VAT_RATE,
  type OrderTotals,
  type OrderType,
} from "@/types";

interface PricedLine {
  unitPriceFils: number;
  quantity: number;
}

/**
 * The one place order money is calculated. The cart, the checkout summary, the
 * seed data and the admin's phone-order form all call this, so a total can
 * never disagree with itself.
 *
 * Pure arithmetic with no store access, which is why it sits in `lib/` rather
 * than `lib/store/` — client selection code can use it without reaching into
 * the data layer.
 */
export function computeTotals(
  lines: readonly PricedLine[],
  type: OrderType,
): OrderTotals {
  const subtotalFils = lines.reduce(
    (sum, line) => sum + line.unitPriceFils * line.quantity,
    0,
  );
  const deliveryFeeFils =
    type === "delivery" && subtotalFils > 0 ? DELIVERY_FEE_FILS : 0;
  const vatFils = Math.round((subtotalFils + deliveryFeeFils) * VAT_RATE);

  return {
    subtotalFils,
    vatFils,
    deliveryFeeFils,
    totalFils: subtotalFils + deliveryFeeFils + vatFils,
  };
}
