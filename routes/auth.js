const DeliveryModel = require("../models/Delivery.model");
const RestaurantModel = require("../models/Restaurant.model");
const UserModel = require("../models/User.model");
const {
  restaurantItemsValidation,
  cartItemValidation,
  locationValidation
} = require("./validation");
const multer = require("multer");
const fs = require("fs");
const { response } = require("express");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  {
    file.mimetype === "image/jpeg" || file.mimetype === "image/png"
      ? cb(null, true)
      : cb(null, false);
  }
};

module.exports.upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

const Model = (req) => {
  return req === "user"
    ? UserModel
    : req === "restaurant"
      ? RestaurantModel
      : DeliveryModel;
};

exports.addItems = async (req, res) => {
  const model = Model(req.user.type);
  const { error } = restaurantItemsValidation(req.body);
  if (error)
    return res
      .json({ success: false, message: error.details[0].message });

  const items = {
    uid: req.user._id,
    itemImage: req.file.filename,
    itemName: req.body.itemName,
    itemDescription: req.body.itemDescription,
    itemPrice: req.body.itemPrice,
    veg: req.body.Veg,
  };
  try {
    const savedData = await model.findByIdAndUpdate(req.user._id, {
      $push: { restaurantItems: items },
    });
    if (savedData)
      return res.status(201).json({ success: true, message: "Item Saved" });
  } catch (err) {
    return res.json({ success: false, message: err });
  }
};
exports.getItems = async (req, res) => {
  const model = Model(req.user.type);
  try {
    const user = await model
      .findById(req.user._id)
      .where("restaurantItems")
      .ne([]);

    if (user)
      return res
        .status(201)
        .json({ success: true, message: user.restaurantItems });
    else
      return res
        .json({ success: false, message: "Empty Items List" });
  } catch (err) {
    return res.json({ success: false, message: "Error: " + err });
  }
};
exports.getParticularRestaurantItems = async (req, res) => {
  try {
    const user = await RestaurantModel.findById(req.params.uid);

    const data = user.restaurantItems.map((item) => {
      if (item._id.equals(req.params.id)) {
        return res
          .status(201)
          .json({ success: true, message: item });
      }
    })

    if (!data) {
      return res
        .json({ success: false, message: "No Item Found" });
    }
  } catch (err) {
    return res.json({ success: false, message: "Error: " + err });
  }
};

exports.deleteItems = async (req, res) => {
  const model = Model(req.user.type);

  try {
    const user = await model.findById(req.user._id);

    for (const i in user.restaurantItems) {
      if (user.restaurantItems[i]._id == req.params.id) {
        fs.unlink("./uploads/" + user.restaurantItems[i].itemImage, function (
          err
        ) {
          if (err) return res.json({ success: false, message: err });
        });
      }
    }
    const deletedData = await model.findByIdAndUpdate(req.user._id, {
      $pull: { restaurantItems: { _id: req.params.id } },
    });
    if (deletedData)
      return res.status(201).json({ success: true, message: "Item Deleted" });
    else
      return res
        .json({ success: false, message: "Empty Items List" });
  } catch (err) {
    return res.json({ success: false, message: err });
  }
};

exports.editItems = async (req, res) => {
  const model = Model(req.user.type);
  try {
    const { error } = restaurantItemsValidation(req.body);
    if (error)
      return res
        .json({ success: false, message: error.details[0].message });

    const user = RestaurantModel.findById(req.user._id);

    if (req.file) {

      const savedData = await model.updateOne(
        { "restaurantItems._id": req.params.id },
        {
          $set: {

            "restaurantItems.$.itemImage": req.file.filename,

            "restaurantItems.$.itemName": req.body.itemName,
            "restaurantItems.$.itemDescription": req.body.itemDescription,
            "restaurantItems.$.itemPrice": req.body.itemPrice,
            "restaurantItems.$.veg": req.body.Veg,
          },
        }
      );

      if (savedData) {
        return res.status(201).json({ success: true, message: "Item updated" });
      } else {
        return res.json({ success: false, message: "Error updating Item" });
      }
    }
    else {
      const savedData = await model.updateOne(
        { "restaurantItems._id": req.params.id },
        {
          $set: {

            "restaurantItems.$.itemName": req.body.itemName,
            "restaurantItems.$.itemDescription": req.body.itemDescription,
            "restaurantItems.$.itemPrice": req.body.itemPrice,
            "restaurantItems.$.veg": req.body.Veg,
          },
        }
      );
      if (savedData) {
        return res.status(201).json({ success: true, message: "Item updated" });
      } else {
        return res.json({ success: false, message: "Error updating Item" });
      }
    }


  } catch (err) {
    return res.json({ success: false, message: err });
  }
};


