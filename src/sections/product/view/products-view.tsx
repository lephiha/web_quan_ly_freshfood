import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { RouterLink } from 'src/routes/components';
import { useRouter } from 'src/routes/hooks';
import * as productService from 'src/services/productService';
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { FiltersProps } from 'src/layouts/components/filters';

import { TableNoData } from 'src/sections/components/table-no-data';
import { TableEmptyRows } from '../table-empty-rows';
import { ProductTableRow } from '../product-table-row';
import { ProductTableHead } from '../product-table-head';
import { ProductTableToolbar } from '../product-table-toolbar';
import { emptyRows, applyFilter, getComparator, defaultFilters } from '../utils';
import type { ProductProps } from '../product-table-row';

// ----------------------------------------------------------------------
export function ProductsView() {
  const table = useTable();
  const router = useRouter();

  const [filterName, setFilterName] = useState('');
  const [filters, setFilters] = useState<FiltersProps>(defaultFilters);

  const [listProduct, setListProduct] = useState<ProductProps[]>([]);

  const fetchApi = async () => {
    const resultListProduct = await productService.getProduct();
    const resultListProductSale = await productService.getProductSale();
    setListProduct([
      ...(Array.isArray(resultListProductSale) ? resultListProductSale : []),
      ...(Array.isArray(resultListProduct) ? resultListProduct : []),
    ]);
  };

  useEffect(() => {
    fetchApi();
  }, []);

  const dataFiltered: ProductProps[] = applyFilter({
    inputData: listProduct,
    comparator: getComparator(table.product, table.productBy),
    filterName,
    filters,
  });

  const notFound = !dataFiltered.length && (filterName ? !!filterName : !!filters);

  const handleClickBtnAddProduct = () => {
    router.push('/products/add');
  };

  const handleClickRow = useCallback(
    (id: string) => {
      router.push(`/product-infor/${id}`);
    },
    [router]
  );

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Sản phẩm
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleClickBtnAddProduct}
          LinkComponent={RouterLink}
        >
          Thêm sản phẩm mới
        </Button>
      </Box>

      <Card>
        <ProductTableToolbar
          listProduct={listProduct}
          numSelected={table.selected}
          filterName={filterName}
          filters={filters}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
          onSetFilters={(updateState) =>
            setFilters((prevFilters) => ({ ...prevFilters, ...updateState }))
          }
          onSetSelected={table.onSetSelected}
          onReConnectApi={fetchApi}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <ProductTableHead
                order={table.product}
                orderBy={table.productBy}
                rowCount={dataFiltered.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    dataFiltered.map((product) => product.id)
                  )
                }
                headLabel={[
                  { id: 'tensp', label: 'Sản phẩm' },
                  { id: 'loai', label: 'Loại sản phẩm', align: 'center' },
                  { id: 'mota', label: 'Mô tả', align: 'center', width: '400px' },
                  { id: 'giasp', label: 'Đơn giá', align: 'center' },
                  { id: 'giamgia', label: 'Giảm giá', align: 'center' },
                  { id: 'kho', label: 'Số lượng', align: 'center' },
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
                    <ProductTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onClickRow={() => handleClickRow(row.id)}
                      onReConnectApi={fetchApi}
                    />
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
  const [productBy, setProductBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);

  const [product, setProduct] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = productBy === id && product === 'asc';
      setProduct(isAsc ? 'desc' : 'asc');
      setProductBy(id);
    },
    [product, productBy]
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
    product,
    onSort,
    productBy,
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
