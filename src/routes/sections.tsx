import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { varAlpha } from 'src/theme/styles';
import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export const HomePage = lazy(() => import('src/pages/home'));
export const UserPage = lazy(() => import('src/pages/users'));
export const ProfilePage = lazy(() => import('src/pages/profile'));
export const OrderPage = lazy(() => import('src/pages/orders'));
export const OrderInforPage = lazy(() => import('src/pages/order-infor'));
export const StatisticPage = lazy(() => import('src/pages/statistic'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const ProductsAddPage = lazy(() => import('src/pages/products-add'));
export const ProductsEditPage = lazy(() => import('src/pages/products-edit'));
export const ContactPage = lazy(() => import('src/pages/contact'));
export const ProductInforPage = lazy(() => import('src/pages/product-infor'));

export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export function Router() {
  return useRoutes([
    {
      path: '/',
      element: (
        <DashboardLayout>
          <Suspense fallback={renderFallback}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <HomePage />, index: true },
        { path: 'user', element: <UserPage /> },
        { path: 'profile/:id', element: <ProfilePage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'products/add', element: <ProductsAddPage /> },
        { path: `products/edit/:id`, element: <ProductsEditPage /> },
        { path: 'order', element: <OrderPage /> },
        { path: 'order/:id', element: <OrderInforPage /> },
        { path: 'statistic', element: <StatisticPage /> },
        { path: 'product-infor/:id', element: <ProductInforPage /> },
      ],
    },
    {
      path: 'sign-in',
      element: (
        <AuthLayout>
          <SignInPage />
        </AuthLayout>
      ),
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: 'contact',
      element: <ContactPage />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
