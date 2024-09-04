
const model = require('../model/products');

class Products {
    async getProducts(req, res) {
        try {
            const data = await model.aggregate([
                {
                    $match: {
                        isHidden: 0 // Lọc sản phẩm không bị ẩn
                    }
                },
                {
                    $lookup: {
                        from: 'sizes', // Collection name for Size
                        localField: 'sizes.sizeId',
                        foreignField: '_id',
                        as: 'sizesDetails'
                    }
                },
                {
                    $unwind: {
                        path: '$sizes',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'sizes',
                        localField: 'sizes.sizeId',
                        foreignField: '_id',
                        as: 'sizeDetails'
                    }
                },
                {
                    $unwind: {
                        path: '$sizeDetails',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: {
                        'sizeDetails.isHidden': 0 // Lọc các kích thước không bị ẩn
                    }
                },
                {
                    $lookup: {
                        from: 'categories', // Collection name for Category
                        localField: 'category',
                        foreignField: '_id',
                        as: 'categoryDetails'
                    }
                },
                {
                    $unwind: {
                        path: '$categoryDetails',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: {
                        'categoryDetails.isHidden': 0 // Lọc các danh mục không bị ẩn
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        name: { $first: "$name" },
                        description: { $first: "$description" },
                        basePrice: { $first: "$basePrice" },
                        sizes: {
                            $addToSet: {
                                sizeId: "$sizeDetails._id",
                                sizeName: "$sizeDetails.size",
                                priceAdjustment: "$sizes.priceAdjustment"
                            }
                        },
                        category: { $first: "$categoryDetails.name" },
                        imageURL: { $first: "$imageURL" },
                        stock: { $first: "$stock" },
                        isFeatured: { $first: "$isFeatured" },
                        isHidden: { $first: "$isHidden" },
                        createdAt: { $first: "$createdAt" },
                        updatedAt: { $first: "$updatedAt" }
                    }
                }
            ]);
            
              if (!data) {
                return res.status(404).json({
                    success: false,
                    message: "No data found",
                    
                })
              }

              return res.status(200).json({
                success: true,
                data
                
            })
              
              
        } catch (err) {
          console.error('Error fetching products with details:', err);
        }
      };


      async getProductsWithDetails(req, res) {
        try {
          const products = await model.findById(req.params.id)
            .populate({
              path: 'sizes.sizeId',  // Trường sizeId trong Product liên kết với Size
              select: 'size'  // Các trường cần lấy từ Size
            })

            .populate({
                path: 'category',  // Trường sizeId trong Product liên kết với Size
                select: 'name'  // Các trường cần lấy từ Size
              })
            
          
          if (!products) {
            return res.status(404).json({
              success: false,
              message: "No products found"
            });
          }
    
          return res.status(200).json({
            success: true,
            data: products
          });
        } catch (err) {
          console.error('Error fetching products with details:', err);
          return res.status(500).json({
            success: false,
            message: "Server error"
          });
        }
      }

      async addProducts(req, res){
           try {
            const imageURL = req.file ? req.file.path : null;
            
            let inputData = {...req.body, imageURL : imageURL ? imageURL : req.body.imageURL};
            console.log(inputData);
            
            const data = await model.create(inputData)
            if (!data) {
                return res.status(404).json({
                    success: false,
                    message: "error creating"
                })
            }
            return res.status(200).json({
                success: true,
                data
            })
           } catch (error) {
            console.error(error)
            return res.status(500).json({
                success: false,
                error
            })
           }
            

      }

      async updateProducts(req, res){
        try {
            const imageURL = req.file ? req.file.path : null;
            
            let inputData = {...req.body, imageURL : imageURL ? imageURL : req.body.imageURL};
         const data = await model.findByIdAndUpdate(req.params.id,inputData, {new: true}).populate({
            path: 'sizes.sizeId',  // Trường sizeId trong Product liên kết với Size
            select: 'size'  // Các trường cần lấy từ Size
          })

          .populate({
              path: 'category',  // Trường sizeId trong Product liên kết với Size
              select: 'name'  // Các trường cần lấy từ Size
            });
         if (!data) {
             return res.status(404).json({
                 success: false,
                 message: "error update"
             })
         }
         return res.status(200).json({
             success: true,
             data
         })
        } catch (error) {
         console.error(error)
         return res.status(500).json({
             success: false,
             error
         })
        }
         

   }

   async removeProducts(req, res){
    try {
   
 
     const data = await model.findByIdAndUpdate(req.params.id,{$set : {isHidden : 1}}, {new: true});
     if (!data) {
         return res.status(404).json({
             success: false,
             message: "error update"
         })
     }
     return res.status(200).json({
         success: true,
         data
     })
    } catch (error) {
     console.error(error)
     return res.status(500).json({
         success: false,
         error
     })
    }
     

}

async unHidden(req, res){
    try {
   
 
     const data = await model.findByIdAndUpdate(req.params.id,{$set : {isHidden : 0}}, {new: true});
     if (!data) {
         return res.status(404).json({
             success: false,
             message: "error update"
         })
     }
     return res.status(200).json({
         success: true,
         data
     })
    } catch (error) {
     console.error(error)
     return res.status(500).json({
         success: false,
         error
     })
    }
     

}
async  getTopFeaturedProducts(req, res) {
    try {
      const topFeaturedProducts = await model.find()
        .sort({ isFeatured: -1 }) // Sắp xếp giảm dần theo trường isFeatured
        .limit(10)
        .populate({
            path: 'sizes.sizeId',  // Trường sizeId trong Product liên kết với Size
            select: 'size'  // Các trường cần lấy từ Size
          })

          .populate({
              path: 'category',  // Trường sizeId trong Product liên kết với Size
              select: 'name'  // Các trường cần lấy từ Size
        }); // Giới hạn kết quả trả về là 10 sản phẩm

        if (!topFeaturedProducts) {
            return res.status(404).json({
                success: false,
                message: "error update"
            })
        }
        return res.status(200).json({
            success: true,
            data : topFeaturedProducts
        })
     
    } catch (err) {
      console.error('Error fetching top featured products:', err);
    }
  }



}

module.exports = new Products();