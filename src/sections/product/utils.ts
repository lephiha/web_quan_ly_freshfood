import { useState } from 'react';
import { FiltersProps } from 'src/layouts/components/filters';
import type { ProductProps } from './product-table-row';

//------------------------------------------------------------------------------
// Configs
export const CATEGORY_OPTIONS = [
  { value: 'all', label: 'Tất cả sản phẩm' },
  { value: '1', label: 'Rau Củ' },
  { value: '2', label: 'Thịt, Cá, Trứng' },
  { value: '3', label: 'Trái cây' },
];

export const PRICE_OPTIONS = [
  { value: 'below', label: 'Dưới 100000' },
  { value: 'between', label: 'Từ 100000 - 300000' },
  { value: 'above', label: 'Trên 300000' },
];

export const defaultFilters = {
  price: '',
  category: CATEGORY_OPTIONS[0].value,
  orderStatus: '',
  month: '',
  year: '',
};

export const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
} as const;

// ----------------------------------------------------------------------

export function emptyRows(page: number, rowsPerPage: number, arrayLength: number) {
  return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

// ----------------------------------------------------------------------

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

// ----------------------------------------------------------------------

export function getComparator<Key extends keyof any>(
  order: 'asc' | 'desc',
  orderBy: Key
): (
  a: {
    [key in Key]: number | string;
  },
  b: {
    [key in Key]: number | string;
  }
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: ProductProps[];
  filterName: string;
  comparator: (a: any, b: any) => number;
  filters: FiltersProps;
};

export function applyFilter({ inputData, comparator, filterName, filters }: ApplyFilterProps) {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (order) => order.tensp.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  // Lọc theo filters
  if (filters) {
    // Lọc theo khoảng giá
    if (filters.price) {
      inputData = inputData.filter((order) => {
        switch (filters.price) {
          case 'below':
            return order.giasp < 100000;
          case 'between':
            return order.giasp >= 100000 && order.giasp <= 300000;
          case 'above':
            return order.giasp > 300000;
          default:
            return true;
        }
      });
    }

    if (filters.category !== 'all') {
      inputData = inputData.filter((order) => order.loai === filters.category);
    }
  }

  return inputData;
}

//------------------------------------------------------------------------------
export const getCategory = (category: string | undefined) => {
  switch (category) {
    case '1':
      return 'Rau Củ';
    case '2':
      return 'Thịt, Cá, Trứng';
    case '3':
      return 'Trái Cây';
    default:
      return '';
  }
};
