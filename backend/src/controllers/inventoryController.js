const Product = require("../models/ProductModel");
const InventoryTransaction = require("../models/InventoryTransactionModel");

const getInventorySummary = async (req, res) => {
  try {
    const products = await Product.find({})
      .select(
        "name images category gender price countInStock lowStockThreshold",
      )
      .sort({ createdAt: -1 })
      .lean();

    const formattedProducts = products.map((product) => {
      const threshold = Number(product.lowStockThreshold || 5);
      const stock = Number(product.countInStock || 0);

      return {
        ...product,
        lowStockThreshold: threshold,
        isLowStock: stock > 0 && stock <= threshold,
        isOutOfStock: stock <= 0,
      };
    });

    const totalProducts = formattedProducts.length;

    const totalStock = formattedProducts.reduce(
      (sum, product) => sum + Number(product.countInStock || 0),
      0,
    );

    const lowStockCount = formattedProducts.filter(
      (product) => product.isLowStock,
    ).length;

    const outOfStockCount = formattedProducts.filter(
      (product) => product.isOutOfStock,
    ).length;

    return res.status(200).json({
      success: true,
      summary: {
        totalProducts,
        totalStock,
        lowStockCount,
        outOfStockCount,
      },
      products: formattedProducts,
    });
  } catch (error) {
    console.error("GET INVENTORY SUMMARY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Lỗi tải thông tin kho hàng",
    });
  }
};

const getInventoryTransactions = async (req, res) => {
  try {
    const transactions = await InventoryTransaction.find({})
      .populate("product", "name images category")
      .populate("createdBy", "name email role")
      .sort({
        createdAt: -1,
      })
      .limit(100)
      .lean();

    return res.status(200).json({
      success: true,
      transactions,
    });
  } catch (error) {
    console.error("GET INVENTORY TRANSACTIONS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Lỗi tải lịch sử nhập xuất kho",
    });
  }
};

const createInventoryTransaction = async (req, res) => {
  try {
    const { productId, type, quantity, reason } = req.body;

    if (!productId || !type) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng chọn sản phẩm và loại phiếu kho",
      });
    }

    if (!["import", "export", "adjust"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Loại phiếu kho không hợp lệ",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    const oldStock = Number(product.countInStock || 0);
    const qty = Number(quantity || 0);

    if (qty < 0) {
      return res.status(400).json({
        success: false,
        message: "Số lượng không hợp lệ",
      });
    }

    let newStock = oldStock;

    if (type === "import") {
      if (qty <= 0) {
        return res.status(400).json({
          success: false,
          message: "Số lượng nhập kho phải lớn hơn 0",
        });
      }

      newStock = oldStock + qty;
    }

    if (type === "export") {
      if (qty <= 0) {
        return res.status(400).json({
          success: false,
          message: "Số lượng xuất kho phải lớn hơn 0",
        });
      }

      if (oldStock < qty) {
        return res.status(400).json({
          success: false,
          message: `Không đủ hàng để xuất kho. Tồn hiện tại: ${oldStock}`,
        });
      }

      newStock = oldStock - qty;
    }

    if (type === "adjust") {
      newStock = qty;
    }

    product.countInStock = newStock;
    await product.save();

    const transaction = await InventoryTransaction.create({
      product: product._id,
      type,
      quantity: qty,
      oldStock,
      newStock,
      reason: reason || "",
      createdBy: req.user._id,
    });

    const populatedTransaction = await InventoryTransaction.findById(
      transaction._id,
    )
      .populate("product", "name images category")
      .populate("createdBy", "name email role");

    return res.status(201).json({
      success: true,
      message: "Tạo phiếu kho thành công",
      product,
      transaction: populatedTransaction,
    });
  } catch (error) {
    console.error("CREATE INVENTORY TRANSACTION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Lỗi tạo phiếu nhập xuất kho",
    });
  }
};

module.exports = {
  getInventorySummary,
  getInventoryTransactions,
  createInventoryTransaction,
};
