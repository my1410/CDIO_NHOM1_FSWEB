import { Input } from "antd";

const ProductSearch = ({ onSearch }) => {
  return (
    <Input.Search
      placeholder="Tìm sản phẩm..."
      enterButton
      size="large"
      onSearch={onSearch}
    />
  );
};

export default ProductSearch;
