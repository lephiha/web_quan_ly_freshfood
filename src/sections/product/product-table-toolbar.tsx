import { useCallback, useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

import * as productService from 'src/services/productService';
import * as imageService from 'src/services/imageService';
import { Iconify } from 'src/components/iconify';
import { FiltersProps, ProductFilters } from 'src/layouts/components/filters';
import { CATEGORY_OPTIONS, defaultFilters, PRICE_OPTIONS } from './utils';
import { ProductProps } from './product-table-row';

// ----------------------------------------------------------------------

type ProductTableToolbarProps = {
  listProduct: ProductProps[];
  numSelected: string[];
  filterName: string;
  filters: FiltersProps;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSetFilters: (updateState: Partial<FiltersProps>) => void;
  onSetSelected: (data: string[]) => void;
  onReConnectApi: () => void;
};

export function ProductTableToolbar({
  listProduct,
  numSelected,
  filterName,
  filters,
  onFilterName,
  onSetFilters,
  onSetSelected,
  onReConnectApi,
}: ProductTableToolbarProps) {
  const [openFilter, setOpenFilter] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState<boolean>(false);

  const handleOpenFilter = useCallback(() => {
    setOpenFilter(true);
  }, []);

  const handleCloseFilter = useCallback(() => {
    setOpenFilter(false);
  }, []);

  const handleSetFilters = useCallback(
    (updateState: Partial<FiltersProps>) => {
      onSetFilters({ ...filters, ...updateState });
    },
    [filters, onSetFilters]
  );

  const canReset = Object.keys(filters).some(
    (key) => filters[key as keyof FiltersProps] !== defaultFilters[key as keyof FiltersProps]
  );

  // Xóa sản phẩm
  const handleClickDelete = useCallback(() => {
    setOpenConfirmDelete(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setOpenConfirmDelete(false);
  }, []);

  const fetchDeleteApi = async (id: string) => {
    const resultDeleteProduct = await productService.deleteProduct(id);
    if (!resultDeleteProduct) {
      alert('Xóa sản phẩm không thành công!');
    }
    return resultDeleteProduct;
  };

  const deleteImageApi = async (idProduct: string, imageName: string) => {
    await imageService.deleteImage(imageName, idProduct);
  };

  const handleDeleteProducts = useCallback(async () => {
    const selectedProducts = listProduct.filter((product) => numSelected.includes(product.id));
    await Promise.all(
      selectedProducts.map(async (product) => {
        await fetchDeleteApi(product.id);
        await Promise.all(
          product.images.map((imageDelete) => deleteImageApi(imageDelete.id, imageDelete.image))
        );
      })
    );

    onReConnectApi();
    setOpenConfirmDelete(false);

    if (numSelected.length > 0) {
      onSetSelected([]);
    }
  }, [listProduct, numSelected, onReConnectApi, onSetSelected]);

  return (
    <>
      <Toolbar
        sx={{
          height: 96,
          display: 'flex',
          justifyContent: 'space-between',
          p: (theme) => theme.spacing(0, 1, 0, 3),
          ...(numSelected.length > 0 && {
            color: 'primary.main',
            bgcolor: 'primary.lighter',
          }),
        }}
      >
        {numSelected.length > 0 ? (
          <Typography component="div" variant="subtitle1">
            Đã chọn {numSelected.length}
          </Typography>
        ) : (
          <OutlinedInput
            fullWidth
            value={filterName}
            onChange={onFilterName}
            placeholder="Tìm kiếm sản phẩm..."
            startAdornment={
              <InputAdornment position="start">
                <Iconify width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            }
            sx={{ maxWidth: 320 }}
          />
        )}

        {numSelected.length > 0 ? (
          <Tooltip title="Xóa">
            <IconButton
              onClick={handleClickDelete}
              sx={{
                '&:hover': {
                  color: 'error.main',
                },
              }}
            >
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          </Tooltip>
        ) : (
          <ProductFilters
            canReset={canReset}
            filters={filters}
            onSetFilters={handleSetFilters}
            openFilter={openFilter}
            onOpenFilter={handleOpenFilter}
            onCloseFilter={handleCloseFilter}
            onResetFilter={() => onSetFilters(defaultFilters)}
            options={{
              categories: CATEGORY_OPTIONS,
              price: PRICE_OPTIONS,
            }}
            isStatistic={false}
          />
        )}
      </Toolbar>
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
          <Button onClick={handleDeleteProducts} color="error" autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
