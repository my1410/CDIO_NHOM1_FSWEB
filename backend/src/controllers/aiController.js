const OpenAI = require("openai");
const Product = require("../models/ProductModel");

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:5000",
    "X-Title": "Fashion AI E-commerce",
  },
});

const formatPrice = (price) => {
  return `${Number(price || 0).toLocaleString("vi-VN")}đ`;
};

const getAiRecommendation = async (req, res) => {
  try {
    const { stylePreferences } = req.body;

    if (!stylePreferences || !stylePreferences.trim()) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập nhu cầu thời trang của bạn.",
      });
    }

    const products = await Product.find({})
      .select(
        "name description category price gender isSale discount sizes colors countInStock rating images",
      )
      .limit(40)
      .lean();

    const availableProducts = products.filter(
      (product) => product.countInStock > 0,
    );

    const productText =
      availableProducts.length > 0
        ? availableProducts
            .map((p, index) => {
              const saleText = p.isSale
                ? `Đang sale ${p.discount || 0}%`
                : "Không sale";

              return `
${index + 1}. ${p.name}
- Danh mục: ${p.category || "Thời trang"}
- Giới tính: ${p.gender || "unisex"}
- Giá: ${formatPrice(p.price)}
- ${saleText}
- Size: ${p.sizes?.length ? p.sizes.join(", ") : "Không rõ"}
- Màu: ${p.colors?.length ? p.colors.join(", ") : "Không rõ"}
- Tồn kho: ${p.countInStock || 0}
- Rating: ${p.rating || 0}/5
- Mô tả: ${p.description || "Không có mô tả"}
`;
            })
            .join("\n")
        : "Hiện chưa có sản phẩm còn hàng.";

    const completion = await client.chat.completions.create({
      model: "meta-llama/llama-3.1-8b-instruct",
      temperature: 0.7,
      max_tokens: 700,
      messages: [
        {
          role: "system",
          content: `
Bạn là Fashion AI Stylist chuyên nghiệp cho website Fashion AI Store.

Nhiệm vụ của bạn:
- Tư vấn outfit theo nhu cầu khách hàng.
- Chỉ gợi ý sản phẩm có trong danh sách bên dưới.
- Ưu tiên sản phẩm còn hàng, rating cao, phù hợp giới tính/phong cách/ngân sách.
- Nếu khách nói ngân sách, hãy chọn sản phẩm phù hợp ngân sách.
- Nếu khách nói dịp mặc như đi học, đi chơi, đi làm, hẹn hò, gym, du lịch, hãy phối outfit theo dịp đó.
- Nếu khách nói màu sắc, hãy ưu tiên màu đó.
- Nếu khách hỏi sale/rẻ, ưu tiên sản phẩm isSale.
- Không bịa sản phẩm ngoài danh sách.
- Trả lời bằng tiếng Việt.
- Văn phong thân thiện, hiện đại, như stylist cá nhân.
- Câu trả lời ngắn gọn, dễ đọc.

Format trả lời bắt buộc:

👗 Gợi ý outfit:
- ...

🛍️ Sản phẩm nên chọn:
1. Tên sản phẩm - Giá - Lý do chọn
2. ...

💡 Mẹo phối đồ:
- ...

Nếu không tìm thấy sản phẩm phù hợp, hãy nói thật và gợi ý từ khóa khác.

Danh sách sản phẩm hiện có:
${productText}
          `,
        },
        {
          role: "user",
          content: stylePreferences.trim(),
        },
      ],
    });

    const aiFeedback =
      completion.choices?.[0]?.message?.content ||
      "AI chưa tạo được gợi ý phù hợp.";

    return res.status(200).json({
      success: true,
      aiFeedback,
    });
  } catch (error) {
    console.error("AI ERROR:", error);

    return res.status(200).json({
      success: true,
      aiFeedback:
        "Hiện tại AI Stylist tạm thời chưa khả dụng. Bạn có thể thử tìm các sản phẩm như hoodie, sneaker, blazer, jeans hoặc các sản phẩm đang sale.",
    });
  }
};

module.exports = {
  getAiRecommendation,
};