exports.restaurant = async (req, res) => {

  const user = await RestaurantModel.findById(req.params.id);

  if (user) return res.status(201).json({ success: true, message: user.restaurantAddress });
  else
    return res
      .json({ success: false, message: "Empty restaurants List" });
};

exports.restaurants = async (req, res) => {
  const user = await RestaurantModel.find();

  if (user) return res.status(201).json({ success: true, message: user });
  else
    return res
      .json({ success: false, message: "Empty restaurants List" });
};

exports.getRestaurantItems = async (req, res) => {
  try {
    const user = await RestaurantModel.findById(req.params.id)
      .where("restaurantItems")
      .ne([]);
    if (user)
      return res
        .status(201)
        .json({ success: true, message: user.restaurantItems });
    else
      return res
        .status(401)
        .json({ success: false, message: "No Items in this Restaurant" });
  } catch (err) {
    return res.status(401).json({ success: false, message: "Error: " + err });
  }
};

exports.addToCart = async (req, res) => {
  const model = Model(req.user.type);

  try {

    const user = await RestaurantModel.findById(req.params.uid);
    while (req.params.sign == "add") {
      for (const i in user.restaurantItems) {
        if (req.user.cart[0] == undefined) {
          if (user.restaurantItems[i]._id == req.params.id) {
            const data = {
              _id: req.params.id,
              rid: user._id,
              restaurantName: user.restaurantAddress.restaurantName,
              restaurantImage: user.profileImage,
              count: 1,
              itemName: user.restaurantItems[i].itemName,
              itemPrice: user.restaurantItems[i].itemPrice,
              itemImage: user.restaurantItems[i].itemImage,
            };

            const savedCart = await model.findByIdAndUpdate(req.user._id, {
              $push: { cart: data },
            });
            if (savedCart)
              return res
                .status(201)
                .json({ success: true, message: "Item added To Cart" });
            else
              return res
                .json({ success: false, dialog: false, message: "Error Saving To Cart" });
          }
        }
        else {

          if (req.user.cart[0].restaurantName == user.restaurantAddress.restaurantName) {

            for (const j in req.user.cart) {

              if (req.user.cart[j]._id == req.params.id) {

                const savedCart = await model.updateOne(
                  { "cart._id": req.params.id },
                  {
                    $set: {
                      "cart.$.count": req.user.cart[j].count + 1
                    },
                  }
                );

                if (savedCart)
                  return res
                    .status(201)
                    .json({ success: true, message: "Item updated To Cart" });
                else
                  return res
                    .json({ success: false, dialog: false, message: "Error Saving To Cart" });
              }
            }
            if (user.restaurantItems[i]._id == req.params.id) {
              const data = {
                _id: req.params.id,
                rid: user._id,
                restaurantName: user.restaurantAddress.restaurantName,
                restaurantImage: user.profileImage,
                count: 1,
                itemName: user.restaurantItems[i].itemName,
                itemPrice: user.restaurantItems[i].itemPrice,
                itemImage: user.restaurantItems[i].itemImage,
              };

              const savedCart = await model.findByIdAndUpdate(req.user._id, {
                $push: { cart: data },
              });
              if (savedCart)
                return res
                  .status(201)
                  .json({ success: true, message: "Item added To Cart" });
              else
                return res
                  .json({ success: false, dialog: false, message: "Error Saving To Cart" });
            }
          }
          else {
            return res
              .json({
                success: false,
                dialog: true,
                message: `Your cart contains dishes from "${req.user.cart[0].restaurantName}". Do you want to discard the selection and add dishes from "${user.restaurantAddress.restaurantName}"?`,
                uid: req.params.uid,
                id: req.params.id,
              });
          }
        }
      }
    }
    while (req.params.sign == "sub") {
      var countValid = 0;
      if (req.user.cart[0] == undefined) {
        return res
          .status(201)
          .json({ success: true, message: "No Items in Cart" });
      }
      if (req.user.cart[0].restaurantName == user.restaurantAddress.restaurantName) {


        for (const j in req.user.cart) {
          if (req.user.cart[j]._id == req.params.id) {
            countValid = 1;
          }
        }

        if (countValid == 0) {
          return res
            .status(201)
            .json({ success: false, message: "No Item in Cart" });
        }

        for (const i in user.restaurantItems) {
          if (req.user.cart[0] == undefined) {
            return res
              .status(201)
              .json({ success: true, message: "No Items in Cart" });
          }

          if (user.restaurantItems[i]._id == req.params.id) {


            for (const j in req.user.cart) {

              if (req.user.cart[j]._id == req.params.id && req.user.cart[j].count == 1) {
                const deletedData = await model.findByIdAndUpdate(req.user._id, {
                  $pull: { cart: { _id: req.params.id } },
                });
                if (deletedData)
                  return res
                    .status(201)
                    .json({ success: true, message: "Item Deleted From Cart" });
                else
                  return res
                    .json({ success: false, message: "Error Deleting From Cart" });
              }
              if (req.user.cart[j]._id == req.params.id && req.user.cart[j].count > 1) {

                const savedCart = await model.updateOne(
                  { "cart._id": req.params.id },
                  {
                    $set: {
                      "cart.$.count": req.user.cart[j].count - 1
                    },
                  }
                );

                if (savedCart)
                  return res
                    .status(201)
                    .json({ success: true, message: "Item updated To Cart" });
                else
                  return res
                    .json({ success: false, message: "Error Saving To Cart" });
              }

            }
          }

        }
      } else {
        return res
          .status(201)
          .json({ success: true, message: "No Item in Cart" });
      }
    }

    // for (const i in req.user.cart) {
    //   if (req.user.cart[i]._id == req.params.id) {
    //     const cartData = await model.updateOne(
    //       { "cart._id": req.params.id },
    //       {
    //         $set: {
    //           "cart.$.count": req.params.count,
    //         },
    //       }
    //     );
    //     if (cartData)
    //       return res
    //         .status(201)
    //         .json({ success: true, message: "Item updated To Cart" });
    //     else
    //       return res
    //         .json({ success: false, message: "Error Updating To Cart" });
    //   }
    // }
    // const user = await RestaurantModel.findById(req.params.uid);
    // while (req.params.count == 1) {
    //   for (const i in user.restaurantItems) {
    //     if (req.user.cart[0] == undefined) {
    //       if (user.restaurantItems[i]._id == req.params.id) {
    //         const data = {
    //           _id: req.params.id,
    //           restaurantName: user.restaurantAddress.restaurantName,
    //           restaurantImage: user.profileImage,
    //           count: req.params.count,
    //           itemName: user.restaurantItems[i].itemName,
    //           itemPrice: user.restaurantItems[i].itemPrice,
    //         };

    //         const savedCart = await model.findByIdAndUpdate(req.user._id, {
    //           $push: { cart: data },
    //         });
    //         if (savedCart)
    //           return res
    //             .status(201)
    //             .json({ success: true, message: "Item added To Cart" });
    //         else
    //           return res
    //             .json({ success: false, message: "Error Saving To Cart" });
    //       } 
    //       // else
    //       //   return res
    //       //     .json({
    //       //       success: false,
    //       //       message: "Cannot find the Item in the List",
    //       //     });
    //     } else {
    //       if (
    //         req.user.cart[0].restaurantName ==
    //         user.restaurantAddress.restaurantName
    //       ) {
    //         if (user.restaurantItems[i]._id == req.params.id) {
    //           const data = {
    //             _id: req.params.id,
    //             restaurantName: user.restaurantAddress.restaurantName,
    //             restaurantImage: user.profileImage,
    //             count: req.params.count,
    //             itemName: user.restaurantItems[i].itemName,
    //             itemPrice: user.restaurantItems[i].itemPrice,
    //           };

    //           const savedCart = await model.findByIdAndUpdate(req.user._id, {
    //             $push: { cart: data },
    //           });
    //           if (savedCart)
    //             return res
    //               .status(201)
    //               .json({ success: true, message: "Item added To Cart" });
    //           else
    //             return res
    //               .json({ success: false, message: "Error Saving To Cart" });
    //         } 
    //         // else
    //         //   return res
    //         //     .json({
    //         //       success: false,
    //         //       message: "Cannot find the Item in the List",
    //         //     });
    //       } else {
    //         return res
    //           .json({
    //             success: false,
    //             message: `Your cart contains dishes from ${req.user.cart[0].restaurantName}. Do you want to discard the selection and add dishes from ${user.restaurantAddress.restaurantName}?`,
    //           });
    //       }
    //     }
    //   }
    // }

    // while (req.params.count == 0) {
    //   const deletedData = await model.findByIdAndUpdate(req.user._id, {
    //     $pull: { cart: { _id: req.params.id } },
    //   });
    //   if (deletedData)
    //     return res
    //       .status(201)
    //       .json({ success: true, message: "Item Deleted From Cart" });
    //   else
    //     return res
    //       .json({ success: false, message: "Error Deleting From Cart" });
    // }

    // for (const i in req.user.cart) {
    //   if (req.user.cart[i]._id == req.params.id) {
    //     const cartData = await model.updateOne(
    //       { "cart._id": req.params.id },
    //       {
    //         $set: {
    //           "cart.$.count": req.params.count,
    //         },
    //       }
    //     );
    //     if (cartData)
    //       return res
    //         .status(201)
    //         .json({ success: true, message: "Item updated To Cart" });
    //     else
    //       return res
    //         .json({ success: false, message: "Error Updating To Cart" });
    //   }
    // }
  } catch (err) {
    return res.json({ success: false, message: "Error: " + err });
  }
};

