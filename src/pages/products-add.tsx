import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ProductsAdd } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Thêm sản phẩm - ${CONFIG.appName}`}</title>
      </Helmet>

      <ProductsAdd />
    </>
  );
}
