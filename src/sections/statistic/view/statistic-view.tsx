import { useState, useCallback, useEffect, useMemo } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { _statistic } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import * as productService from 'src/services/productService';
import { ProductProps } from 'src/sections/product/product-table-row';
import * as orderService from 'src/services/orderService';
import { OrderProps } from 'src/sections/order/order-table-row';
import { FiltersProps } from 'src/layouts/components/filters';
import { defaultFilters } from 'src/sections/product/utils';
import { fCurrency, fNumber } from 'src/utils/format-number';

import { TableNoData } from '../../components/table-no-data';
import { StatisticTableRow } from '../statistic-table-row';
import { StatisticTableHead } from '../statistic-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { StatisticTableToolbar } from '../statistic-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

import type { StatisticProps } from '../statistic-table-row';

// ----------------------------------------------------------------------

export function StatisticView() {
  const table = useTable();
  const [filterName, setFilterName] = useState('');
  const [filters, setFilters] = useState<FiltersProps>(defaultFilters);
  const [listProduct, setListProduct] = useState<StatisticProps[]>([]);
  const [listOrder, setListOrder] = useState<OrderProps[]>([]);
  const [orderProducts, setOrderProducts] = useState<StatisticProps[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const fetchData = async () => {
    const [products, saleProducts, orders] = await Promise.all([
      productService.getProduct(),
      productService.getProductSale(),
      orderService.getOrder(0),
    ]);
    setListProduct([
      ...(Array.isArray(saleProducts) ? saleProducts : []),
      ...(Array.isArray(products) ? products : []),
    ]);
    setListOrder(Array.isArray(orders) ? orders : []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (listOrder.length && listProduct.length) {
      const filteredOrders = listOrder.filter((order) => {
        const orderDate = new Date(order.ngaydat);
        if (Number.isNaN(orderDate)) return false;

        const monthMatch = filters.month
          ? orderDate.getMonth() + 1 === Number(filters.month)
          : true;
        const yearMatch = filters.year ? orderDate.getFullYear() === Number(filters.year) : true;

        return monthMatch && yearMatch;
      });

      const soldQuantityMap = filteredOrders.reduce<Record<string, number>>((acc, order) => {
        order.item.forEach((item) => {
          acc[item.id] = (acc[item.id] || 0) + parseInt(item.soluong.toString(), 10);
        });
        return acc;
      }, {});

      const combinedData = listProduct
        .map((product) => ({
          ...product,
          soLuongBan: soldQuantityMap[product.id] || 0,
        }))
        .filter((product) => product.soLuongBan > 0);

      setOrderProducts(combinedData);
    }
  }, [listOrder, listProduct, filters]);

  const dataFiltered: StatisticProps[] = useMemo(
    () =>
      applyFilter({
        inputData: orderProducts,
        comparator: getComparator(table.order, table.orderBy),
        filterName,
        filters,
      }),
    [orderProducts, table.order, table.orderBy, filterName, filters]
  );

  useEffect(() => {
    // Tính tổng tiền hàng mỗi khi orderProducts thay đổi
    const total = dataFiltered.reduce((sum, product) => {
      const productRevenue = product.soLuongBan * product.giasp;
      return sum + productRevenue;
    }, 0);
    setTotalRevenue(total);
  }, [dataFiltered]);


  const notFound = !dataFiltered.length && (filterName || filters);

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Sản phẩm đã bán
        </Typography>
      </Box>

      <Card>
        <StatisticTableToolbar
          filterName={filterName}
          filters={filters}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
          onSetFilters={(updateState) =>
            setFilters((prevFilters) => ({ ...prevFilters, ...updateState }))
          }
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <StatisticTableHead
                order={table.order}
                orderBy={table.orderBy}
                onSort={table.onSort}
                headLabel={[
                  { id: 'tensp', label: 'Sản phẩm' },
                  { id: 'loai', label: 'Loại sản phẩm' },
                  { id: 'soluongban', label: 'Số lượng đã bán', align: 'center' },
                  { id: 'giasp', label: 'Đơn giá', align: 'center' },
                  { id: 'giamgia', label: 'Giảm giá', align: 'center' },
                  { id: 'tonggia', label: 'Tổng tiền hàng', align: 'center' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <StatisticTableRow key={row.id} row={row} />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                />

                {notFound && (
                  <TableNoData
                    searchQuery={filterName || filters.price || filters.category}
                    filterType="product"
                  />
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            p: 3,
          }}
        >
          <Typography variant="h5">Tổng tiền hàng: </Typography>
          <Typography ml={1} variant="body1">
            {fCurrency(totalRevenue)}
          </Typography>
        </Box>

        <TablePagination
          component="div"
          page={table.page}
          count={dataFiltered.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setStatisticBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setStatistic] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setStatistic(isAsc ? 'desc' : 'asc');
      setStatisticBy(id);
    },
    [order, orderBy]
  );
  const onSetSelected = useCallback((data: string[]) => {
    setSelected(data);
  }, []);
  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    onSetSelected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
