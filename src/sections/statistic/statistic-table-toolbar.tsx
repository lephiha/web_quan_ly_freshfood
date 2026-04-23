import { useCallback, useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';
import { FiltersProps, ProductFilters } from 'src/layouts/components/filters';
import { StatisticProps } from './statistic-table-row';
import { CATEGORY_OPTIONS, defaultFilters, PRICE_OPTIONS } from '../product/utils';

// ----------------------------------------------------------------------

type StatisticTableToolbarProps = {
  filterName: string;
  filters: FiltersProps;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSetFilters: (updateState: Partial<FiltersProps>) => void;
};

export function StatisticTableToolbar({
  filterName,
  filters,
  onFilterName,
  onSetFilters,
}: StatisticTableToolbarProps) {
  const [openFilter, setOpenFilter] = useState(false);

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
      }}
    >
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
        isStatistic
      />
    </Toolbar>
  );
}
