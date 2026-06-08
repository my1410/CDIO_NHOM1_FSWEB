import { Card, Button, Tag, Rate } from "antd";
import { Link } from "react-router-dom";

const ProductCard = ({ product, onAddToCart }) => {
  if (!product) return null;

  const imageUrl =
    product.images?.[0] ||
    product.image ||
    "https://placehold.co/600x600?text=Fashion+AI";

  const categoryLabel =
    product.category === "ao"
      ? "Áo thời trang"
      : product.category === "quan"
        ? "Quần thiết kế"
        : product.category === "giay"
          ? "Giày thể thao"
          : product.category === "phu-kien"
            ? "Phụ kiện"
            : product.category === "tui"
              ? "Túi & Balo"
              : "Sản phẩm";

  return (
    <Card
      hoverable
      style={{
        borderRadius: 20,
        overflow: "hidden",
        border: "none",
        boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
        height: "100%",
      }}
      styles={{
        body: {
          padding: 20,
          height: 260,
          display: "flex",
          flexDirection: "column",
        },
      }}
      cover={
        <Link
          to={`/product/${product._id}`}
          style={{
            display: "block",
            height: 320,
            overflow: "hidden",
          }}
        >
          <img
            src={imageUrl}
            alt={product.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src =
                "https://placehold.co/600x600?text=Fashion+AI";
            }}
          />
        </Link>
      }
    >
      <Link
        to={`/product/${product._id}`}
        style={{
          textDecoration: "none",
          color: "inherit",
          display: "block",
        }}
      >
        <Tag color="blue" style={{ marginBottom: 8 }}>
          {categoryLabel}
        </Tag>

        <h3
          style={{
            color: "#111827",
            fontSize: 18,
            fontWeight: 700,
            marginBottom: 10,
            minHeight: 50,
          }}
        >
          {product.name}
        </h3>

        <div style={{ marginBottom: 10 }}>
          <Rate
            disabled
            allowHalf
            value={product.rating || 0}
            style={{ fontSize: 14 }}
          />
        </div>

        <p
          style={{
            color: "#ef4444",
            fontSize: 24,
            fontWeight: 700,
            marginBottom: 20,
          }}
        >
          {(product.price || 0).toLocaleString("vi-VN")}đ
        </p>
      </Link>

      <Button
        type="primary"
        block
        size="large"
        style={{
          height: 45,
          borderRadius: 12,
          fontWeight: 600,
          background: "#3b82f6",
          marginTop: "auto",
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onAddToCart?.(product);
        }}
      >
        Thêm vào giỏ hàng
      </Button>
    </Card>
  );
};

export default ProductCard;
