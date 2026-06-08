import { Button } from "antd";

const HeroBanner = () => {
  return (
    <div
      style={{
        position: "relative",
        height: 520,
        borderRadius: 24,
        overflow: "hidden",
        marginBottom: 70,
      }}
    >
      <img
        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8"
        alt="banner"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, rgba(0,0,0,0.75), rgba(0,0,0,0.2))",
          display: "flex",
          alignItems: "center",
          paddingLeft: 80,
        }}
      >
        <div>
          <p
            style={{
              color: "#60a5fa",
              fontSize: 18,
              marginBottom: 10,
            }}
          >
            AI Fashion Store
          </p>

          <h1
            style={{
              color: "#fff",
              fontSize: 72,
              fontWeight: 700,
              marginBottom: 10,
              lineHeight: 1.1,
            }}
          >
            Fashion AI
          </h1>

          <p
            style={{
              color: "#e5e7eb",
              fontSize: 22,
              maxWidth: 550,
              marginBottom: 35,
            }}
          >
            Khám phá phong cách thời trang hiện đại được cá nhân hóa bằng AI
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
            Khám phá ngay
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