exports.getCart = async (req, res) => {


  try {
    const data = req.user.cart;

    if (data) {
      return res
        .status(201)
        .json({ success: true, message: data });
    }
    if (!data || data === undefined) {
      return res
        .json({ success: false, message: "No Item Found" });
    }
  } catch (err) {
    return res.json({ success: false, message: "Error: " + err });
  }
};

exports.deleteCartAndupdate = async (req, res) => {
  const model = Model(req.user.type);

  const user = await RestaurantModel.findById(req.params.uid);
  try {
    await model.findByIdAndUpdate(req.user._id, {
      $set: { cart: [] },
    });
    for (const i in user.restaurantItems) {
      if (user.restaurantItems[i]._id == req.params.id) {
        const data = {
          _id: req.params.id,
          rid: user._id,
          restaurantName: user.restaurantAddress.restaurantName,
          restaurantImage: user.profileImage,
          count: 1,
          itemName: user.restaurantItems[i].itemName,
          itemPrice: user.restaurantItems[i].itemPrice,
          itemImage: user.restaurantItems[i].itemImage,
        };

        const savedCart = await model.findByIdAndUpdate(req.user._id, {
          $push: { cart: data },
        });
        if (savedCart)
          return res
            .status(201)
            .json({ success: true, message: "Item added To Cart" });
        else
          return res
            .json({ success: false, message: "Error Saving To Cart" });
      }
    }
  } catch (err) {
    return res.json({ success: false, message: "Error: " + err });
  }
};

