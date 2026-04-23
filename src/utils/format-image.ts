function isURL(str: string): boolean {
  // Kiểm tra xem chuỗi có phải URL không
  const pattern = /^(https?:\/\/)/i;
  return pattern.test(str);
}

export function getImageURL(image: string | File | Blob): string {
  if (typeof image === 'string') {
    // Nếu là URL, trả về URL
    if (isURL(image)) {
      return image;
    }
    // Xử lý ảnh local nếu không phải URL
    return `http://localhost/banhang2/api/images/${image}`;
  }
  if (image instanceof File || image instanceof Blob) {
    // Nếu là File hoặc Blob, tạo URL bằng URL.createObjectURL
    return URL.createObjectURL(image);
  }
  return '';
}
