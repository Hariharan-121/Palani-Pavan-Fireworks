const Product = require("../models/Product");

// ✅ USER: Get All Products (With Optional Category Filter)
exports.getProducts = async (req, res) => {
  try {
    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    const products = await Product.find(filter).populate("category");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error });
  }
};

// ✅ USER: Get Single Product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product", error });
  }
};

// ✅ ADMIN: Create Product (With Image Upload)
exports.createProduct = async (req, res) => {
  try {
    const payload = { ...req.body };

    if (req.file) {
      payload.image = `/uploads/${req.file.filename}`;
    }

    const product = await Product.create(payload);
    res.status(201).json(product);

  } catch (error) {
    res.status(500).json({ message: "Product creation failed", error });
  }
};

// ✅ ADMIN: Update Product (With Optional Image Upload)
exports.updateProduct = async (req, res) => {
  try {
    const updates = { ...req.body };

    if (req.file) {
      updates.image = `/uploads/${req.file.filename}`;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);

  } catch (error) {
    res.status(500).json({ message: "Product update failed", error });
  }
};

// ✅ ADMIN: Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Product delete failed", error });
  }
};
