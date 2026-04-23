import { useState } from 'react';
import type { CardProps } from '@mui/material/Card';
import type { ChartOptions } from 'src/components/chart';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useTheme, alpha as hexAlpha } from '@mui/material/styles';

import { Chart, useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  chart: {
    colors?: string[];
    categories?: string[];
    series: {
      name: string;
      data: number[];
    }[];
    options?: ChartOptions;
  };
  onFilterYear?: (year: string) => void;
};

export function AnalyticsCategoryRevenue({
  title,
  subheader,
  chart,
  onFilterYear,
  ...other
}: Props) {
  const theme = useTheme();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, index) => currentYear - index);

  const [filterYear, setFilterYear] = useState<string>(currentYear.toString());

  const handleChangeYear = (event: SelectChangeEvent<string>) => {
    const selectedYear = event.target.value;
    setFilterYear(selectedYear);
    if (onFilterYear) {
      onFilterYear(selectedYear);
    }
  };

  const chartColors = chart.colors ?? [
    // theme.palette.primary.dark,
    // hexAlpha(theme.palette.primary.light, 0.64),
    // theme.palette.primary.main,
    theme.palette.primary.main,
    theme.palette.warning.main,
    theme.palette.secondary.dark,
    theme.palette.error.main,
  ];

  const chartOptions = useChart({
    colors: chartColors,
    stroke: {
      width: 3,
      colors: ['transparent'],
    },
    xaxis: {
      categories: chart.categories,
    },
    legend: {
      show: true,
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${value} VNĐ`,
      },
    },
    ...chart.options,
  });

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={
          <div>
            {subheader}
            {/* Thêm Select để chọn năm */}
            <Select
              value={filterYear}
              onChange={handleChangeYear}
              sx={{ marginLeft: 2, minWidth: 120 }}
              size="small"
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </div>
        }
      />

      <Chart
        type="bar"
        series={chart.series}
        options={chartOptions}
        height={364}
        sx={{ py: 2.5, pl: 1, pr: 2.5 }}
      />
    </Card>
  );
}
