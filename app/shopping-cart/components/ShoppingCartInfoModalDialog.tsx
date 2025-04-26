import React from 'react';
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
} from '@mui/material';


type Props = {
  data: {
    id: number;
    products: {
      productId: number;
      productName: string;
      quantity: number;
    }[];
  } | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function ShoppingCartInfoModalDialog(props: Props) {
  return (
    <>
      <Dialog
        open={props.isOpen}
        onClose={props.onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Shopping Cart ID: ${props.data?.id || 0}`}
        </DialogTitle>
        <DialogContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product ID</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>Quantity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.data && props.data.products.map(product => (
                <TableRow key={product.productId}>
                  <TableCell>{product.productId}</TableCell>
                  <TableCell>{product.productName}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={props.onClose}>Ok</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}