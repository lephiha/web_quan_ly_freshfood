import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { StatisticView } from 'src/sections/statistic/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Thống kê - ${CONFIG.appName}`}</title>
      </Helmet>

      <StatisticView />
    </>
  );
}
