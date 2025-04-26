import React, { useMemo, useState } from 'react';
import { 
  TableContainer, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody,
  Pagination,
  Button,
} from '@mui/material';
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

export default function ShoppingCartTable() {
  const shoppingCartState = useShoppingCartStateContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [activeShoppingCart, setActiveShoppingCart] = useState<ActiveShoppingCart | null>(null);
  const [isShoppingCartProductsOpen, setIsShoppingCartProductsOpen] = useState(false);

  const shoppingCartList = useMemo(() => {
    const tempList = shoppingCartState ? [...shoppingCartState.list] : [];
    return tempList.slice((currentPage - 1) * 5, currentPage * 5);
  }, [currentPage]);

  const onChange = (dates: any) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const handleOpenProductsModalDialog = (shoppingCart: ShoppingCart) => {
    console.log(shoppingCart);
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

  const getUsername = (userId: number) => {
    
    return shoppingCartState && shoppingCartState.users.filter(user => user.id === userId).length > 0 ? shoppingCartState.users.filter(user => user.id === userId)[0].username : '';
  };

  return (
    <>
      <DatePicker
        selected={startDate}
        onChange={onChange}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        inline
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>User ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell>Products</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shoppingCartList.map(shoppingCart => (
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
          count={Math.ceil(shoppingCartState?.list.length / 5)} 
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