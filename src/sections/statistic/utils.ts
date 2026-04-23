import { FiltersProps } from 'src/layouts/components/filters';
import type { StatisticProps } from './statistic-table-row';

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
  inputData: StatisticProps[];
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
      (order) => order.tensp.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  // Lọc theo filters
  if (filters) {
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

