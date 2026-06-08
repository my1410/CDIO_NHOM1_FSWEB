import { Row, Col } from "antd";
import ProductCard from "./ProductCard";

const ProductList = ({ products = [], onAddToCart }) => {
  return (
    <Row gutter={[24, 24]}>
      {products.map((product) => (
        <Col xs={24} sm={12} md={12} lg={8} key={product._id}>
          <ProductCard product={product} onAddToCart={onAddToCart} />
        </Col>
      ))}
    </Row>
  );
};

export default ProductList;
