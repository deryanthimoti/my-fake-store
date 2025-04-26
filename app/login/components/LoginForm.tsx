import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import axios from 'axios';
import { Box, TextField, Button, Card, Typography } from '@mui/material';

import { useSnackbarActionContext } from '@/app/contexts/SnackbarContext';
import { setAuthToken } from '@/app/utils/cookie';

import { API_LOGIN } from '@/app/constants';

type LoginFormState = {
  username: string;
  password: string;
};

export default function LoginForm() {
  const router = useRouter();
  const { control, handleSubmit, formState: { errors }} = useForm<LoginFormState>({
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const actions = useSnackbarActionContext();

  const onSubmit: SubmitHandler<LoginFormState> = async data => {
    try {
      const response = await axios({
        method: 'POST',
        baseURL: API_LOGIN,
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          ...data
        }
      });
      actions?.showSnackbar(`Successfully Logged in! Welcome ${data.username}!`);
      // On login success, set auth token
      setTimeout(() => {
        setAuthToken(response.data.token);
        router.push('/shopping-cart');
      }, 2500);
    } catch (error: any) {
      actions?.showSnackbar(`Login Failed: ${error}`, "ERROR");
      console.error('Login failed: ', error);
    }
  };

  return (
    <Card variant='outlined' style={{ padding: 16, display: 'flex', width: 400 }}>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', width: 400, gap: 2 }}>
        <Typography>Login</Typography>
        <Controller
          name="username"
          control={control}
          rules={{ minLength: 8 }}
          render={({ field }) => (
            <TextField 
              aria-invalid={errors.username ? "true" : "false"}
              id="outlined-basic" 
              label="Username" 
              variant="outlined" 
              {...field}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          rules={{ minLength: 8 }}
          render={({ field }) => (
            <TextField
              aria-invalid={errors.password ? "true" : "false"}
              id="filled-password-input"
              label="Password"
              type="password"
              autoComplete="current-password"
              variant="outlined"
              {...field}
            />
          )}
        />
        {errors.username?.type === 'minLength' && <p style={{ color: 'red' }}>Username should be 8 characters or more</p>}
        {errors.password?.type === 'minLength' && <p style={{ color: 'red' }}>Password should be 8 characters or more</p>}
        <Button style={{ marginTop: 16}} type='submit' variant="contained">Login</Button>
      </Box>
    </Card>
  );
}
