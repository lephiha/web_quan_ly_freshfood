import { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { _timeline } from 'src/_mock';
import { useRouter } from 'src/routes/hooks';
import { DashboardContent } from 'src/layouts/dashboard';
import * as productService from 'src/services/productService';
import * as userService from 'src/services/userService';
import * as orderService from 'src/services/orderService';
import { ProductProps } from 'src/sections/product/product-table-row';
import { UserProps } from 'src/sections/user/user-table-row';
import { OrderProps } from 'src/sections/order/order-table-row';
import LangContext from 'src/store/langContext';

import { AnalyticsCategory } from '../analytics-category';
import { AnalyticsOrderTimeline } from '../analytics-order-timeline';
import { AnalyticsCategoryRevenue } from '../analytics-category-revenue';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import {
  calculateDataMetrics,
  calculateSaleMetrics,
  categorizeProduct,
  processOrderData,
  calculateCategoryConsumption,
} from '../utils';

// ----------------------------------------------------------------------
type UserAnalyticsProps = UserProps & {
  created_at: string;
};

export function OverviewAnalyticsView() {
  const router = useRouter();
  const { t } = useTranslation();

  const [listProduct, setListProduct] = useState<ProductProps[]>([]);
  const [listUser, setListUser] = useState<UserAnalyticsProps[]>([]);
  const [listOrder, setListOrder] = useState<OrderProps[]>([]);
  const [categoryData, setCategoryData] = useState<{ label: string; value: number }[]>([]);
  const [categoryData2, setCategoryData2] = useState<{ label: string; value: number }[]>([]);

  const [chartData, setChartData] = useState<{
    categories: string[];
    series: { name: string; data: number[] }[];
  }>({ categories: [], series: [] });
  const [filterYear, setFilterYear] = useState('2024');

  const fetchApi = async () => {
    const resultListProduct = await productService.getProduct();
    const resultListProductSale = await productService.getProductSale();
    setListProduct([
      ...(Array.isArray(resultListProductSale) ? resultListProductSale : []),
      ...(Array.isArray(resultListProduct) ? resultListProduct : []),
    ]);
  };

  const getUserApi = async () => {
    const resultListUser = await userService.getUser();
    setListUser(Array.isArray(resultListUser) ? resultListUser : []);
  };

  const getOrderApi = async () => {
    const resultListOrder = await orderService.getOrder(0);
    setListOrder(Array.isArray(resultListOrder) ? resultListOrder : []);
  };
  useEffect(() => {
    fetchApi();
    getUserApi();
    getOrderApi();
  }, []);

  const {
    total: totalProduct,
    percentChange: percentChangeProduct,
    chartData: chartDataProduct,
  } = calculateDataMetrics(listProduct, 'created_at');

  const {
    total: totalUser,
    percentChange: percentChangeUser,
    chartData: chartDataUser,
  } = calculateDataMetrics(listUser, 'created_at');

  const {
    total: totalOrder,
    percentChange: percentChangeOrder,
    chartData: chartDataOder,
  } = calculateDataMetrics(listOrder, 'ngaydat');

  const {
    total: totalProductSale,
    percentChange: percentChangeProductSale,
    chartData: chartDataProductSale,
  } = calculateSaleMetrics(listProduct, 'created_at', 'giamgia');

  useEffect(() => {
    const categorizedData = categorizeProduct(listProduct);
    setCategoryData(categorizedData);
  }, [listProduct]);

  useEffect(() => {
    const categorizedData2 = calculateCategoryConsumption(listOrder);
    setCategoryData2(categorizedData2);
  }, [listOrder]);

  useEffect(() => {
    const processedData = processOrderData(filterYear, listOrder);
    setChartData(processedData);
  }, [filterYear, listOrder]);

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        {t('welcome')} 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title={t('products')}
            percent={percentChangeProduct}
            total={totalProduct}
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-bag.svg" />}
            chart={chartDataProduct}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title={t('discountProducts')}
            percent={percentChangeProductSale}
            total={totalProductSale}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-sales.svg" />}
            chart={chartDataProductSale}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title={t('users')}
            percent={percentChangeUser}
            total={totalUser}
            color="secondary"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-users.svg" />}
            chart={chartDataUser}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title={t('purchaseAmount')}
            percent={percentChangeOrder}
            total={totalOrder}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-buy.svg" />}
            chart={chartDataOder}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsCategory
            title={t('categories')}
            chart={{
              series: categoryData,
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsCategoryRevenue
            title="Doanh thu"
            subheader="Tổng doanh thu từng loại sản phẩm theo tháng"
            chart={chartData}
            onFilterYear={(year) => setFilterYear(year)}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsCategory
            title="Thống kê lượng tiêu thụ từng loại mặt hàng"
            chart={{
              series: categoryData2,
            }}
          />
        </Grid>

        {/* <Grid xs={12} md={6} lg={4}>
          <AnalyticsOrderTimeline title="Order timeline" list={_timeline} />
        </Grid> */}
      </Grid>
    </DashboardContent>
  );
}
