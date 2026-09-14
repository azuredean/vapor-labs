import { useEffect, useMemo, useRef, useState } from "react";
import TopBar from "./components/TopBar";
import Hero from "./components/Hero";
import ProductCard from "./components/ProductCard";
import BottomNav, { type Tab } from "./components/BottomNav";
import { MenuDrawer, SearchOverlay, Toast } from "./components/Overlays";
import AgeGate from "./components/AgeGate";
import Footer from "./components/Footer";
import ProductDetail from "./pages/ProductDetail";
import CartPage, { type CartRow } from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import AccountPage from "./pages/AccountPage";
import CheckoutPage from "./pages/CheckoutPage";
import SupportPage from "./pages/SupportPage";
import {
  CATEGORIES, GRID_PRODUCTS, getProduct,
  type Filter, type Order, type OrderItem, type Product,
} from "./data";

type Route =
  | { name: "home" }
  | { name: "product"; id: string }
  | { name: "cart" }
  | { name: "wishlist" }
  | { name: "account" }
  | { name: "checkout" }
  | { name: "support" };

interface CartItem {
  id: string;
  option: string;
  qty: number;
}

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}

export default function App() {
  const [ageOk, setAgeOk] = useState<boolean>(() => load("vapor-age", false));
  const [route, setRoute] = useState<Route>({ name: "home" });
  const [filter, setFilter] = useState<Filter>("All");
  const [cart, setCart] = useState<CartItem[]>(() => load("vapor-cart", []));
  const [wishlist, setWishlist] = useState<string[]>(() => load("vapor-wish", []));
  const [orders, setOrders] = useState<Order[]>(() => load("vapor-orders", []));
  const [user, setUser] = useState<{ email: string } | null>(() => load("vapor-user", null));
  const [notifications, setNotifications] = useState<boolean>(() => load("vapor-notif", true));
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  useEffect(() => save("vapor-cart", cart), [cart]);
  useEffect(() => save("vapor-wish", wishlist), [wishlist]);
  useEffect(() => save("vapor-orders", orders), [orders]);
  useEffect(() => save("vapor-user", user), [user]);
  useEffect(() => save("vapor-notif", notifications), [notifications]);
  useEffect(() => save("vapor-age", ageOk), [ageOk]);
  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  // lock scroll behind the age gate
  useEffect(() => {
    document.body.style.overflow = ageOk ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [ageOk]);

  const showToast = (message: string) => {
    window.clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), message });
    toastTimer.current = window.setTimeout(() => setToast(null), 2100);
  };

  const navigate = (r: Route) => {
    setRoute(r);
    window.scrollTo({ top: 0 });
  };

  /* ---------- cart ---------- */
  const cartRows: CartRow[] = useMemo(
    () =>
      cart
        .map((c) => ({ product: getProduct(c.id), option: c.option, qty: c.qty }))
        .filter((r): r is CartRow => Boolean(r.product)),
    [cart],
  );
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  const addToCart = (id: string, option: string, qty: number) => {
    const p = getProduct(id);
    if (!p) return;
    setCart((prev) => {
      const i = prev.findIndex((c) => c.id === id && c.option === option);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: Math.min(99, next[i].qty + qty) };
        return next;
      }
      return [...prev, { id, option, qty }];
    });
    showToast(`${p.name} added to cart`);
  };
  const addProduct = (p: Product) => addToCart(p.id, p.options[0], 1);

  const changeQty = (id: string, option: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => (c.id === id && c.option === option ? { ...c, qty: c.qty + delta } : c))
        .filter((c) => {
          if (c.qty < 1) {
            showToast(`${getProduct(c.id)?.name ?? "Item"} removed`);
            return false;
          }
          return true;
        }),
    );
  };

  const removeItem = (id: string, option: string) => {
    setCart((prev) => prev.filter((c) => !(c.id === id && c.option === option)));
    showToast(`${getProduct(id)?.name ?? "Item"} removed`);
  };

  /* ---------- wishlist ---------- */
  const toggleWish = (id: string) => {
    setWishlist((prev) => {
      const has = prev.includes(id);
      showToast(has ? "Removed from wishlist" : "Saved to wishlist");
      return has ? prev.filter((x) => x !== id) : [...prev, id];
    });
  };
  const wishProducts = wishlist
    .map((id) => getProduct(id))
    .filter((p): p is Product => Boolean(p));

  /* ---------- orders ---------- */
  const placeOrder = (items: OrderItem[], total: number): string => {
    const id = String(Math.floor(10000 + Math.random() * 90000));
    const order: Order = {
      id,
      date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      items,
      total,
      status: "Processing",
    };
    setOrders((prev) => [order, ...prev]);
    setCart([]);
    return id;
  };

  /* ---------- drawer routing ---------- */
  const handleDrawerLink = (link: string) => {
    setMenuOpen(false);
    switch (link) {
      case "Home":
        navigate({ name: "home" });
        break;
      case "Shop Devices":
        setFilter("Refillable");
        navigate({ name: "home" });
        break;
      case "E-Liquids & Flavors":
        setFilter("Disposable");
        navigate({ name: "home" });
        break;
      case "Pods & Coils":
        setFilter("Pods");
        navigate({ name: "home" });
        break;
      case "Limited Drops":
        navigate({ name: "home" });
        showToast("Limited edition: Vapor Pro X Neon Series");
        break;
      case "Safety & Support":
        navigate({ name: "support" });
        break;
    }
  };

  /* ---------- bottom nav ---------- */
  const activeTab: Tab =
    route.name === "cart" || route.name === "checkout"
      ? "cart"
      : route.name === "wishlist"
        ? "wishlist"
        : route.name === "account"
          ? "account"
          : "home";

  const handleTab = (t: Tab) => {
    navigate({ name: t });
  };

  const goHome = () => navigate({ name: "home" });
  const openProduct = (id: string) => {
    setSearchOpen(false);
    navigate({ name: "product", id });
  };

  const filtered = filter === "All" ? GRID_PRODUCTS : GRID_PRODUCTS.filter((p) => p.category === filter);

  return (
    <div className="min-h-screen font-body text-ink">
      {/* ambient page tint */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(900px_420px_at_72%_-12%,rgba(138,178,226,0.10),transparent_70%),radial-gradient(720px_380px_at_12%_-4%,rgba(231,154,107,0.09),transparent_70%)]"
      />

      {route.name === "home" && (
        <>
          <TopBar onMenu={() => setMenuOpen(true)} onSearch={() => setSearchOpen(true)} />
          <main className="mx-auto max-w-[1400px] px-4 pb-36 pt-5 md:px-8 md:pb-44 md:pt-9">
            <Hero onBuy={() => navigate({ name: "product", id: "neon-series" })} />

            <div className="no-scrollbar mt-7 flex gap-2.5 overflow-x-auto pb-1 md:mt-10 md:gap-3">
              {CATEGORIES.map((c) => {
                const active = filter === c;
                return (
                  <button
                    key={c}
                    onClick={() => setFilter(c)}
                    className={
                      "whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-200 active:scale-95 md:px-6 md:py-3 " +
                      (active
                        ? "bg-ink text-lemon shadow-[0_10px_22px_-12px_rgba(22,22,15,0.6)]"
                        : "border border-line bg-card text-ink hover:border-ink/35")
                    }
                  >
                    {c}
                  </button>
                );
              })}
            </div>

            <div key={filter} className="mt-5 grid grid-cols-2 gap-3.5 md:mt-8 md:grid-cols-4 md:gap-5">
              {filtered.map((p, i) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  index={i}
                  wishlisted={wishlist.includes(p.id)}
                  onAdd={addProduct}
                  onOpen={openProduct}
                  onToggleWish={toggleWish}
                />
              ))}
            </div>

            {filtered.length === 0 && (
              <p className="animate-fade py-20 text-center text-sm font-semibold text-mute">
                No products in this category yet.
              </p>
            )}

            <Footer />
          </main>
        </>
      )}

      {route.name === "product" && (
        <ProductDetail
          id={route.id}
          onBack={goHome}
          onAdd={addToCart}
          onOpen={openProduct}
          wishlisted={wishlist.includes(route.id)}
          onToggleWish={toggleWish}
        />
      )}

      {route.name === "cart" && (
        <CartPage
          rows={cartRows}
          onQty={changeQty}
          onRemove={removeItem}
          onClear={() => {
            setCart([]);
            showToast("Cart cleared");
          }}
          onCheckout={() => navigate({ name: "checkout" })}
          onBrowse={goHome}
          onBack={goHome}
        />
      )}

      {route.name === "checkout" && (
        <CheckoutPage
          rows={cartRows}
          onBack={() => navigate({ name: "cart" })}
          onPlaceOrder={placeOrder}
          onViewOrders={() => navigate({ name: "account" })}
          onBrowse={goHome}
        />
      )}

      {route.name === "wishlist" && (
        <WishlistPage
          products={wishProducts}
          onOpen={openProduct}
          onAdd={addProduct}
          onToggleWish={toggleWish}
          onBrowse={goHome}
          onBack={goHome}
        />
      )}

      {route.name === "account" && (
        <AccountPage
          user={user}
          orders={orders}
          wishlistCount={wishlist.length}
          cartCount={cartCount}
          notifications={notifications}
          onSignIn={(email) => {
            setUser({ email });
            showToast("Signed in — welcome back");
          }}
          onSignOut={() => {
            setUser(null);
            showToast("Signed out");
          }}
          onToggleNotifications={() => {
            setNotifications((n) => !n);
            showToast(notifications ? "Notifications off" : "Notifications on");
          }}
          onViewOrders={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
          onBack={goHome}
        />
      )}

      {route.name === "support" && <SupportPage onBack={goHome} />}

      <BottomNav active={activeTab} cartCount={cartCount} onChange={handleTab} />

      <MenuDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={handleDrawerLink}
        onPickCategory={(c) => {
          setFilter(c);
          setMenuOpen(false);
          navigate({ name: "home" });
        }}
      />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} onAdd={addProduct} onOpen={openProduct} />

      {toast && <Toast id={toast.id} message={toast.message} />}

      {!ageOk && <AgeGate onConfirm={() => setAgeOk(true)} />}
    </div>
  );
}
