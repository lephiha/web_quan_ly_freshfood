import { OrderProps } from '../order/order-table-row';
import { ProductProps } from '../product/product-table-row';
import { getCategory } from '../product/utils';

const monthCategory = [
  'Tháng 1',
  'Tháng 2',
  'Tháng 3',
  'Tháng 4',
  'Tháng 5',
  'Tháng 6',
  'Tháng 7',
  'Tháng 8',
  'Tháng 9',
  'Tháng 10',
  'Tháng 11',
  'Tháng 12',
];

export function calculateDataMetrics(listItems: any[], dateField: string | number) {
  const monthlyCount = listItems.reduce(
    (acc: any[], item: { [x: string]: string | number | Date }) => {
      const createdMonth = new Date(item[dateField]).getMonth();
      acc[createdMonth] = (acc[createdMonth] || 0) + 1;
      return acc;
    },
    Array(12).fill(0)
  ); // Khởi tạo mảng 12 tháng, mỗi tháng bắt đầu với giá trị 0

  const currentMonth = new Date().getMonth();
  const currentMonthValue = monthlyCount[currentMonth];
  const previousMonthValue = currentMonth > 0 ? monthlyCount[currentMonth - 1] : 0;

  let percentChange = 0;
  if (previousMonthValue > 0) {
    percentChange = ((currentMonthValue - previousMonthValue) / previousMonthValue) * 100;
  } else if (currentMonthValue > 0) {
    percentChange = 100;
  }

  return {
    total: listItems.length,
    percentChange,
    chartData: {
      categories: monthCategory.slice(0, currentMonth + 1),
      series: monthlyCount.slice(0, currentMonth + 1),
    },
  };
}

export function calculateSaleMetrics(
  listItems: any[],
  dateField: string | number,
  saleField: string
) {
  const monthlySaleCount = listItems.reduce(
    (acc: any[], item: { [x: string]: string | number | Date }) => {
      const createdMonth = new Date(item[dateField]).getMonth();

      // Kiểm tra nếu sản phẩm đang "sale"
      if (item[saleField] > '0') {
        acc[createdMonth] = (acc[createdMonth] || 0) + 1;
      }

      return acc;
    },
    Array(12).fill(0)
  ); // Khởi tạo mảng 12 tháng, mỗi tháng bắt đầu với giá trị 0

  const currentMonth = new Date().getMonth();
  const currentMonthSaleValue = monthlySaleCount[currentMonth];
  const previousMonthSaleValue = currentMonth > 0 ? monthlySaleCount[currentMonth - 1] : 0;

  let percentChange = 0;
  if (previousMonthSaleValue > 0) {
    percentChange =
      ((currentMonthSaleValue - previousMonthSaleValue) / previousMonthSaleValue) * 100;
  } else if (currentMonthSaleValue > 0) {
    percentChange = 100;
  }

  return {
    total: listItems.filter((item) => item[saleField] > 0).length, // Tổng sản phẩm sale
    percentChange, // Tỷ lệ phần trăm thay đổi sản phẩm sale giữa các tháng
    chartData: {
      categories: monthCategory.slice(0, currentMonth + 1),
      series: monthlySaleCount.slice(0, currentMonth + 1), // Dữ liệu doanh số sản phẩm sale theo tháng
    },
  };
}

//-----------------------------------------------------------------------------------------
export function categorizeProduct(listProduct: ProductProps[]) {
  const categories = {
    'Rau Củ': 0,
    'Thịt, Cá, Trứng': 0,
    'Trái Cây': 0,
  };

  listProduct.forEach((product) => {
    switch (product.loai) {
      case '1':
        categories['Rau Củ'] += 1;
        break;
      case '2':
        categories['Thịt, Cá, Trứng'] += 1;
        break;
      case '3':
        categories['Trái Cây'] += 1;
        break;
      default:
        break;
    }
  });
  return Object.entries(categories).map(([label, value]) => ({ label, value }));
}

//-------------------------------------------------------------------------------------
const productCategory = [
  { value: 1, label: 'Rau Củ' },
  { value: 2, label: 'Thịt, Cá, Trứng' },
  { value: 3, label: 'Trái Cây' },
];

export const calculateCategoryConsumption = (orders: OrderProps[]) => {
  // Khai báo categoryConsumption với kiểu key là string và value là number
  const categoryConsumption: { [key: string]: number } = {};

  // Tính tổng số lượng tiêu thụ cho mỗi loại sản phẩm
  orders.forEach((order) => {
    order.item.forEach((product) => {
      // Tìm nhãn của loại sản phẩm tương ứng trong productCategory
      const categoryLabel = productCategory.find(
        (category) => category.value === Number(product.loai)
      )?.label;

      if (categoryLabel) {
        const quantity = Number(product.soluong);
        if (categoryConsumption[categoryLabel]) {
          categoryConsumption[categoryLabel] += quantity;
        } else {
          categoryConsumption[categoryLabel] = quantity;
        }
      }
    });
  });

  // Đảm bảo tất cả các loại sản phẩm đều xuất hiện, kể cả những loại không có trong đơn hàng
  productCategory.forEach((category) => {
    if (!categoryConsumption[category.label]) {
      categoryConsumption[category.label] = 0;
    }
  });

  // Tạo dữ liệu cho biểu đồ từ categoryConsumption
  const categoryData = Object.keys(categoryConsumption).map((loai) => ({
    label: loai,
    value: categoryConsumption[loai],
  }));

  return categoryData;
};

//-------------------------------------------------------------------------------------
export const processOrderData = (filterYear: string, orders: OrderProps[]) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Nếu năm lọc không phải năm hiện tại, hiển thị đủ 12 tháng
  const categories =
    filterYear.toString() === currentYear.toString()
      ? monthCategory.slice(0, currentMonth + 1)
      : monthCategory;

  const series = [
    { name: 'Rau Củ', data: Array(categories.length).fill(0) },
    { name: 'Thịt, Cá, Trứng', data: Array(categories.length).fill(0) },
    { name: 'Trái Cây', data: Array(categories.length).fill(0) },
  ];

  // Lọc đơn hàng theo năm đã chọn
  orders.forEach((order) => {
    const orderDate = new Date(order.ngaydat);
    const orderYear = orderDate.getFullYear();

    // Chỉ xử lý nếu đơn hàng thuộc năm đã chọn
    if (orderYear.toString() === filterYear.toString()) {
      const orderMonth = orderDate.getMonth();

      // Xử lý đơn hàng thuộc năm đã chọn và theo tháng phù hợp
      order.item.forEach((product) => {
        const revenue = (product.giamgia > 0 ? product.giamgia : product.giasp) * product.soluong; // Tổng doanh thu của sản phẩm trong đơn hàng
        series.forEach((item) => {
          if (item.name === getCategory(product.loai)) {
            item.data[orderMonth] += revenue;
          }
        });
      });
    }
  });

  return { categories, series };
};
