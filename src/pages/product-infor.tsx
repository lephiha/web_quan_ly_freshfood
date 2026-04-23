import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ProductInfor } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Thông tin sản phẩm - ${CONFIG.appName}`}</title>
      </Helmet>

      <ProductInfor />
    </>
  );
}
