import type { TableRowProps } from '@mui/material/TableRow';

import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import { CATEGORY_OPTIONS, PRICE_OPTIONS } from '../product/utils';
import { ORDER_STATUS_OPTIONS } from '../order/utils';

// ----------------------------------------------------------------------

type TableNoDataProps = TableRowProps & {
  searchQuery: string;
  filterType: string;
};

export function TableNoData({ searchQuery, filterType, ...other }: TableNoDataProps) {
  const QUERY_SELECTOR = [
    ...(filterType === 'product' ? CATEGORY_OPTIONS : []),
    ...(filterType === 'product' ? PRICE_OPTIONS : []),
    ...(filterType === 'order' ? ORDER_STATUS_OPTIONS : []),
  ];
  const resultQuery = QUERY_SELECTOR.find((query) => query.value.toString() === searchQuery);
  if (resultQuery) {
    searchQuery = resultQuery.label;
  }

  return (
    <TableRow {...other}>
      <TableCell align="center" colSpan={7}>
        <Box sx={{ py: 15, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Không tìm thấy
          </Typography>

          <Typography variant="body2">
            Không tìm thấy kết quả nào cho &nbsp;
            <strong>&quot;{searchQuery}&quot;</strong>.
            <br />
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  );
}
