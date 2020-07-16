const express = require("express");
const router = express.Router();
const register = require("./register");
const auth = require("./auth");
const passport = require("passport");
const verify = passport.authenticate("jwt", { session: false });

router.post("/register", register.createUser);
router.post("/login", register.loginUser);

router.post("/recover", register.recover);
router.post("/reset/:type/:token", register.reset);

router.post(
  "/image",
  verify,
  register.upload.single("profileImage"),
  register.imageUpload
);
router.get("/image", verify, register.getImage);

router.get("/address", verify, register.getAddress);
router.post("/address", verify, register.addAddress);
router.delete("/address/:id", verify, register.deleteAddress);
router.put("/address/:id", verify, register.editAddress);

router.get("/deliveryAddress", verify, register.getDeliveryDetails);
router.get("/restaurantAddress", verify, register.getRestaurantDetails);
router.post("/restaurantAddress", verify, register.upload.single("profileImage"), register.restaurantDetails); // post and put in same route

router.get("/restaurant/:id", verify, auth.restaurant);
router.get("/restaurants", verify, auth.restaurants);
router.get("/restaurants/:id", verify, auth.getRestaurantItems);

router.post("/items", verify, auth.upload.single("itemImage"), auth.addItems);
router.get("/items", verify, auth.getItems);
router.get("/items/:uid/:id", verify, auth.getParticularRestaurantItems);
router.delete("/items/:id", verify, auth.deleteItems);
router.post(
  "/items/:id",
  verify,
  auth.upload.single("itemImage"),
  auth.editItems
);

router.post("/location/:lat/:lon", verify, auth.locationCoords);
router.get("/location", verify, auth.getLocationCoords);
router.get("/delLocation", verify, auth.getDelLocationCoords);
router.get("/delParticularLocation/:id", verify, auth.getParticularDelLocationCoords);
router.get("/restLocation", verify, auth.getRestLocationCoords);
router.get("/userLocation", verify, auth.getUserLocationCoords);
router.get("/allLocations", verify, auth.allLocations);

router.get("/cart/:uid/:id/:sign", verify, auth.addToCart);
router.get("/cart/:uid/:id", verify, auth.deleteCartAndupdate);
router.get("/cart/", verify, auth.getCart);

router.get("/finalDelivery/:id", verify, auth.finalDelivery);
router.get("/cancelOrder/:id", verify, auth.cancelOrder);
router.get("/changeOrderStatus/:id", verify, auth.changeOrderStatus);
router.get("/getOrders", verify, auth.getOrders);
router.get("/getAllOrders", verify, auth.getAllOrders);
router.get("/getParticularOrders/:id", verify, auth.getParticularOrders);
router.post("/orderedHistory/:did", verify, auth.orderedHistory);

router.get("/userDetails", verify, register.userDetails);
//----------------------------------------------------------------
router.post(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    res.send(req.user);
  }
);

module.exports = router;
