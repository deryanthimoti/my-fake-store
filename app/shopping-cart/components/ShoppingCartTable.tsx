import React, { useEffect, useState, forwardRef } from 'react';
import { 
  TableContainer, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody,
  Pagination,
  Button,
  TextField,
  Box,
} from '@mui/material';
import type { TextFieldProps } from '@mui/material';
import DatePicker from 'react-datepicker';

import ShoppingCartInfoModalDialog from './ShoppingCartInfoModalDialog';

import { useShoppingCartStateContext } from '@/app/contexts/ShoppingCartContext';
import { formatDate } from '@/app/utils/date';

import type { ShoppingCart } from '@/app/types';

type ActiveShoppingCart = {
  id: number;
  products: {
    productId: number;
    productName: string;
    quantity: number;
  }[];
};

// @ts-ignore
interface CustomDateInputProps extends TextFieldProps {
  value?: string;
  onClick?: () => void;
};

export default function ShoppingCartTable() {
  const shoppingCartState = useShoppingCartStateContext();
  const [list, setList] = useState<ShoppingCart[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState(new Date('2020-01-01'));
  const [endDate, setEndDate] = useState(new Date());
  const [activeShoppingCart, setActiveShoppingCart] = useState<ActiveShoppingCart | null>(null);
  const [isShoppingCartProductsOpen, setIsShoppingCartProductsOpen] = useState(false);

  useEffect(() => {
    setList(shoppingCartState ? shoppingCartState.list : []);
  }, [shoppingCartState]);

  const onChange = (dates: any) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if (start !== null && end !== null) {
      setCurrentPage(1);
      // @ts-ignore
      const temp = [...shoppingCartState?.list].filter(item => {
        return (new Date(item.date) >= start) && (new Date(item.date) <= end)
      });
      setList(temp);
    }
  };

  const handleOpenProductsModalDialog = (shoppingCart: ShoppingCart) => {
    setActiveShoppingCart({
      id: shoppingCart.id,
      // @ts-ignore
      products: shoppingCart.products.map(item => {
        return {
          productId: item.productId,
          quantity: item.quantity,
          productName: shoppingCartState?.products.filter(product => product.id === item.productId)[0].title,
        }
      })
    })
    setIsShoppingCartProductsOpen(true);
  };

  const handleShoppingCartInfoModalDialogClose = () => {
    setIsShoppingCartProductsOpen(false);
    setActiveShoppingCart(null);
  };

  const handleResetDatePicker = () => {
    setStartDate(new Date('2020-01-01'));
    setEndDate(new Date());
    setList(shoppingCartState ? shoppingCartState.list : []);
  };

  const getUsername = (userId: number) => {
    return shoppingCartState && shoppingCartState.users.filter(user => user.id === userId).length > 0 ? shoppingCartState.users.filter(user => user.id === userId)[0].username : '';
  };

  const CustomDateInput = forwardRef<HTMLInputElement, CustomDateInputProps>(
    ({ value, onClick, ...props }, ref) => {
      return (
        <TextField
          fullWidth
          inputRef={ref}
          value={value}
          onClick={onClick}
          {...props}
        />
      );
    }
  );

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 4}}>
        <DatePicker
          selected={startDate}
          onChange={onChange}
          startDate={startDate}
          endDate={endDate}
          maxDate={new Date()}
          selectsRange
          customInput={<CustomDateInput />}
        />
        <Button onClick={handleResetDatePicker} variant='contained' color='error'>
          Reset
        </Button>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>User ID</strong></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Created Date</strong></TableCell>
              <TableCell><strong>Products</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...list].slice((currentPage - 1) * 5, currentPage * 5).map(shoppingCart => (
              <TableRow key={shoppingCart.id}>
                <TableCell>{shoppingCart.id}</TableCell>
                <TableCell>{shoppingCart.userId}</TableCell>
                <TableCell>{getUsername(shoppingCart.userId)}</TableCell>
                <TableCell>{formatDate(shoppingCart.date)}</TableCell>
                <TableCell><Button onClick={() => handleOpenProductsModalDialog(shoppingCart)} variant="contained">Check Product</Button></TableCell>
              </TableRow>
            ))}
            </TableBody>
        </Table>
      </TableContainer>
      <div style={{ marginTop: 24}}>
        <Pagination 
          page={currentPage} 
          onChange={(_e, page) => setCurrentPage(page)}
          // @ts-ignore
          count={Math.ceil(list.length / 5)} 
        />
      </div>
      <ShoppingCartInfoModalDialog 
        isOpen={isShoppingCartProductsOpen}
        data={activeShoppingCart}
        onClose={handleShoppingCartInfoModalDialogClose}
      />
    </>
    
  )
};