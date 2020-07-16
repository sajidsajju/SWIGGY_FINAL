const mongoose = require("mongoose");
const crypto = require("crypto");

const deliverySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 4,
      max: 255,
    },
    email: {
      type: String,
      required: true,
      min: 10,
      max: 255,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 255,
    },
    type: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      required: false,
    },
    addresses: [
      {
        phone: {
          type: Number,
          required: false,
        },
        address: {
          type: String,
          required: false,
        },
        landmark: {
          type: String,
          required: false,
        },
      },
    ],
    resetPasswordToken: {
      type: String,
      required: false,
    },

    resetPasswordExpires: {
      type: Date,
      required: false,
    },
    location: [
      {
        latitude: {
          type: String,
          required: false,
        },
        longitude: {
          type: String,
          required: false,
        },
        date: {
          type: Date,
          default: Date.now
        }
      }
    ],
    inProgress: {
      type: Boolean,
      required: false,
    },
    orderLocations: {
      did: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
      },
      uid: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
      },
      delLocation: {
        latitude: {
          type: String,
          required: false,
        },
        longitude: {
          type: String,
          required: false,
        }
      },
      restLocation: {
        latitude: {
          type: String,
          required: false,
        },
        longitude: {
          type: String,
          required: false,
        }
      },
      userLocation: {
        latitude: {
          type: String,
          required: false,
        },
        longitude: {
          type: String,
          required: false,
        }
      },
    },
    orders: [
      {
        TransID: {
          type: Number,
          required: false,
        },
        completed: {
          type: Boolean,
          required: false,
        },
        status: {
          type: String,
          required: false,
        },
        uid: {
          type: mongoose.Schema.Types.ObjectId,
          required: false,
        },
        uname: {
          type: String,
          required: false,
        },
        rid: {
          type: mongoose.Schema.Types.ObjectId,
          required: false,
        },
        did: {
          type: mongoose.Schema.Types.ObjectId,
          required: false,
        },
        restOwnerName: {
          type: String,
          required: false,
        },
        rname: {
          type: String,
          required: false,
        },
        restPhone: {
          type: String,
          required: false,
        },
        userPhone: {
          type: String,
          required: false,
        },
        total: {
          type: String,
          required: false,
        },
        items: [
          {
            itemImage: {
              type: String,
              required: false,
            },
            itemName: {
              type: String,
              required: false,
            },
            count: {
              type: Number,
              required: false,
            },
            itemPrice: {
              type: String,
              required: false,
            },
          }
        ],
      },

    ],
  },
  { timestamps: true }
);

deliverySchema.methods.generatePasswordReset = function () {
  this.resetPasswordToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};

mongoose.set("useFindAndModify", false);

module.exports = mongoose.model("Delivery", deliverySchema);
