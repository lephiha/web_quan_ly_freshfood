import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { NotFoundView } from 'src/sections/error';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Không tìm thấy trang 404! | Lỗi - ${CONFIG.appName}`}</title>
      </Helmet>

      <NotFoundView />
    </>
  );
}
