import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import HomePage from "@/pages/HomePage";
import CheckoutSuccess from "@/pages/CheckoutSuccess";
import CheckoutCancel from "@/pages/CheckoutCancel";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { CartProvider } from "@/cart/CartContext";

function App() {
  return (
    <div className="App dark" data-testid="app-root">
      <LanguageProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/checkout/success" element={<CheckoutSuccess />} />
              <Route path="/checkout/cancel" element={<CheckoutCancel />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: "#12121A",
              border: "1px solid rgba(0,229,255,0.2)",
              color: "#fff",
            },
          }}
        />
      </LanguageProvider>
    </div>
  );
}

export default App;
