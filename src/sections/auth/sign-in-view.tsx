import React, { useState, useCallback, useContext, useRef, FormEvent, useEffect } from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';
import LoginContext from 'src/store/loginContext';
import { loginUser } from 'src/services/authService';

// ----------------------------------------------------------------------

export function SignInView() {
  const router = useRouter();
  const loginCtx = useContext(LoginContext);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [statusLogin, setStatusLogin] = useState<boolean | null>(null);
  const [error, setError] = useState('');

  // Validate form data
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (statusLogin === true) {
      router.push('/');
    }
  }, [router, statusLogin]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignIn = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      let isValid = false;
      if (!formData.email || !formData.email.length) {
        setEmailError('Vui lòng nhập email!');
        isValid = false;
      } else {
        isValid = true;
        setEmailError('');
      }

      if (!formData.password || !formData.password.length) {
        setPasswordError('Vui lòng nhập password!');
        isValid = false;
      } else {
        isValid = true;
        setPasswordError('');
      }

      if (isValid) {
        const fetchApi = async () => {
          const resultLogin = await loginUser(formData);

          if (resultLogin instanceof Error) {
            setError('Lỗi kết nối server...');
          } else {
            resultLogin.forEach((item: { status: string; pass: any }) => {
              console.log('status:', item.status, typeof item.status);
              console.log('role:', import.meta.env.VITE_ADMIN_ROLE, typeof import.meta.env.VITE_ADMIN_ROLE);
              if (
                Number(item.status) === Number(import.meta.env.VITE_ADMIN_ROLE) &&
                item.pass === formData.password
              ) {
                loginCtx.toggleLogin();
                localStorage.setItem('user', JSON.stringify(item));
                setStatusLogin(true);
              } else {
                setError('Tài khoản hoặc mật khẩu không chính xác!');
              }
            });
          }
        };
        fetchApi();
      }
    },
    [formData, loginCtx]
  );

  const renderForm = (
    <form onSubmit={handleSignIn}>
      <Box display="flex" flexDirection="column" alignItems="flex-end">
        <TextField
          fullWidth
          name="email"
          label="Địa chỉ email"
          error={!!(emailError && emailError.length)}
          helperText={emailError}
          autoFocus
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 3 }}
          onChange={handleFormChange}
        />

        <TextField
          fullWidth
          name="password"
          label="Mật khẩu"
          InputLabelProps={{ shrink: true }}
          error={!!(passwordError && passwordError.length)}
          helperText={passwordError}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
          onChange={handleFormChange}
        />
        <Box
          width="100%"
          display={error ? 'block' : 'none'}
          sx={{
            marginTop: '-18px',
            marginBottom: '6px',

            height: '1rem',
          }}
        >
          <Typography
            color="error"
            sx={{
              fontSize: '0.85rem',
            }}
          >
            {error}
          </Typography>
        </Box>

        {/* <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
          Quên mật khẩu
        </Link> */}

        <LoadingButton fullWidth size="large" type="submit" color="inherit" variant="contained">
          Đăng nhập
        </LoadingButton>
      </Box>
    </form>
  );

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Đăng nhập</Typography>
        {/* <Typography variant="body2" color="text.secondary">
          Bạn chưa có tài khoản?
          <Link variant="subtitle2" sx={{ ml: 0.5 }}>
            Tạo tài khoản
          </Link>
        </Typography> */}
      </Box>

      {renderForm}

      {/* <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
        <Typography
          variant="overline"
          sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}
        >
          Hoặc đăng nhập với
        </Typography>
      </Divider>

      <Box gap={1} display="flex" justifyContent="center">
        <IconButton color="inherit">
          <Iconify icon="logos:google-icon" />
        </IconButton>
        <IconButton color="inherit">
          <Iconify icon="eva:github-fill" />
        </IconButton>
        <IconButton color="inherit">
          <Iconify icon="ri:twitter-x-fill" />
        </IconButton>
      </Box> */}
    </>
  );
}
