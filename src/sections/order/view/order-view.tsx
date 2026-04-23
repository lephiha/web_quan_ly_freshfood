import { useState, useCallback, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { DashboardContent } from 'src/layouts/dashboard';

import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import * as orderService from 'src/services/orderService';
import { FiltersProps } from 'src/layouts/components/filters';
import { defaultFilters } from 'src/sections/product/utils';

import { TableNoData } from 'src/sections/components/table-no-data';
import { OrderTableRow } from '../order-table-row';
import { OrderTableHead } from '../order-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { OrderTableToolbar } from '../order-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

import type { OrderProps } from '../order-table-row';

// ----------------------------------------------------------------------
export function OrderView() {
  const table = useTable();
  const router = useRouter();

  const [listOrder, setListOrder] = useState<OrderProps[]>([]);
  const [filters, setFilters] = useState<FiltersProps>(defaultFilters);

  const fetchApi = async () => {
    const resultListOrder = await orderService.getOrder(0);
    setListOrder(Array.isArray(resultListOrder) ? resultListOrder : []);
  };
  useEffect(() => {
    fetchApi();
  }, []);

  const [filterName, setFilterName] = useState('');

  const dataFiltered: OrderProps[] = applyFilter({
    inputData: listOrder,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
    filters,
  });

  const notFound = !dataFiltered.length && (filterName || filters);

  const handleUpdateOrderStatus = useCallback(async (id: string, status: number) => {
    await orderService.updateOrderStatus(id, status);
    fetchApi();
  }, []);

  const handleClickRow = useCallback(
    (id: string) => {
      router.push(`/order/${id}`);
    },
    [router]
  );

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Đơn hàng
        </Typography>
      </Box>

      <Card>
        <OrderTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          filters={filters}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
          onSetFilters={(updateState) =>
            setFilters((prevFilters) => ({ ...prevFilters, ...updateState }))
          }
          onReConnectApi={fetchApi}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <OrderTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={dataFiltered.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    dataFiltered.map((order) => order.id)
                  )
                }
                headLabel={[
                  { id: 'id', label: 'ID đơn hàng' },
                  { id: 'username', label: 'Tên khách hàng' },
                  { id: 'ngaydat', label: 'Thời gian đặt hàng', align: 'center' },
                  { id: 'diachi', label: 'Địa chỉ giao hàng' },
                  { id: 'tongtien', label: 'Tổng tiền', align: 'center' },
                  { id: 'phuongthucthanhtoan', label: 'Phương thức thanh toán', align: 'center' },

                  {
                    id: 'trangthai',
                    label: 'Trạng thái đơn hàng',
                    align: 'center',
                    width: '300px',
                  },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <OrderTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onClickRow={() => handleClickRow(row.id)}
                      onUpdateOrderStatusApi={(status) => handleUpdateOrderStatus(row.id, status)}
                      onReConnectApi={fetchApi}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                />

                {notFound && (
                  <TableNoData searchQuery={filterName || filters.orderStatus} filterType="order" />
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

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
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

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
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
