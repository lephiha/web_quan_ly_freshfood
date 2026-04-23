import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { getImageURL } from 'src/utils/format-image';
import { fCurrency, fNumber } from 'src/utils/format-number';
import * as productService from 'src/services/productService';
import * as imageService from 'src/services/imageService';
import { useRouter } from 'src/routes/hooks';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { getCategory } from './utils';

// ----------------------------------------------------------------------

export type Images = {
  id: string;
  idsp: string;
  image: string;
};

export type ProductProps = {
  id: string;
  tensp: string;
  images: Array<Images>;
  giasp: number;
  giamgia: number;
  mota: string;
  loai: string;
  kho: number;
};

type ProductTableRowProps = {
  row: ProductProps;
  selected: boolean;
  onSelectRow: () => void;
  onClickRow: () => void;
  onReConnectApi: () => void;
};

export function ProductTableRow({
  row,
  selected,
  onSelectRow,
  onReConnectApi,
  onClickRow,
}: ProductTableRowProps) {
  const router = useRouter();
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [openConfirmDelete, setOpenConfirmDelete] = useState<boolean>(false);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setOpenConfirmDelete(false);
    setOpenPopover(null);
  }, []);

  const handleRouteEditPage = useCallback(() => {
    router.push(`/products/edit/${row.id}`);
  }, [router, row.id]);

  const handleClickDelete = useCallback(() => {
    setOpenConfirmDelete(true);
  }, []);

  // Xóa sản phẩm
  const fetchDeleteApi = async (id: string) => {
    const resultDeleteProduct = await productService.deleteProduct(id);
    if (!resultDeleteProduct.success) {
      alert('Xóa sản phẩm không thành công!');
      return false;
    }
    return resultDeleteProduct;
  };

  const deleteImageApi = async (idProduct: string, imageName: string) => {
    await imageService.deleteImage(imageName, idProduct);
  };

  const handleDeleteProduct = useCallback(async () => {
    if (await fetchDeleteApi(row.id)) {
      await Promise.all(
        row.images.map((imageDelete) => deleteImageApi(imageDelete.id, imageDelete.image))
      );
      onReConnectApi();
      setOpenConfirmDelete(false);
      setOpenPopover(null);
    }
  }, [onReConnectApi, row.id, row.images]);

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            <Avatar src={getImageURL(row.images[0].image)} alt={row.tensp} />
            {row.tensp}
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
        <TableCell align="center">{getCategory(row.loai)}</TableCell>
        <TableCell
          align="center"
          sx={{
            display: 'flex',
            maxHeight: '150px',
            width: '400px',
            overflow: 'auto',
          }}
        >
          {row.mota}
        </TableCell>
        <TableCell align="center">{fCurrency(row.giasp)}</TableCell>
        <TableCell align="center">
          {row.giamgia > 0 ? fCurrency(row.giamgia) : 'Không giảm giá'}
        </TableCell>
        <TableCell align="center">{row.kho}</TableCell>
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
            width: 140,
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
          <MenuItem onClick={handleRouteEditPage}>
            <Iconify icon="solar:pen-bold" />
            Chỉnh sửa
          </MenuItem>

          <MenuItem onClick={handleClickDelete} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Xóa
          </MenuItem>
        </MenuList>
      </Popover>

      <Dialog
        open={openConfirmDelete}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn xóa sản phẩm này không?
            <br />
            <Typography
              component="span"
              color="error"
              sx={{
                fontSize: '0.9rem',
              }}
            >
              Lưu ý: Hành động này không thể hoàn tác!
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Trở lại
          </Button>
          <Button onClick={handleDeleteProduct} color="error" autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
