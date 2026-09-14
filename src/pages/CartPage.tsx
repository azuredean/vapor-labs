import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, Truck } from "lucide-react";
import SubHeader from "../components/SubHeader";
import type { Product } from "../data";
import { yuan, FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from "../data";

export interface CartRow {
  product: Product;
  option: string;
  qty: number;
}

interface Props {
  rows: CartRow[];
  onQty: (id: string, option: string, delta: number) => void;
  onRemove: (id: string, option: string) => void;
  onClear: () => void;
  onCheckout: () => void;
  onBrowse: () => void;
  onBack: () => void;
}

export default function CartPage({ rows, onQty, onRemove, onClear, onCheckout, onBrowse, onBack }: Props) {
  const subtotal = rows.reduce((s, r) => s + r.product.price * r.qty, 0);
  const count = rows.reduce((s, r) => s + r.qty, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <>
      <SubHeader
        title={count ? `Cart · ${count}` : "Cart"}
        onBack={onBack}
        right={
          rows.length ? (
            <button
              onClick={onClear}
              className="text-[13px] font-bold text-mute transition hover:text-ink active:scale-95"
            >
              Clear
            </button>
          ) : undefined
        }
      />

      <main className="mx-auto max-w-[760px] px-4 pb-44 pt-5 md:pb-28 md:pt-8">
        {rows.length === 0 ? (
          <div className="animate-rise flex flex-col items-center rounded-[28px] bg-card px-6 py-16 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-paper text-mute">
              <ShoppingBag className="size-7" strokeWidth={2} />
            </span>
            <h2 className="mt-5 font-display text-2xl font-extrabold tracking-tight">Your cart is empty</h2>
            <p className="mt-2 max-w-xs text-sm font-medium text-mute">
              Devices, pods and flavors you add will show up here.
            </p>
            <button
              onClick={onBrowse}
              className="grad-cta mt-7 rounded-full px-7 py-3.5 text-sm font-bold text-white transition hover:brightness-105 active:scale-95"
            >
              Browse products
            </button>
          </div>
        ) : (
          <>
            {/* free shipping meter */}
            <div className="animate-rise rounded-2xl bg-card p-4">
              <p className="flex items-center gap-2 text-[13px] font-bold">
                <Truck className="size-4 text-ink" strokeWidth={2.2} />
                {remaining > 0 ? (
                  <span className="text-mute">
                    Add <span className="text-ink">{yuan(remaining)}</span> more for free EU shipping
                  </span>
                ) : (
                  <span>You unlocked free EU shipping</span>
                )}
              </p>
              <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-paper">
                <div
                  className="grad-cta h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* line items */}
            <div className="mt-4 flex flex-col gap-3">
              {rows.map((r, i) => (
                <div
                  key={`${r.product.id}-${r.option}`}
                  className="animate-rise flex items-center gap-4 rounded-[22px] bg-card p-4"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="grid h-20 w-16 shrink-0 place-items-center rounded-xl bg-paper">
                    <div className="capsule h-12 w-4 rounded-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-bold">{r.product.name}</p>
                    <p className="text-xs font-semibold text-mute">{r.option}</p>
                    <p className="mt-1 font-display text-base font-extrabold">
                      {yuan(r.product.price * r.qty)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2.5">
                    <button
                      onClick={() => onRemove(r.product.id, r.option)}
                      aria-label={`Remove ${r.product.name}`}
                      className="grid size-8 place-items-center rounded-full text-mute transition hover:bg-paper hover:text-ink active:scale-90"
                    >
                      <Trash2 className="size-4" strokeWidth={2.2} />
                    </button>
                    <div className="flex items-center rounded-full border border-line">
                      <button
                        onClick={() => onQty(r.product.id, r.option, -1)}
                        aria-label="Decrease quantity"
                        className="grid size-9 place-items-center rounded-full transition active:scale-90"
                      >
                        <Minus className="size-3.5" strokeWidth={2.6} />
                      </button>
                      <span className="w-7 text-center text-sm font-extrabold">{r.qty}</span>
                      <button
                        onClick={() => onQty(r.product.id, r.option, 1)}
                        aria-label="Increase quantity"
                        className="grid size-9 place-items-center rounded-full transition active:scale-90"
                      >
                        <Plus className="size-3.5" strokeWidth={2.6} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* summary */}
            <div className="mt-4 rounded-[22px] bg-card p-5">
              <div className="flex justify-between text-sm font-semibold text-mute">
                <span>Subtotal</span>
                <span className="text-ink">{yuan(subtotal)}</span>
              </div>
              <div className="mt-2 flex justify-between text-sm font-semibold text-mute">
                <span>Shipping</span>
                <span className="text-ink">{shipping === 0 ? "Free" : yuan(shipping)}</span>
              </div>
              <div className="mt-3 flex justify-between border-t border-line pt-3">
                <span className="font-display text-lg font-extrabold">Total</span>
                <span className="font-display text-lg font-extrabold">{yuan(subtotal + shipping)}</span>
              </div>
              <button
                onClick={onCheckout}
                className="grad-cta mt-5 flex w-full items-center justify-center gap-2 rounded-full px-7 py-4 text-[15px] font-bold text-white shadow-[0_16px_32px_-14px_rgba(138,178,226,0.8)] transition hover:brightness-105 active:scale-[0.98]"
              >
                Checkout <ArrowRight className="size-4" strokeWidth={2.6} />
              </button>
            </div>
          </>
        )}
      </main>
    </>
  );
}
