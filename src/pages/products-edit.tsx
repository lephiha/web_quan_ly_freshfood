import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ProductsEdit } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Sửa sản phẩm - ${CONFIG.appName}`}</title>
      </Helmet>

      <ProductsEdit />
    </>
  );
}
