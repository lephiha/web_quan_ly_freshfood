import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { fCurrency, fNumber } from 'src/utils/format-number';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { getStatusMessage, ORDER_STATUS_OPTIONS } from './utils';
import { ProductProps } from '../product/product-table-row';

// ----------------------------------------------------------------------
type Item = ProductProps & {
  image: string;
  soluong: number;
};

export type OrderProps = {
  id: string;
  iduser: string;
  username: string;
  diachi: string;
  sodienthoai: string;
  email: string;
  trangthai: string;
  item: Array<Item>;
  soluong: number;
  tongtien: number;
  ngaydat: string;
  momo: string;
  phuongthucthanhtoan: string;
};

type OrderTableRowProps = {
  row: OrderProps;
  selected: boolean;
  onSelectRow: () => void;
  onClickRow: () => void;
  onUpdateOrderStatusApi: (status: number) => void;
  onReConnectApi: () => void;
};

export function OrderTableRow({
  row,
  selected,
  onSelectRow,
  onClickRow,
  onUpdateOrderStatusApi,
  onReConnectApi,
}: OrderTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleDelete = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const [orderStatusValue, setOrderStatusValue] = useState<number>(Number(row.trangthai));
  const [openSelectOrderStatus, setOpenSelectOrderStatus] = useState(
    row.trangthai !== '3' && row.trangthai !== '4'
  );

  const handleSelectOrderStatus = useCallback(
    (e: SelectChangeEvent<number>) => {
      const newStatus: number = Number(e.target.value);
      setOrderStatusValue(newStatus);
      onUpdateOrderStatusApi(newStatus);

      if (newStatus === 3 || newStatus === 4) {
        setOpenSelectOrderStatus(false);
      } else {
        setOpenSelectOrderStatus(true);
      }
    },
    [onUpdateOrderStatusApi]
  );

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox">
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>
        <TableCell>{row.id}</TableCell>
        <TableCell>{row.username}</TableCell>
        <TableCell align="center">{row.ngaydat}</TableCell>
        <TableCell>{row.diachi}</TableCell>
        <TableCell align="center">{fCurrency(row.tongtien)}</TableCell>
        <TableCell align="center">{row.phuongthucthanhtoan}</TableCell>
        <TableCell
          align="center"
          sx={{
            width: '300px',
          }}
        >
          {orderStatusValue === 3 || orderStatusValue === 4 ? (
            <Label
              color={
                orderStatusValue === 3 ? 'success' : orderStatusValue === 4 ? 'error' : 'default'
              }
              sx={{
                fontSize: 16,
                padding: 2,
              }}
            >
              {getStatusMessage(Number(orderStatusValue))}
            </Label>
          ) : (
            <Select
              value={orderStatusValue}
              onChange={(e) => handleSelectOrderStatus(e)}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '&.Mui-disabled': {
                  color: 'var(--palette-text-primary) !important',
                  '& .MuiSelect-icon': {
                    display: 'none', // Ẩn mũi tên khi Select bị vô hiệu hóa
                  },
                },
              }}
              disabled={!openSelectOrderStatus}
            >
              {ORDER_STATUS_OPTIONS.map((order) => (
                <MenuItem
                  key={order.value}
                  value={order.value}
                  disabled={order.value < orderStatusValue}
                >
                  {order.label}
                </MenuItem>
              ))}
            </Select>
          )}
        </TableCell>
        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            minWidth: 100,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem onClick={onClickRow}>
            <Iconify icon="solar:info-circle-bold" />
            Chi tiết đơn hàng
          </MenuItem>

          {/* <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Xóa
          </MenuItem> */}
        </MenuList>
      </Popover>
    </>
  );
}
