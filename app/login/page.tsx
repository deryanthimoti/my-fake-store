'use client'

import SnackbarContext from "../contexts/SnackbarContext";

import LoginPageContent from "./components/LoginPageContent";

export default function LoginPage() {
  return (
    <SnackbarContext>
      <LoginPageContent />
    </SnackbarContext>
  );
}
