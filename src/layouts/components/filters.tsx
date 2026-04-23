import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Rating from '@mui/material/Rating';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export type FiltersProps = {
  price: string;
  category: string;
  orderStatus: string;
  month: string;
  year: string;
};

type ProductFiltersProps = {
  canReset: boolean;
  openFilter: boolean;
  filters: FiltersProps;
  onOpenFilter: () => void;
  onCloseFilter: () => void;
  onResetFilter: () => void;
  onSetFilters: (updateState: Partial<FiltersProps>) => void;
  options: {
    categories?: { value: string; label: string }[];
    price?: { value: string; label: string }[];
    orderStatus?: { value: number; label: string }[];
  };
  isStatistic: boolean;
};

export function ProductFilters({
  filters,
  options,
  canReset,
  openFilter,
  onSetFilters,
  onOpenFilter,
  onCloseFilter,
  onResetFilter,
  isStatistic,
}: ProductFiltersProps) {
  const currentYear = new Date().getFullYear();

  const renderCategory = (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Loại sản phẩm</Typography>
      <RadioGroup>
        {options.categories &&
          options.categories.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={
                <Radio
                  checked={filters.category.includes(option.value)}
                  onChange={() => onSetFilters({ category: option.value })}
                />
              }
              label={option.label}
            />
          ))}
      </RadioGroup>
    </Stack>
  );

  const renderPrice = (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Giá sản phẩm</Typography>
      <RadioGroup>
        {options.price &&
          options.price.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={
                <Radio
                  checked={filters.price.includes(option.value)}
                  onChange={() => onSetFilters({ price: option.value })}
                />
              }
              label={option.label}
            />
          ))}
      </RadioGroup>
    </Stack>
  );

  const renderOrderStatus = (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Trạng thái đơn hàng</Typography>
      <RadioGroup>
        {options.orderStatus &&
          options.orderStatus.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={
                <Radio
                  checked={filters.orderStatus.includes(option.value.toString())}
                  onChange={() => onSetFilters({ orderStatus: option.value.toString() })}
                />
              }
              label={option.label}
            />
          ))}
      </RadioGroup>
    </Stack>
  );

  const renderDateFilter = (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Theo thời gian</Typography>
      <Stack direction="row" spacing={2}>
        <Select
          value={filters.month || '0'}
          onChange={(e) => onSetFilters({ month: e.target.value })}
          displayEmpty
          sx={{
            minWidth: '72px',
          }}
          defaultValue="0"
        >
          <MenuItem value="0">
            <em>Tháng</em>
          </MenuItem>
          {[...Array(12)].map((_, index) => (
            <MenuItem key={index + 1} value={index + 1}>
              Tháng {index + 1}
            </MenuItem>
          ))}
        </Select>
        <Select
          value={filters.year || '0'}
          onChange={(e) => onSetFilters({ year: e.target.value })}
          displayEmpty
          sx={{
            minWidth: '72px',
          }}
        >
          <MenuItem value="0">
            <em>Năm</em>
          </MenuItem>
          {Array.from({ length: 10 }, (_, index) => (
            <MenuItem key={currentYear - index} value={currentYear - index}>
              {currentYear - index}
            </MenuItem>
          ))}
        </Select>
      </Stack>
    </Stack>
  );
  return (
    <Box>
      <Button
        disableRipple
        color="inherit"
        endIcon={
          <Badge color="error" variant="dot" invisible={!canReset}>
            <Iconify icon="ic:round-filter-list" />
          </Badge>
        }
        onClick={onOpenFilter}
      >
        Bộ lọc
      </Button>

      <Drawer
        anchor="right"
        open={openFilter}
        onClose={onCloseFilter}
        PaperProps={{
          sx: { width: 280, overflow: 'hidden' },
        }}
      >
        <Box display="flex" alignItems="center" sx={{ pl: 2.5, pr: 1.5, py: 2 }}>
          <Typography variant="h6" flexGrow={1}>
            Bộ lọc
          </Typography>

          <IconButton onClick={onResetFilter}>
            <Badge color="error" variant="dot" invisible={!canReset}>
              <Iconify icon="solar:refresh-linear" />
            </Badge>
          </IconButton>

          <IconButton
            onClick={onCloseFilter}
            sx={{
              '&:hover': {
                color: 'error.main',
              },
            }}
          >
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </Box>

        <Divider />

        <Scrollbar>
          <Stack spacing={3} sx={{ p: 3 }}>
            {options.categories && renderCategory}
            {options.price && renderPrice}
            {options.orderStatus && renderOrderStatus}
            {isStatistic && renderDateFilter}
          </Stack>
        </Scrollbar>
      </Drawer>
    </Box>
  );
}
