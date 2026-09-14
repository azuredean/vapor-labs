import { useState } from "react";
import { ChevronDown, LifeBuoy, Mail } from "lucide-react";
import SubHeader from "../components/SubHeader";

const FAQS = [
  {
    q: "Who is allowed to order?",
    a: "Only adults aged 18 or older (21 in some regions). Age is verified at checkout, and we refuse orders we cannot verify. Nicotine products are never sold to minors.",
  },
  {
    q: "Which countries do you ship to?",
    a: "We ship across the EU and EEA wherever distance sales are permitted. Belgium, Denmark and Finland currently restrict cross-border e-cigarette sales, so orders from those countries may be cancelled with a full refund.",
  },
  {
    q: "What nicotine strengths do you sell?",
    a: "In line with the EU Tobacco Products Directive, all e-liquids and pods are capped at 20 mg/ml, tanks hold a maximum of 2 ml and refill bottles a maximum of 10 ml.",
  },
  {
    q: "Can I return a product?",
    a: "Devices and accessories can be returned within 14 days under the EU consumer right of withdrawal. For hygiene reasons, opened pods and e-liquids cannot be returned once unsealed.",
  },
  {
    q: "Is my device covered by warranty?",
    a: "Yes — every device carries a 12-month manufacturer warranty covering battery and chipset defects. Contact support with your order number and we will arrange a replacement.",
  },
];

interface Props {
  onBack: () => void;
}

export default function SupportPage({ onBack }: Props) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      <SubHeader title="Safety & Support" onBack={onBack} />

      <main className="mx-auto max-w-[760px] px-4 pb-44 pt-5 md:pb-28 md:pt-8">
        <div className="animate-rise flex items-center gap-3 rounded-[28px] bg-ink p-6 text-white md:p-7">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-lemon text-ink">
            <LifeBuoy className="size-5" strokeWidth={2.3} />
          </span>
          <div>
            <h2 className="font-display text-xl font-extrabold tracking-tight">We're here to help</h2>
            <p className="mt-0.5 text-[13px] font-medium text-white/60">
              Answers on age policy, shipping, nicotine and returns.
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2.5">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={f.q}
                className="animate-rise overflow-hidden rounded-[20px] bg-card"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-[15px] font-bold">{f.q}</span>
                  <ChevronDown
                    className={
                      "size-5 shrink-0 text-mute transition-transform duration-300 " + (isOpen && "rotate-180")
                    }
                    strokeWidth={2.4}
                  />
                </button>
                <div
                  className={
                    "grid transition-all duration-300 ease-out " +
                    (isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")
                  }
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm font-medium leading-relaxed text-mute">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="animate-rise mt-4 flex flex-col items-center gap-2 rounded-[22px] bg-card p-6 text-center" style={{ animationDelay: "120ms" }}>
          <Mail className="size-6 text-mute" strokeWidth={2} />
          <p className="text-sm font-bold">Still need help?</p>
          <a
            href="mailto:support@vaporlabs.eu"
            className="text-[15px] font-extrabold underline decoration-lemon decoration-2 underline-offset-4 transition hover:decoration-ink"
          >
            support@vaporlabs.eu
          </a>
          <p className="text-[11px] font-semibold text-mute">Replies within 24 h · Mon–Fri</p>
        </div>
      </main>
    </>
  );
}
