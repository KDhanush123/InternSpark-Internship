const Product = require('./model');

const createProduct = async (req, res) => {
  try {
    const { sno, name, description, price, category, stock } = req.body;
    
    console.log(`createProduct invoked with:`, { sno, name, description, price, category, stock });

    if (!sno || !name || !description || !price || !category) {
      console.log(`createProduct failed: Missing fields`);
      return res.status(400).json({ success: false, message: 'Please provide all required fields (including sno)' });
    }

    const product = await Product.create({ sno, name, description, price, category, stock });
    console.log(`createProduct success. sno: ${product.sno}`);
    
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error(`createProduct error: ${error.message}`);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Product with this sno already exists' });
    }
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const getProducts = async (req, res) => {
  try {
    console.log(`getProducts invoked`);
    const products = await Product.find({});
    console.log(`getProducts success. Count: ${products.length}`);
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    console.error(`getProducts error: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const getProductBySno = async (req, res) => {
  try {
    const { sno } = req.params;
    console.log(`getProductBySno invoked for sno: ${sno}`);
    
    const product = await Product.findOne({ sno });
    if (!product) {
      console.log(`getProductBySno failed: Not found`);
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    console.log(`getProductBySno success`);
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error(`getProductBySno error: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { sno } = req.params;
    console.log(`updateProduct invoked for sno: ${sno} with body:`, req.body);
    
    
    if (req.body.sno && req.body.sno != sno) {
       return res.status(400).json({ success: false, message: 'Cannot update sno field' });
    }

    const product = await Product.findOneAndUpdate({ sno }, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!product) {
      console.log(`updateProduct failed: Not found`);
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    console.log(`updateProduct success`);
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error(`updateProduct error: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { sno } = req.params;
    console.log(`deleteProduct invoked for sno: ${sno}`);
    
    const product = await Product.findOneAndDelete({ sno });
    if (!product) {
      console.log(`deleteProduct failed: Not found`);
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    console.log(`deleteProduct success`);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error(`deleteProduct error: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductBySno,
  updateProduct,
  deleteProduct
};
