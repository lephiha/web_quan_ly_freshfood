import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';
import { FiltersProps, ProductFilters } from 'src/layouts/components/filters';
import { useCallback, useState } from 'react';
import { defaultFilters } from '../product/utils';
import { ORDER_STATUS_OPTIONS } from './utils';

// ----------------------------------------------------------------------

type OrderTableToolbarProps = {
  numSelected: number;
  filterName: string;
  filters: FiltersProps;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSetFilters: (updateState: Partial<FiltersProps>) => void;
  onReConnectApi: () => void;
};

export function OrderTableToolbar({
  numSelected,
  filterName,
  filters,
  onFilterName,
  onSetFilters,
  onReConnectApi,
}: OrderTableToolbarProps) {
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
  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          Đã chọn {numSelected}
        </Typography>
      ) : (
        <OutlinedInput
          fullWidth
          value={filterName}
          onChange={onFilterName}
          placeholder="Tìm kiếm ID đơn hàng, khách hàng..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          }
          sx={{ maxWidth: 320 }}
        />
      )}

      {numSelected > 0 ? (
        <Tooltip title="Xóa">
          <IconButton>
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
            orderStatus: ORDER_STATUS_OPTIONS,
          }}
          isStatistic={false}
        />
      )}
    </Toolbar>
  );
}