exports.orderedHistory = async (req, res) => {
  const model = Model(req.user.type);
  const cart = req.user.cart;
  const restUser = await RestaurantModel.findById(req.user.cart[0].rid);
  const restLocation = restUser.location[restUser.location.length - 1];
  const userLocation = req.user.location[req.user.location.length - 1];
  const delUser = await DeliveryModel.findById(req.params.did);
  const delLocation = delUser.location[delUser.location.length - 1];

  try {
    const TransactionID = new Date().valueOf();


    const cartValues = [
      {
        TransID: TransactionID,
        completed: false,
        status: "inprogress",
        uid: req.user._id,
        did: req.params.did,
        rid: req.user.cart[0].rid,
        dname: delUser.name,
        delPhone: delUser.addresses[delUser.addresses.length - 1].phone,
        rname: restUser.restaurantAddress.restaurantName,
        restOwnerName: restUser.name,
        restPhone: restUser.restaurantAddress.phone,
        items: cart
      }
    ];
    const details = [
      {
        TransID: TransactionID,
        completed: false,
        status: "inprogress",
        uid: req.user._id,
        did: req.params.did,
        rid: req.user.cart[0].rid,
        uname: req.user.name,
        userPhone: req.user.addresses[req.user.addresses.length - 1].phone,
        dname: delUser.name,
        delPhone: delUser.addresses[delUser.addresses.length - 1].phone,
        total: req.body.total,
        items: cart,
      }
    ];
    const delDetails = [
      {
        TransID: TransactionID,
        completed: false,
        status: "inprogress",
        uid: req.user._id,
        did: req.params.did,
        rid: req.user.cart[0].rid,
        rname: restUser.restaurantAddress.restaurantName,
        restPhone: restUser.restaurantAddress.phone,
        restOwnerName: restUser.name,
        uname: req.user.name,
        userPhone: req.user.addresses[req.user.addresses.length - 1].phone,
        total: req.body.total,
        items: cart,
      }
    ];


    await model.findById(req.user._id)
      .then(async (response) => {
        response.orderLocations.uid = req.user._id,
          response.orderLocations.did = req.params.did,
          response.orderLocations.delLocation.latitude = req.body.allLocations[0][1],
          response.orderLocations.delLocation.longitude = req.body.allLocations[0][0],
          response.orderLocations.restLocation.latitude = req.body.allLocations[1][0],
          response.orderLocations.restLocation.longitude = req.body.allLocations[1][1],
          response.orderLocations.userLocation.latitude = req.body.allLocations[2][0],
          response.orderLocations.userLocation.longitude = req.body.allLocations[2][1]
        await response.save();
      })

    await DeliveryModel.findById(req.params.did)
      .then(async (response) => {
        response.inProgress = true,
          response.orderLocations.uid = req.user._id,
          response.orderLocations.did = req.params.did,
          response.orderLocations.delLocation.latitude = req.body.allLocations[0][1],
          response.orderLocations.delLocation.longitude = req.body.allLocations[0][0],
          response.orderLocations.restLocation.latitude = req.body.allLocations[1][0],
          response.orderLocations.restLocation.longitude = req.body.allLocations[1][1],
          response.orderLocations.userLocation.latitude = req.body.allLocations[2][0],
          response.orderLocations.userLocation.longitude = req.body.allLocations[2][1]
        await response.save();
      })

    await RestaurantModel.findByIdAndUpdate(req.user.cart[0].rid, {
      $push: { orders: details },
    });
    await model.findByIdAndUpdate(req.user._id, {
      $push: { orders: cartValues },
    });
    await DeliveryModel.findByIdAndUpdate(req.params.did, {
      $push: { orders: delDetails },
    });
    const deletedCart = await model.findByIdAndUpdate(req.user._id, {
      $set: { cart: [] },
    });

    if (deletedCart)
      return res
        .status(201)
        .json({ success: true, message: "Order is Confirmed" });
    else
      return res
        .json({ success: false, message: "Error Ordering the Items" });
  } catch (err) {
    return res.json({ success: false, message: "Error: " + err });
  }
};
exports.locationCoords = async (req, res) => {
  const model = Model(req.user.type);

  const { error } = locationValidation(req.params);
  if (error)
    return res
      .json({ success: false, message: error.details[0].message });

  const locationCoords = {
    latitude: req.params.lat,
    longitude: req.params.lon
  }
  try {
    const savedData = await model.findByIdAndUpdate(req.user._id, {
      $push: { location: locationCoords },
    });
    if (savedData)
      return res.status(201).json({ success: true, message: "Location Saved" });

  } catch (err) {
    return res.json({ success: false, message: "Error: " + err });
  }

}
exports.getLocationCoords = async (req, res) => {
  const model = Model(req.user.type);

  try {

    const user = await model
      .findById(req.user._id)
      .where("location")
      .ne([]);

    if (user.location[user.location.length - 1])
      return res.status(201).json({ success: true, message: user.location[user.location.length - 1] });
    else
      return res.json({ success: false, message: "No Data Found" });

  } catch (err) {
    return res.json({ success: false, message: "Error: " + err });
  }

}

