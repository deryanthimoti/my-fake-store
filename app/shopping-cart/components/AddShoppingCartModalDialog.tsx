import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody,
  Button,
  Select,
  MenuItem,
  TextField,
  Typography
} from '@mui/material';

import { useShoppingCartStateContext } from '@/app/contexts/ShoppingCartContext';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onAddShoppingCart: (formState: FormState) => void;
};

type FormState = {
  userId: number;
  products: {
    id: number;
    quantity: number;
  }[];
};

export default function AddShoppingCartModalDialog(props: Props) {
  const state = useShoppingCartStateContext();
  const [formState, setFormState] = useState<FormState>({ userId: 1, products: [{ id: 1, quantity: 1 }]});
  const [error, setError] = useState(false);

  useEffect(() => {
    if (props.isOpen) {
      setError(false);
      setFormState({ userId: 1, products: [{ id: 1, quantity: 1 }]});
    }
  }, [props.isOpen]);

  const handleUserChange = (userId: string) => {
    const tempFormState = {...formState};
    tempFormState.userId = Number(userId);
    setFormState(tempFormState);
  };

  const handleAddProductButtonPress = () => {
    const tempFormState = {...formState};
    tempFormState.products.push({ id: 1, quantity: 1 });
    setFormState(tempFormState);
  };

  const handleProductChange = (value: string, index: number) => {
    const tempFormState = {...formState};
    tempFormState.products[index].id = Number(value);
    setFormState(tempFormState);
  };

  const handleQuantityChange = (value: string, index: number) => {
    const tempFormState = {...formState};
    if (Number(value) > 0) {
      tempFormState.products[index].quantity = Number(value);
      setFormState(tempFormState);
    }
  };

  const handleRemoveProductButtonPress = (index: number) => {
    const tempFormState = {...formState};
    tempFormState.products.splice(index, 1);
    setFormState(tempFormState);
  };

  const handleAddShoppingCart = () => {
    const seen = {};
    const hasDuplicates = formState.products.some(function (product) {
      // @ts-ignore
      return seen.hasOwnProperty(product.id) || (seen[product.id] = false);
    });
    console.log(formState.products);
    if (hasDuplicates) {
      setError(true);
    } else {
      setError(false);
      props.onAddShoppingCart(formState);
    }
  };

  return (
    <>
      <Dialog
        open={props.isOpen}
        onClose={props.onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth='md'
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">
          {`Add Shopping Cart`}
        </DialogTitle>
        <DialogContent>
          <Select label='User' onChange={(e: any) => handleUserChange(e.target.value)} value={formState.userId}>
            {state && state.users.map(user => (
              <MenuItem value={user.id}>{user.username}</MenuItem>
            ))}
          </Select>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {formState.products.map((product, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Select label='Product Name' value={product.id} onChange={(e: any) => handleProductChange(e.target.value, index)}>
                      {state && state.products.map(product => (
                        <MenuItem value={product.id}>{product.title}</MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <TextField 
                      label="Quantity" 
                      variant="outlined" 
                      type='number'
                      value={product.quantity} 
                      onChange={(e) => handleQuantityChange(e.target.value, index)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button 
                      onClick={() => handleRemoveProductButtonPress(index)} 
                      disabled={formState.products.length === 1} 
                      variant='contained' 
                      color='error'
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button onClick={handleAddProductButtonPress} style={{ marginTop: 24 }} variant="contained">Add Product</Button>
        </DialogContent>
        <DialogActions>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {error && <Typography textAlign={'right'} color='error'>Ensure that there is no duplicate</Typography>}
            <div style={{ display: 'flex', gap: 16 }}>
              <Button variant="contained" color='error' onClick={props.onClose}>Cancel</Button>
              <Button variant="contained" onClick={handleAddShoppingCart}>Add Shopping Cart</Button>
            </div>
          </div>
        </DialogActions>
      </Dialog>
    </>
  );
}