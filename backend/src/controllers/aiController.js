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

const normalizeText = (text = "") => {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
};

const normalizeCategory = (category = "") => {
  const value = normalizeText(category);

  if (
    value.includes("ao") ||
    value.includes("shirt") ||
    value.includes("jacket") ||
    value.includes("hoodie") ||
    value.includes("t-shirt") ||
    value.includes("blazer") ||
    value.includes("sweater") ||
    value.includes("coat") ||
    value.includes("leather jacket")
  ) {
    return "ao";
  }

  if (
    value.includes("quan") ||
    value.includes("pant") ||
    value.includes("jean") ||
    value.includes("short") ||
    value.includes("trouser")
  ) {
    return "quan";
  }

  if (
    value.includes("giay") ||
    value.includes("shoe") ||
    value.includes("sneaker") ||
    value.includes("boot") ||
    value.includes("sandals")
  ) {
    return "giay";
  }

  if (
    value.includes("phu-kien") ||
    value.includes("phu kien") ||
    value.includes("accessory") ||
    value.includes("watch") ||
    value.includes("dong ho") ||
    value.includes("bag") ||
    value.includes("tui") ||
    value.includes("vi") ||
    value.includes("wallet") ||
    value.includes("hat") ||
    value.includes("cap")
  ) {
    return "phu-kien";
  }

  return value;
};

const normalizeGender = (gender = "") => {
  const value = normalizeText(gender);

  if (
    value.includes("men") ||
    value.includes("male") ||
    value.includes("nam")
  ) {
    return "men";
  }

  if (
    value.includes("women") ||
    value.includes("female") ||
    value.includes("nu")
  ) {
    return "women";
  }

  return "unisex";
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

const imageSearch = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng tải lên hình ảnh",
      });
    }

    const base64Image = req.file.buffer.toString("base64");
    const mimeType = req.file.mimetype;

    console.log("=== GOING TO OPENROUTER ===");

    const completion = await client.chat.completions.create({
      model: "openai/gpt-4o-mini",
      temperature: 0.2,
      max_tokens: 300,
      provider: {
        allow_fallbacks: true,
      },
      messages: [
        {
          role: "system",
          content: `
Bạn là AI Vision chuyên phân tích thời trang.

QUY TẮC PHÂN LOẠI:
- Áo khoác, áo thun, áo sơ mi, hoodie, blazer, sweater, jacket, coat => category là "ao"
- Quần jeans, quần short, quần dài, pants, trousers => category là "quan"
- Giày, sneaker, boots, sandals => category là "giay"
- Đồng hồ, túi, ví, balo, kính, mũ, phụ kiện => category là "phu-kien"

Nếu ảnh là áo khoác da, bắt buộc trả:
category = "ao"

Chỉ trả JSON thuần, không giải thích:
{
  "category": "ao",
  "gender": "men",
  "colors": ["Nâu", "Đen"],
  "keywords": ["áo khoác da", "leather jacket", "jacket"],
  "style": "casual"
}
          `,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Phân tích sản phẩm thời trang chính trong ảnh. Trả JSON thật ngắn.",
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
              },
            },
          ],
        },
      ],
    });

    console.log("=== OPENROUTER SUCCESS ===");

    const rawText = completion.choices?.[0]?.message?.content || "{}";
    console.log("RAW AI TEXT:", rawText);

    let aiAnalysis;

    try {
      aiAnalysis = JSON.parse(rawText.replace(/```json|```/g, "").trim());
    } catch (error) {
      aiAnalysis = {
        category: "",
        gender: "unisex",
        colors: [],
        keywords: [],
        style: rawText,
      };
    }

    const detectedCategory = normalizeCategory(aiAnalysis.category);
    const detectedGender = normalizeGender(aiAnalysis.gender);

    aiAnalysis = {
      ...aiAnalysis,
      category: detectedCategory || aiAnalysis.category || "",
      gender: detectedGender || "unisex",
    };

    console.log("AI ANALYSIS:", aiAnalysis);
    console.log("DETECTED CATEGORY:", detectedCategory);
    console.log("DETECTED GENDER:", detectedGender);

    const products = await Product.find({ countInStock: { $gt: 0 } }).lean();

    const matchedProducts = products
      .map((product) => {
        let score = 0;

        const productCategory = normalizeCategory(product.category);
        const productGender = normalizeGender(product.gender);

        const productText = normalizeText(`
          ${product.name || ""}
          ${product.description || ""}
          ${product.category || ""}
          ${product.gender || ""}
          ${product.colors?.join(" ") || ""}
          ${product.sizes?.join(" ") || ""}
        `);

        // Quan trọng: nếu AI nhận diện được danh mục,
        // chỉ lấy sản phẩm cùng danh mục.
        if (detectedCategory && productCategory !== detectedCategory) {
          return {
            ...product,
            matchScore: 0,
          };
        }

        // Đúng danh mục thì cộng điểm rất mạnh.
        if (productCategory === detectedCategory) {
          score += 20;
        }

        if (
          detectedGender &&
          (productGender === detectedGender || productGender === "unisex")
        ) {
          score += 3;
        }

        if (Array.isArray(aiAnalysis.colors)) {
          aiAnalysis.colors.forEach((color) => {
            const normalizedColor = normalizeText(color);

            if (normalizedColor && productText.includes(normalizedColor)) {
              score += 4;
            }
          });
        }

        if (Array.isArray(aiAnalysis.keywords)) {
          aiAnalysis.keywords.forEach((keyword) => {
            const normalizedKeyword = normalizeText(keyword);

            if (normalizedKeyword && productText.includes(normalizedKeyword)) {
              score += 5;
            }
          });
        }

        if (product.isSale) score += 1;
        if (product.rating >= 4.5) score += 1;

        return {
          ...product,
          matchScore: score,
        };
      })
      .filter((product) => product.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 8);

    return res.status(200).json({
      success: true,
      aiAnalysis,
      products: matchedProducts,
    });
  } catch (error) {
    console.error("AI IMAGE SEARCH ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Không thể phân tích hình ảnh bằng AI",
    });
  }
};

module.exports = {
  getAiRecommendation,
  imageSearch,
};
