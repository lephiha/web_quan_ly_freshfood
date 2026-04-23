import { FiltersProps } from 'src/layouts/components/filters';
import type { OrderProps } from './order-table-row';

// ----------------------------------------------------------------------

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

export const ORDER_STATUS_OPTIONS = [
  { value: 0, label: 'Đơn hàng đang được xử lí' },
  { value: 1, label: 'Đơn hàng đã chấp nhận' },
  { value: 2, label: 'Đã giao cho đơn vị vận chuyển' },
  { value: 3, label: 'Thành Công' },
  { value: 4, label: 'Đơn hàng đã hủy' },
];

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
  inputData: OrderProps[];
  filterName: string;
  filters: FiltersProps;
  comparator: (a: any, b: any) => number;
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
      (order) =>
        order.id.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        order.username.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filters) {
    if (filters.orderStatus !== '') {
      inputData = inputData.filter((order) => order.trangthai === filters.orderStatus);
    }
  }

  return inputData;
}

export function getStatusMessage(status: number): string {
  const found = ORDER_STATUS_OPTIONS.find((item) => item.value === status);
  return found ? found.label : '';
}
