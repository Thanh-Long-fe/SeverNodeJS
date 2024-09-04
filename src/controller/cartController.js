const mongoose = require('mongoose');
const model = require('../model/cart');

const Product = require('../model/products');

class Cart {
  async getOneCartByIdUser(req, res) {
    try {

      const userId = new mongoose.Types.ObjectId(req.params.id);
      const a = await model.aggregate([
        {
          $match: {
            userId
          }
        },
        {
          $unwind: "$products" // Tách từng sản phẩm trong giỏ hàng ra
        },
        {
          $lookup: {
            from: "products", // Collection sản phẩm
            localField: "products.productId",
            foreignField: "_id",
            as: "productDetails"
          }
        },
        {
          $unwind: "$productDetails" // Tách mảng productDetails thành đối tượng
        },

        {
          $lookup: {
            from: "sizes", // Collection kích thước
            localField: "products.size",
            foreignField: "_id",
            as: "sizeDetails"
          }
        },
        {
          $unwind: "$sizeDetails" // Tách mảng sizeDetails thành đối tượng
        },
        {
          $group: {
            _id: "$_id", // Giữ lại ID của giỏ hàng
            userId: { $first: "$userId" }, // Giữ lại userId
            products: {
              $push: {
                productId: "$products.productId",
                name: "$productDetails.name",
                imageURL: "$productDetails.imageURL",

                quantity: "$products.quantity",
                totalPrice: "$products.totalPrice", // Giá tổng đã tính
                size: "$sizeDetails.size" // Tên kích thước từ bảng Sizes
              }
            },
            createdAt: { $first: "$createdAt" },
            updatedAt: { $first: "$updatedAt" }
          }
        }
      ]);

      return res.status(200).json({ data: a[0] });
    } catch (err) {
      console.error('Error fetching cart:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  }


  async addProductCart(req, res) {
    const idUser = req.params.id;
    const idSP = req.query.idSP;
    const idSize = req.query.idSize;
    const quantity = req.query.quantity;
    if (!idUser || !idSP || !quantity || !idSize) {
      return res.status(404).json({ message: 'not found' });
    }

    const products = await Product.findOne({ _id: new mongoose.Types.ObjectId(idSP), isHidden: 0 }).populate({
      path: 'category',
      match: { isHidden: 0 },
    });

    if (!products) {
      return res.status(404).json({ message: 'Products not found' });
    }

    const { priceAdjustment, isHidden } = products.sizes.find((s) => s.sizeId.equals(new mongoose.Types.ObjectId(idSize)));



    if (!priceAdjustment || isHidden !== 0) {
      return res.status(404).json({ message: 'Size not found in product' });
    }
    const price = Number(products.basePrice) + Number(priceAdjustment)
    const cartExists = await model.findOne({ userId: new mongoose.Types.ObjectId(idUser) })
    if (cartExists) {
      const productsExists = cartExists.products.find(product => product.productId.equals(new mongoose.Types.ObjectId(idSP)) && product.size.equals(new mongoose.Types.ObjectId(idSize)))


      console.log(productsExists);

      if (productsExists) {



        const newQuantity = Number(quantity) + Number(productsExists.quantity)
        console.log(newQuantity);

        const cart = await model.findOneAndUpdate(
          { userId: new mongoose.Types.ObjectId(idUser), 'products.productId': new mongoose.Types.ObjectId(idSP), 'products.size': new mongoose.Types.ObjectId(idSize) },
          {
            $set: { 'products.$.quantity': newQuantity, 'products.$.priceTotal': price },

          },
          { new: true }
        );

        console.log(cart);




        if (!cart) {
          return res.status(404).json({ message: 'Update error' });
        }
      }
      else {
        try {
          const updatedCart = await model.findOneAndUpdate(
            { userId: new mongoose.Types.ObjectId(idUser) },
            {
              $push: {
                products: {
                  productId: new mongoose.Types.ObjectId(idSP),
                  quantity: Number(quantity),
                  size: new mongoose.Types.ObjectId(idSize),
                  priceTotal: Number(price)
                }
              }
            },
            { new: true }
          );

          if (!updatedCart) {
            return res.status(404).json({ message: 'updatedCart error' });
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
    else {
      const newCart = await model.create({
        userId: new mongoose.Types.ObjectId(idUser),
        products: [
          {
            productId: new mongoose.Types.ObjectId(idSP),
            quantity: Number(quantity),
            size: new mongoose.Types.ObjectId(idSize),
            priceTotal: Number(price)
          }
        ]
      });
      if (!newCart) {
        return res.status(404).json({ message: 'create cart error' });
      }
    }







    const data = await model.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(idUser)
        }
      },
      {
        $unwind: "$products" // Tách từng sản phẩm trong giỏ hàng ra
      },
      {
        $lookup: {
          from: "products", // Collection sản phẩm
          localField: "products.productId",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      {
        $unwind: "$productDetails" // Tách mảng productDetails thành đối tượng
      },

      {
        $lookup: {
          from: "sizes", // Collection kích thước
          localField: "products.size",
          foreignField: "_id",
          as: "sizeDetails"
        }
      },
      {
        $unwind: "$sizeDetails" // Tách mảng sizeDetails thành đối tượng
      },
      {
        $group: {
          _id: "$_id", // Giữ lại ID của giỏ hàng
          userId: { $first: "$userId" }, // Giữ lại userId
          products: {
            $push: {
              productId: "$products.productId",
              name: "$productDetails.name",
              imageURL: "$productDetails.imageURL",

              quantity: "$products.quantity",
              totalPrice: "$products.totalPrice", // Giá tổng đã tính
              size: "$sizeDetails.size" // Tên kích thước từ bảng Sizes
            }
          },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" }
        }
      }
    ]);

    return res.status(200).json({
      success: true,
      data
    });



  }
  async updateQuantity(req, res) {
    try {
      const idUser = req.params.id;
      const idSP = req.query.idSP;
      const idSize = req.query.idSize;
      const quantity = req.query.quantity;
      if (!idUser || !idSP || !quantity || !idSize) {
        return res.status(404).json({ message: 'not found' });
      }
     const data = await model.findOneAndUpdate(
        {userId: new mongoose.Types.ObjectId(idUser), 'products.productId': new mongoose.Types.ObjectId(idSP), 'products.size': new mongoose.Types.ObjectId(idSize)},
        {$set : {'products.$.quantity': Number(quantity)}},
        {new : true}
      )
      if (!data) {
        return res.status(404).json({ message: 'Size not found in product' });
      }
      return res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      console.log(error);
    }
  }
  async removeProductsCart(req, res){
    try {
      const idUser = req.params.id;
      const idSP = req.query.idSP;
      const idSize = req.query.idSize;
    
      if (!idUser || !idSP  || !idSize) {
        return res.status(404).json({ message: 'not found' });
      }
      const data = await model.findOneAndUpdate(
        { userId: new mongoose.Types.ObjectId(idUser) },
        {
          $pull: { 
            products: { 
              productId: new mongoose.Types.ObjectId(idSP),
              size: new mongoose.Types.ObjectId(idSize)
            } 
          }
        },
        { new: true } 
      );
      if (!data) {
        return res.status(404).json({ message: 'Size not found in product' });
      }
      return res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      console.error(error)
    }
  }
  

}

module.exports = new Cart;
