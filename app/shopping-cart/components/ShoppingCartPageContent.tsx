import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Snackbar } from '@mui/material';

import { useSnackbarStateContext, useSnackbarActionContext } from '@/app/contexts/SnackbarContext';
import { useShoppingCartStateContext, useShoppingCartActionContext } from '@/app/contexts/ShoppingCartContext';
import { deleteAuthToken } from '@/app/utils/cookie';

import ShoppingCartTable from './ShoppingCartTable';
import AddShoppingCartModalDialog from './AddShoppingCartModalDialog';
import LogoutConfirmationModalDialog from './LogoutConfirmationModalDialog';
import Loading from './Loading';

export default function ShoppingCartPageContent() {
  const state = useSnackbarStateContext();
  const actions = useSnackbarActionContext();
  const shoppingCartState = useShoppingCartStateContext();
  const shoppingCartAction = useShoppingCartActionContext();
  const [isShowLogoutConfirmationModalDialog, setIsShowLogoutConfirmationModalDialog] = useState(false);
  const [isAddShoppingCartModalDialogOpen, setIsAddShoppingCartModalDialogOpen] = useState(false);
  const router = useRouter();
  
  const handleLogout = () => {
    actions?.showSnackbar("Log out success!");
    setTimeout(() => {
      deleteAuthToken();
      router.push('/login');
    }, 1000);
    setIsShowLogoutConfirmationModalDialog(false);
  };

  const handleAddShoppingCart = (shoppingCart: any) => {
    setIsAddShoppingCartModalDialogOpen(false);
    shoppingCartAction?.addShoppingCart(shoppingCart.userId, shoppingCart.products);
  };

  return (
    <>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={() => setIsAddShoppingCartModalDialogOpen(true)} variant="contained">Add Cart</Button>
        <Button onClick={() => setIsShowLogoutConfirmationModalDialog(true)} variant="contained" color='error'>Logout</Button>
      </div>
      {shoppingCartState?.isLoading ? <Loading /> : <ShoppingCartTable />}
      <AddShoppingCartModalDialog 
        isOpen={isAddShoppingCartModalDialogOpen}
        onClose={() => setIsAddShoppingCartModalDialogOpen(false)}
        onAddShoppingCart={handleAddShoppingCart}
      />
      <LogoutConfirmationModalDialog
        isOpen={isShowLogoutConfirmationModalDialog}
        onClose={() => setIsShowLogoutConfirmationModalDialog(false)}
        onLogout={handleLogout}
      />
      <Snackbar 
        message={state?.message}
        open={state?.isVisible || false}
        autoHideDuration={2500}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
    </>
  );
};