exports.getRestLocationCoords = async (req, res) => {

  try {

    const user = await RestaurantModel
      .findById(req.user.cart[0].rid)
      .where("location")
      .ne([]);

    if (user.location[user.location.length - 1])
      return res.status(201).json({ success: true, message: user.location[user.location.length - 1] });
    else
      return res.json({ success: false, message: "No Data Found" });

  } catch (err) {
    return res.json({ success: false, message: "Error: " + err });
  }

}

exports.getDelLocationCoords = async (req, res) => {
  const user = await DeliveryModel.find().where("inProgress")
    .ne(true);

  try {

    if (user) {
      return res.status(201).json({ success: true, message: user });
    } else
      return res.json({ success: false, message: "No Data Found" });

  } catch (err) {
    return res.json({ success: false, message: "Error: " + err });
  }

}

exports.getParticularDelLocationCoords = async (req, res) => {
  const user = await DeliveryModel.findById(req.params.id);

  try {

    if (user.location[user.location.length - 1]) {
      return res.status(201).json({ success: true, message: user.location[user.location.length - 1] });
    } else
      return res.json({ success: false, message: "No Data Found" });

  } catch (err) {
    return res.json({ success: false, message: "Error: " + err });
  }

}

exports.getUserLocationCoords = async (req, res) => {

  try {


    if (req.user.location[req.user.location.length - 1])
      return res.status(201).json({ success: true, message: req.user.location[req.user.location.length - 1] });
    else
      return res.json({ success: false, message: "No Data Found" });

  } catch (err) {
    return res.json({ success: false, message: "Error: " + err });
  }

};
exports.getOrders = async (req, res) => {
  // const model = Model(req.user.type);

  try {

    if (req.user.orders[req.user.orders.length - 1]) {
      return res
        .status(201)
        .json({ success: true, message: req.user.orders[req.user.orders.length - 1].completed });
    }
    else {
      return res
        .json({ success: false, message: "No Orders Found" });
    }
  } catch (err) {
    return res.json({ success: false, message: "Error: " + err });
  }
};

