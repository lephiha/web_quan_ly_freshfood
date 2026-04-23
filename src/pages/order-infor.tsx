import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { OrderInfor } from 'src/sections/order/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Thông tin đơn hàng - ${CONFIG.appName}`}</title>
      </Helmet>

      <OrderInfor />
    </>
  );
}
