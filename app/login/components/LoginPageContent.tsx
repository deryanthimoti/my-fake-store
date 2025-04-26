import Snackbar from '@mui/material/Snackbar';
import LoginForm from "./LoginForm";

import { useSnackbarStateContext } from '@/app/contexts/SnackbarContext';

export default function LoginPageContent() {
  const state = useSnackbarStateContext();
  return (
    <div style={{ width: '100vw', height: '98vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <LoginForm />
      <Snackbar 
        message={state?.message}
        open={state?.isVisible || false}
        autoHideDuration={2500}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
    </div>
  );
};
