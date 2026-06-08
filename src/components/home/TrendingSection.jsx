import ProductList from "../product/ProductList";
import SectionTitle from "../common/SectionTitle";

const products = [
  {
    id: 1,
    name: "Áo Hoodie",
    price: 350000,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
  },

  {
    id: 2,
    name: "Sneaker",
    price: 890000,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
  },

  {
    id: 3,
    name: "Quần Cargo",
    price: 420000,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
  },

  {
    id: 4,
    name: "Áo Sweater",
    price: 290000,
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1",
  },
];

const TrendingSection = () => {
  return (
    <div
      style={{
        marginBottom: 80,
      }}
    >
      <SectionTitle
        title="Trending Products"
        subtitle="Những sản phẩm hot nhất hiện nay"
      />

      <ProductList products={products} />
    </div>
  );
};

export default TrendingSection;
