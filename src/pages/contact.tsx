import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ContactView } from 'src/sections/contact';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Trợ giúp - ${CONFIG.appName}`}</title>
      </Helmet>

      <ContactView />
    </>
  );
}
