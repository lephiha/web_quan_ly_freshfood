import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { getImageURL } from 'src/utils/format-image';
import { fCurrency, fNumber } from 'src/utils/format-number';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ProductProps } from '../product/product-table-row';
import { getCategory } from '../product/utils';

// ----------------------------------------------------------------------

export type StatisticProps = ProductProps & {
  soLuongBan: number;
  ngaydat: string;
};

type StatisticTableRowProps = {
  row: StatisticProps;
};

export function StatisticTableRow({ row }: StatisticTableRowProps) {
  return (
    <TableRow hover tabIndex={-1} role="checkbox">
      <TableCell component="th" scope="row">
        <Box gap={2} display="flex" alignItems="center">
          <Avatar alt={row.tensp} src={getImageURL(row.images[0].image)} />
          {row.tensp} <br /> Số lượng: {row.kho}
          {row.giamgia > 0 && (
            <Label
              variant="inverted"
              color={(row.giamgia > 0 && 'error') || 'info'}
              sx={{
                zIndex: 9,
                top: 16,
                right: 16,

                textTransform: 'uppercase',
              }}
            >
              Sale
            </Label>
          )}
        </Box>
      </TableCell>

      <TableCell>{getCategory(row.loai)}</TableCell>
      <TableCell align="center">{row.soLuongBan}</TableCell>
      <TableCell align="center">{fCurrency(row.giasp)}</TableCell>
      <TableCell align="center">
        {row.giamgia > 0 ? fCurrency(row.giamgia) : 'Không giảm giá'}
      </TableCell>
      <TableCell align="center">
        {fCurrency(row.soLuongBan * (row.giamgia > 0 ? row.giamgia : row.giasp))}
      </TableCell>
    </TableRow>
  );
}
