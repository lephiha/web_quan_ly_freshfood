import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: 'Tổng quan',
    section: 'dashboard',
    path: '/',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Người dùng',
    section: 'users',
    path: '/user',
    icon: icon('ic-user'),
  },
  {
    title: 'Sản phẩm',
    section: 'products',
    path: '/products',
    icon: icon('ic-cart'),
    // info: (
    //   <Label color="error" variant="inverted">
    //     +3
    //   </Label>
    // ),
  },
  {
    title: 'Đơn hàng',
    section: 'orders',
    path: '/order',
    icon: icon('ic-blog'),
  },
  {
    title: 'Thống kê',
    section: 'statistic',
    path: '/statistic',
    icon: icon('ic-analytics'),
  },
  // {
  //   title: 'Sign in',
  //   path: '/sign-in',
  //   icon: icon('ic-lock'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic-disabled'),
  // },
  // {
  //   title: 'Contact',
  //   path: '/contact',
  //   icon: icon('ic-disabled'),
  // },
  // {
  //   title: 'Product-infor',
  //   path: '/product-infor/:id',
  //   icon: icon('ic-disabled'),
  // },
];
