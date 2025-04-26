'use client'

import SnackbarContext from "../contexts/SnackbarContext";
import ShoppingCartContext from "../contexts/ShoppingCartContext";

import ShoppingCartPageContent from "./components/ShoppingCartPageContent";

export default function LoginPage() {
  return (
    <SnackbarContext>
      <ShoppingCartContext>
        <ShoppingCartPageContent />
      </ShoppingCartContext>
    </SnackbarContext>
  );
}
