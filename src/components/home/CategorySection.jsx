import { Card, Col, Row } from "antd";

const categories = [
  {
    title: "Thời trang nam",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
  },
  {
    title: "Thời trang nữ",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c",
  },
  {
    title: "Sneaker",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
  },
];

const CategorySection = () => {
  return (
    <div style={{ marginBottom: 50 }}>
      <h2
        style={{
          marginBottom: 25,
        }}
      >
        Danh mục nổi bật
      </h2>

      <Row gutter={[20, 20]}>
        {categories.map((item, index) => (
          <Col xs={24} md={8} key={index}>
            <Card
              hoverable
              cover={
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    height: 280,
                    objectFit: "cover",
                  }}
                />
              }
            >
              <h3>{item.title}</h3>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CategorySection;
