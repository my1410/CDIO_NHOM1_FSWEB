const SectionTitle = ({ title, subtitle }) => {
  return (
    <div
      style={{
        marginBottom: 30,
      }}
    >
      <h2
        style={{
          fontSize: 36,
          marginBottom: 8,
          fontWeight: 700,
        }}
      >
        {title}
      </h2>

      <p
        style={{
          color: "#6b7280",
          fontSize: 16,
        }}
      >
        {subtitle}
      </p>
    </div>
  );
};

export default SectionTitle;