exports.getAllOrders = async (req, res) => {

  try {
    if (req.user.orders) {
      return res.status(201).json({ success: true, message: req.user.orders });
    }
    else {
      return res
        .json({ success: false, message: "No Orders Found" });
    }

  } catch (err) {
    return res.json({ success: false, message: "Error: " + err });
  }
};

exports.getParticularOrders = async (req, res) => {

  try {

    const data = req.user.orders.map((order) => {
      if (order._id.equals(req.params.id)) {
        return res
          .status(201)
          .json({ success: true, message: order });
      }
    })

    if (!data) {
      return res
        .json({ success: false, message: "No Orders Found" });
    }

  } catch (err) {
    return res.json({ success: false, message: "Error: " + err });
  }
};

exports.allLocations = async (req, res) => {

  const delUser = await DeliveryModel.findById(req.user.orderLocations.did);
  const delLocation = delUser.location[delUser.location.length - 1];
  try {
    if (req.user.orderLocations) {

      const data = [
        [delLocation.latitude, delLocation.longitude],
        [req.user.orderLocations.restLocation.latitude, req.user.orderLocations.restLocation.longitude],
        [req.user.orderLocations.userLocation.latitude, req.user.orderLocations.userLocation.longitude],
      ];

      return res
        .status(201)
        .json({ success: true, message: data });
    }
    else {
      return res
        .json({ success: false, message: "No Orders Found" });
    }
  }
  catch (err) {
    return res.json({ success: false, message: "Error: " + err });
  }
};

exports.changeOrderStatus = async (req, res) => {
  const model = Model(req.user.type);
  try {
    await model.findById(req.user._id).then(async (response) => {
      response.orders.map(async (order) => {

        if (order._id == req.params.id) {
          order.completed = true,
            order.status = "success"

          await response.save();
          return res.status(201).json({ success: true, message: "Order Delivered Successfully" })
        }
      })
    })
  }
  catch (err) {
    return res.json({ success: false, message: "Error: " + err });
  }
}
exports.cancelOrder = async (req, res) => {


  req.user.orders.map((order) => {

    if (order.TransID == req.params.id) {

      did = order.did;
      uid = order.uid;
      rid = order.rid;

    }
  })

  try {
    await DeliveryModel.findById(did).then(async (response) => {
      response.orders.map(async (order) => {
        if (order.completed == false) {
          order.completed = true,
            order.status = "cancelled"
        }
      })
      response.inProgress = false

      await response.save();
    })
    await UserModel.findById(uid).then(async (response) => {
      response.orders.map(async (order) => {
        if (order.completed == false) {
          order.completed = true,
            order.status = "cancelled"
        }
      })
      await response.save();
    })

    await RestaurantModel.findById(rid).then(async (response) => {
      response.orders.map(async (order) => {

        if (order.TransID == req.params.id) {

          order.completed = true,
            order.status = "cancelled"

          await response.save();
          return res.status(201).json({ success: true, message: "Order Cancelled" })
        }
      })
    })
  }
  catch (err) {
    return res.json({ success: false, message: "Error: " + err });
  }
}

exports.finalDelivery = async (req, res) => {
  req.user.orders.map((order) => {

    if (order.TransID == req.params.id) {

      did = order.did;
      uid = order.uid;
      rid = order.rid;

    }
  })

  try {
    await DeliveryModel.findById(did).then(async (response) => {
      response.orders.map(async (order) => {
        if (order.completed == false) {
          order.completed = true,
            order.status = "success"
        }
      })
      response.inProgress = false

      await response.save();
    })
    await UserModel.findById(uid).then(async (response) => {
      response.orders.map(async (order) => {
        if (order.completed == false) {
          order.completed = true,
            order.status = "success"
        }
      })
      await response.save();
      return res.status(201).json({ success: true, message: "Order Delivered Successfully" })
    })

  }

  catch (err) {
    return res.json({ success: false, message: "Error: " + err });
  }
}