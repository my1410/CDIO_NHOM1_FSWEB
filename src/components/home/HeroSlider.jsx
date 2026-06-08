import { Carousel, Button } from "antd";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
    title: "Fashion AI",
    desc: "Khám phá thời trang bằng AI",
  },

  {
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c",
    title: "Modern Collection",
    desc: "Bộ sưu tập mới nhất 2026",
  },

  {
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
    title: "Streetwear Style",
    desc: "Phong cách trẻ trung hiện đại",
  },
];

const HeroSlider = () => {
  return (
    <Carousel autoplay>
      {slides.map((item, index) => (
        <div key={index}>
          <div
            style={{
              height: "85vh",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <img
              src={item.image}
              alt={item.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />

            {/* OVERLAY */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.2))",
                display: "flex",
                alignItems: "center",
                paddingLeft: 100,
              }}
            >
              <div>
                <h1
                  style={{
                    color: "#fff",
                    fontSize: 80,
                    fontWeight: 700,
                    marginBottom: 10,
                  }}
                >
                  {item.title}
                </h1>

                <p
                  style={{
                    color: "#f3f4f6",
                    fontSize: 24,
                    marginBottom: 30,
                  }}
                >
                  {item.desc}
                </p>

                <Button
                  type="primary"
                  size="large"
                  style={{
                    height: 55,
                    padding: "0 40px",
                    borderRadius: 30,
                    fontSize: 18,
                  }}
                >
                  Mua ngay
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </Carousel>
  );
};

export default HeroSlider;
