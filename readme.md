# 🛍️ ShopZ API Documentation

> **Base URL:**  
> `https://shopz-back-end.onrender.com/api/v1`

---

## 📚 Endpoints

---

### 👤 User

| Action          | Method | Endpoint                | Payload                                            |
| --------------- | ------ | ----------------------- | -------------------------------------------------- |
| Register        | POST   | `/user/register`        | `{ fname, lname, email, password, address, role }` |
| Login           | POST   | `/user/login`           | `{ email, password }`                              |
| Forget Password | POST   | `/user/forget-password` | `{ email }`                                        |
| Reset Password  | POST   | `/user/reset-password`  | `{ email, otp, newPassword }`                      |
| Change Password | POST   | `/user/change-password` | `{ email, newPassword }`                           |

---

### 🛒 Products

| Action             | Method | Endpoint           | Payload                                                                              |
| ------------------ | ------ | ------------------ | ------------------------------------------------------------------------------------ | ------------------------ |
| Get All Products   | GET    | `/products/list`   | `—`                                                                                  |
| Get Single Product | GET    | `/products/:id`    | `—`                                                                                  |
| Create Product     | POST   | `/products/create` | `{ title, description, price, discount, stock, brand, category, thumbnail, images }` |
| Remove Product     | POST   | `/products/remove` | `{ _id }`                                                                            | \*`_id` is the productId |

---

### 🛍️ Cart

| Action           | Method | Endpoint       | Payload              |
| ---------------- | ------ | -------------- | -------------------- |
| Add to Cart      | POST   | `/cart/add`    | `{ productId, qty }` |
| Remove from Cart | POST   | `/cart/remove` | `{ productId, qty }` |
| Get Cart Items   | GET    | `/cart/`       | `—`                  |

---

### 🛍️ Wishlist

| Action               | Method | Endpoint           | Payload              |
| -------------------- | ------ | ------------------ | -------------------- |
| Add to Wishlist      | POST   | `/wishlist/add`    | `{ productId, qty }` |
| Remove from Wishlist | POST   | `/wishlist/remove` | `{ productId, qty }` |
| Get Wishlist Items   | GET    | `/wishlist/`       | `—`                  |

---

### 🎟️ Cupon

| Action          | Method | Endpoint        | Payload                                                                             |
| --------------- | ------ | --------------- | ----------------------------------------------------------------------------------- |
| Create Coupon   | POST   | `/cupon/create` | `{ code, discountPercentage, maxDixcountValue, minOrderValue, startDate, endDate }` |
| Get All Coupons | GET    | `/cupon/list`   | `—`                                                                                 |

---

### 🔐 Auth

| Action          | Method | Endpoint             | Payload |
| --------------- | ------ | -------------------- | ------- |
| Stateless Login | GET    | `/auth/bypass/login` | `—`     |

---

### 📦 Order

| Action         | Method | Endpoint        | Payload                             |
| -------------- | ------ | --------------- | ----------------------------------- | ---------------------------- |
| Create Order   | POST   | `/order/create` | `{ cupon (optional), mode: "ONLINE" | "COD", address (optional) }` |
| Get All Orders | GET    | `/order/list`   | `—`                                 |
| Remove Order   | POST   | `/order/remove` | `{ productId, qty }`                |

---

## ✅ Example Use Cases

> Replace `baseURL` with:  
> `https://shopz-back-end.onrender.com/api/v1`

---

### Examples

```js
// 👤 User APIs

// Register
const userData = {
  firstName: "Partha",
  lastName: "Bhowmik",
  email: "partha@gmail.com",
  mobNo: "9890234598",
  password: "123456",
  address: {
    addressLine1: "123 Main Street",
    addressLine2: "Near City Mall",
    landmark: "Opposite Central Park",
    city: "Kolkata",
    state: "West Bengal",
    pincode: "700001",
  },
};
axios.post(`${baseURL}/user/register`, userData);

// RESPONSE =>
  {
    "succes": true,
    "message": "Registration successfull",
    "user": {
        "firstName": "Partha",
        "lastName": "Bhowmik",
        "email": "partha@gmail.com",
        "mobNo": "9890234598",
        "password": "123456",
        "address": {
            "addressLine1": "123 Main Street",
            "addressLine2": "Near City Mall",
            "landmark": "Opposite Central Park",
            "city": "Kolkata",
            "state": "West Bengal",
            "pincode": "700001"
        }
    },
    "from": "register API"
}

// Login
axios.post(`${baseURL}/user/login`, {
  email: "kankana@gmail.com",
  password: "123456",
});

// RESPONSE =>
  {
    "success": true,
    "message": "Login successful",
    "user": {
        "_id": "685ec5277f14fa9953274d54",
        "firstName": "Partha",
        "email": "partha@gmail.com",
        "role": "CUSTOMER",
        "address": {
            "addressLine1": "123 Main Street",
            "addressLine2": "Near City Mall",
            "landmark": "Opposite Central Park",
            "city": "Kolkata",
            "state": "West Bengal",
            "pincode": "700001"
        }
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODVlYzUyNzdmMTRmYTk5NTMyNzRkNTQiLCJmaXJzdE5hbWUiOiJQYXJ0aGEiLCJlbWFpbCI6InBhcnRoYUBnbWFpbC5jb20iLCJyb2xlIjoiQ1VTVE9NRVIiLCJhZGRyZXNzIjp7ImFkZHJlc3NMaW5lMSI6IjEyMyBNYWluIFN0cmVldCIsImFkZHJlc3NMaW5lMiI6Ik5lYXIgQ2l0eSBNYWxsIiwibGFuZG1hcmsiOiJPcHBvc2l0ZSBDZW50cmFsIFBhcmsiLCJjaXR5IjoiS29sa2F0YSIsInN0YXRlIjoiV2VzdCBCZW5nYWwiLCJwaW5jb2RlIjoiNzAwMDAxIn0sImlhdCI6MTc1MTA0MTUxOSwiZXhwIjoxNzUxMTI3OTE5fQ.BO7iFOHdVdavF_vjEQiS72tyji6Qvbvsz2jbU7MuH0M"
}

// Stateless Login
axios.get(`${baseURL}/auth/bypass/login`,{headers: {authorization: `Bearer ${token}`}});

  // RESPONSE =>
    {
    "success": true,
    "message": "Bypassed login via state",
    "user": {
        "_id": "685ec5277f14fa9953274d54",
        "firstName": "Partha",
        "email": "partha@gmail.com",
        "role": "CUSTOMER",
        "address": {
            "addressLine1": "123 Main Street",
            "addressLine2": "Near City Mall",
            "landmark": "Opposite Central Park",
            "city": "Kolkata",
            "state": "West Bengal",
            "pincode": "700001"
        },
        "iat": 1751041519,
        "exp": 1751127919
    }
}

// Forgot Password
axios.post(`${baseURL}/user/forget-password`, {
  email: "kankana@gmail.com",
});

// RESPONSE =>
  {
    "succes": true,
    "message": "Password reset OTP sent on registered email",
    "otp": 5258,
    "otpExpiry": "5 minutes"
}

// Reset Password
axios.post(`${baseURL}/user/reset-password`, {
  email: "kankana@gmail.com",
  otp: "1234",
  newPassword: "newsecurepass",
});

// RESPONSE =>
  {
    "succes": true,
    "message": "Successfully reseted password"
}

// Change Password
axios.post(`${baseURL}/user/change-password`, {
  email: "kankana@gmail.com",
  newPassword: "updatedpass123",
});

// RESPONSE =>
  {
    "success": true,
    "message": "Password changed successfully"
}

```

---

### 🛍️ Product APIs

```js
// Get Product list
axios.get(`${baseURL}/products/list/?minPrice=100&pageNo=1&pageSize=5`)

// RESPONSE =>
  {
    "success": true,
    "message": "Products fetched successfully",
    "products": [
        {
            "_id": "68514e68b3675279334921a4",
            "title": "Samsung Galaxy Book",
            "description": "Samsung Galaxy Book S (2020) Laptop With Intel Lakefield Chip, 8GB of RAM Launched",
            "price": 1499,
            "discountPercentage": 4.15,
            "rating": 4.25,
            "stock": 34,
            "brand": "Samsung",
            "category": "laptops",
            "thumbnail": "https://placehold.co/720x600",
            "images": [
                "https://i.dummyjson.com/data/products/7/1.jpg",
                "https://i.dummyjson.com/data/products/7/2.jpg",
                "https://i.dummyjson.com/data/products/7/3.jpg",
                "https://i.dummyjson.com/data/products/7/thumbnail.jpg"
            ],
            "updatedAt": "2025-06-25T17:44:34.740Z"
        },
        {
            "_id": "68514e68b3675279334921a6",
            "title": "Infinix INBOOK",
            "description": "Infinix Inbook X1 Ci3 10th 8GB 256GB 14 Win10 Grey – 1 Year Warranty",
            "price": 1099,
            "discountPercentage": 11.83,
            "rating": 4.54,
            "stock": 88,
            "brand": "Infinix",
            "category": "laptops",
            "thumbnail": "https://placehold.co/720x600",
            "images": [
                "https://i.dummyjson.com/data/products/9/1.jpg",
                "https://i.dummyjson.com/data/products/9/2.png",
                "https://i.dummyjson.com/data/products/9/3.png",
                "https://i.dummyjson.com/data/products/9/4.jpg",
                "https://i.dummyjson.com/data/products/9/thumbnail.jpg"
            ],
            "updatedAt": "2025-06-25T17:44:35.038Z"
        },
        {
            "_id": "68514e68b3675279334921a0",
            "title": "Samsung Universe 9",
            "description": "Samsung's new variant which goes beyond Galaxy to the Universe",
            "price": 1249,
            "discountPercentage": 15.46,
            "rating": 4.09,
            "stock": 36,
            "brand": "Samsung",
            "category": "smartphones",
            "thumbnail": "https://placehold.co/720x600",
            "images": [
                "https://i.dummyjson.com/data/products/3/1.jpg"
            ]
        },
        {
            "_id": "68514e68b36752793349219e",
            "title": "iPhone 9",
            "description": "An apple mobile which is nothing like apple",
            "price": 549,
            "discountPercentage": 12.96,
            "rating": 4.69,
            "stock": 94,
            "brand": "Apple",
            "category": "smartphones",
            "thumbnail": "https://placehold.co/720x600",
            "images": [
                "https://i.dummyjson.com/data/products/1/1.jpg",
                "https://i.dummyjson.com/data/products/1/2.jpg",
                "https://i.dummyjson.com/data/products/1/3.jpg",
                "https://i.dummyjson.com/data/products/1/4.jpg",
                "https://i.dummyjson.com/data/products/1/thumbnail.jpg"
            ]
        },
        {
            "_id": "68514e68b3675279334921a5",
            "title": "Microsoft Surface Laptop 4",
            "description": "Style and speed. Stand out on HD video calls backed by Studio Mics. Capture ideas on the vibrant touchscreen.",
            "price": 1499,
            "discountPercentage": 10.23,
            "rating": 4.43,
            "stock": 68,
            "brand": "Microsoft Surface",
            "category": "laptops",
            "thumbnail": "https://placehold.co/720x600",
            "images": [
                "https://i.dummyjson.com/data/products/8/1.jpg",
                "https://i.dummyjson.com/data/products/8/2.jpg",
                "https://i.dummyjson.com/data/products/8/3.jpg",
                "https://i.dummyjson.com/data/products/8/4.jpg",
                "https://i.dummyjson.com/data/products/8/thumbnail.jpg"
            ]
        }
    ],
    "totalProductCount": 12 // for pagination (total number of products for this searh result)
}

// Create Product
const product =  {
      "title": "my product",
      "description": "A dummy product",
      "price": 549,
      "discountPercentage": 12.00,
      "rating": 2.29,
      "stock": 14,
      "brand": "dummy brand",
      "category": "dummy",
      "thumbnail": "https://i.dummyjson.com/data/products/1/thumbnail.jpg",
      "images": [
        "https://i.dummyjson.com/data/products/1/1.jpg",
        "https://i.dummyjson.com/data/products/1/2.jpg",
        "https://i.dummyjson.com/data/products/1/3.jpg",
        "https://i.dummyjson.com/data/products/1/4.jpg",
        "https://i.dummyjson.com/data/products/1/thumbnail.jpg"
      ]
    }

axios.post(`${baseURL}/products/create`,product)

// RESPONSE => 
  {
    "success": true,
    "message": "Product created successfully with id 685ec9c77f14fa9953274d5d",
    "product": {
        "title": "my product",
        "description": "A dummy product",
        "price": 549,
        "discountPercentage": 12,
        "rating": 2.29,
        "stock": 14,
        "brand": "dummy brand",
        "category": "dummy",
        "thumbnail": "https://i.dummyjson.com/data/products/1/thumbnail.jpg",
        "images": [
            "https://i.dummyjson.com/data/products/1/1.jpg",
            "https://i.dummyjson.com/data/products/1/2.jpg",
            "https://i.dummyjson.com/data/products/1/3.jpg",
            "https://i.dummyjson.com/data/products/1/4.jpg",
            "https://i.dummyjson.com/data/products/1/thumbnail.jpg"
        ],
        "_id": "685ec9c77f14fa9953274d5d",
        "createdAt": "2025-06-27T16:41:43.610Z",
        "updatedAt": "2025-06-27T16:41:43.610Z",
        "__v": 0
    }
}

// Get a single product
const productId = "68514e68b36752793349219e"
axios.get(`${baseURL}/products/${productId}`)

// RESPONSE =>
  {
    "success": true,
    "message": "Product created successfully with id: 68514e68b36752793349219e",
    "product": {
        "_id": "68514e68b36752793349219e",
        "title": "iPhone 9",
        "description": "An apple mobile which is nothing like apple",
        "price": 549,
        "discountPercentage": 12.96,
        "rating": 4.69,
        "stock": 94,
        "brand": "Apple",
        "category": "smartphones",
        "thumbnail": "https://placehold.co/720x600",
        "images": [
            "https://i.dummyjson.com/data/products/1/1.jpg",
            "https://i.dummyjson.com/data/products/1/2.jpg",
            "https://i.dummyjson.com/data/products/1/3.jpg",
            "https://i.dummyjson.com/data/products/1/4.jpg",
            "https://i.dummyjson.com/data/products/1/thumbnail.jpg"
        ]
    }
}

// Remove product
axios.post(`${baseURL}/products/remove`, {_id: "6851a583113499789e1b7a24"})

// RESPONSE => 
  {
    "success": true,
    "message": "Product deleted with id: 685ec9c77f14fa9953274d5d",
    "deletedProduct": {
        "_id": "685ec9c77f14fa9953274d5d",
        "title": "my product",
        "description": "A dummy product",
        "price": 549,
        "discountPercentage": 12,
        "rating": 2.29,
        "stock": 14,
        "brand": "dummy brand",
        "category": "dummy",
        "thumbnail": "https://i.dummyjson.com/data/products/1/thumbnail.jpg",
        "images": [
            "https://i.dummyjson.com/data/products/1/1.jpg",
            "https://i.dummyjson.com/data/products/1/2.jpg",
            "https://i.dummyjson.com/data/products/1/3.jpg",
            "https://i.dummyjson.com/data/products/1/4.jpg",
            "https://i.dummyjson.com/data/products/1/thumbnail.jpg"
        ],
        "createdAt": "2025-06-27T16:41:43.610Z",
        "updatedAt": "2025-06-27T16:41:43.610Z",
        "__v": 0
    }
} 

```

---

### 🛍️ Cart APIs

```js
// Add to Cart
axios.post(`${baseURL}/cart/add`, {
  productId: "PRODUCT_ID_HERE",
  qty: 4
});

// RESPONSE => 
  {
    "success": true,
    "message": "Item added to cart successfully",
    "product": {
        "productId": {
            "_id": "68514e68b3675279334921b5",
            "title": "cereals muesli fruit nuts",
            "description": "original fauji cereal muesli 250gm box pack original fauji cereals muesli fruit nuts flakes breakfast cereal break fast faujicereals cerels cerel foji fouji",
            "price": 46,
            "discountPercentage": 16.8,
            "rating": 4.94,
            "stock": 97,
            "brand": "fauji",
            "category": "groceries",
            "thumbnail": "https://placehold.co/720x600",
            "images": [
                "https://i.dummyjson.com/data/products/24/1.jpg",
                "https://i.dummyjson.com/data/products/24/2.jpg",
                "https://i.dummyjson.com/data/products/24/3.jpg",
                "https://i.dummyjson.com/data/products/24/4.jpg",
                "https://i.dummyjson.com/data/products/24/thumbnail.jpg"
            ],
            "updatedAt": "2025-06-25T17:44:34.867Z"
        },
        "qty": 4,
        "_id": "685ecbd07f14fa9953274d65"
    }
}

// Remove from Cart
axios.post(`${baseURL}/cart/remove`, {
  productId: "PRODUCT_ID_HERE",
  qty: 1
});

// RESPONSE =>
  {
    "success": true,
    "message": "Cart item removed successfully",
  }


// Get Cart Items
axios.get(`${baseURL}/cart/`);

  // RESPONSE =>
  {
    "success": true,
    "message": "Cart items got",
    "products": {
        "_id": "685ecbd07f14fa9953274d64",
        "userId": "685ec5277f14fa9953274d54",
        "products": [
            {
                "productId": {
                    "_id": "68514e68b3675279334921b5",
                    "title": "cereals muesli fruit nuts",
                    "description": "original fauji cereal muesli 250gm box pack original fauji cereals muesli fruit nuts flakes breakfast cereal break fast faujicereals cerels cerel foji fouji",
                    "price": 46,
                    "discountPercentage": 16.8,
                    "rating": 4.94,
                    "stock": 97,
                    "brand": "fauji",
                    "category": "groceries",
                    "thumbnail": "https://placehold.co/720x600",
                    "images": [
                        "https://i.dummyjson.com/data/products/24/1.jpg",
                        "https://i.dummyjson.com/data/products/24/2.jpg",
                        "https://i.dummyjson.com/data/products/24/3.jpg",
                        "https://i.dummyjson.com/data/products/24/4.jpg",
                        "https://i.dummyjson.com/data/products/24/thumbnail.jpg"
                    ],
                    "updatedAt": "2025-06-25T17:44:34.867Z"
                },
                "qty": 4,
                "_id": "685ecbd07f14fa9953274d65"
            }
        ],
        "createdAt": "2025-06-27T16:50:24.792Z",
        "updatedAt": "2025-06-27T16:50:24.792Z",
        "__v": 0
    }
}

```

---

### 🛍️ Wishlist APIs -> Responses are same as cart api

```js

// Add to Wishlist
axios.post(`${baseURL}/wishlist/add`, {
  productId: "PRODUCT_ID_HERE",
  qty: 1
});


// Remove from Wishlist
axios.post(`${baseURL}/wishlist/remove`, {
  productId: "PRODUCT_ID_HERE",
  qty: 1
});

// Get Wishlist Items
axios.get(`${baseURL}/wishlist/`);
```

---

### 🎟️ Cupon APIs

```js
// Create Cupon
axios.post(`${baseURL}/cupon/create`, {
    code: "SAVE10",
    discountPercentage: 10,
    maxDixcountValue: 400,
    startDate: "2025-06-27",
    endDate: "2025-06-30",
    minOrderValue: 4000
});

// RESPONSE =>
  {
    "success": true,
    "message": "Cupon created successfully",
    "cupon": {
        "code": "SAVE10",
        "discountPercentage": 10,
        "maxDixcountValue": 400,
        "startDate": "2025-06-27T00:00:00.000Z",
        "endDate": "2025-06-30T00:00:00.000Z",
        "minOrderValue": 4000,
        "_id": "685ed1947f14fa9953274d6f",
        "__v": 0
    }
}

// Get All Cupons
axios.get(`${baseURL}/cupon/list`);

// RESPONSE => 
  {
    "success": true,
    "result": [
        {
            "_id": "68582cd7c01e77d04b490e16",
            "code": "SAVE20",
            "discountPercentage": 20,
            "maxDixcountValue": 30,
            "startDate": "2025-06-22T00:00:00.000Z",
            "endDate": "2025-06-27T00:00:00.000Z",
            "minOrderValue": 100,
            "__v": 0
        },
        {
            "_id": "6858324d86548a8804d197b0",
            "code": "SAVE40",
            "discountPercentage": 40,
            "maxDixcountValue": 40,
            "startDate": "2025-06-22T00:00:00.000Z",
            "endDate": "2025-06-25T00:00:00.000Z",
            "minOrderValue": 100,
            "__v": 0
        },
        {
            "_id": "685ed1947f14fa9953274d6f",
            "code": "SAVE10",
            "discountPercentage": 10,
            "maxDixcountValue": 400,
            "startDate": "2025-06-27T00:00:00.000Z",
            "endDate": "2025-06-30T00:00:00.000Z",
            "minOrderValue": 4000,
            "__v": 0
        }
    ]
}


```

---

### 📦 Order APIs

```js
// Create Order
axios.post(`${baseURL}/order/create`, {
  cupon: "SAVE10",
  mode: "COD",
  address: {
    addressLine1: "123 Main Street",
    addressLine2: "Near City Mall",
    landmark: "Opposite Central Park",
    city: "Kolkata",
    state: "West Bengal",
    pincode: "700001"
  }
});

// RESPONSE => 
  {
  "success": true,
  "message": "From order palcement",
  "total": 1500,
  "finalTotal": 1200,
  "order": {
    "_id": "665f1234567890abcde12345",
    "userId": "664f9876543210abcdef5678",
    "products": [
      {
        "productId": "662f1122334455abcdef1234",
        "qty": 2
      }
    ],
    "cupon": "SAVE20",
    "modeOfPayment": "OFFLINE",
    "orderStatus": "PENDING",
    "address": "123 Street Name, City, Country",
    "__v": 0
  }
}

// FOR ONLINE  payment
  {
  "success": true,
  "message": "Redirect to payment gateway",
  "orderDetails": {
    "razorpayOrderId": "order_LzvK8xabc12345",
    "amount": 120000,
    "currency": "INR",
    "key": "YOUR_TEST_KEY_ID"
  }
}



// Remove Order
axios.post(`${baseURL}/order/remove`, {
  productId: "PRODUCT_ID_HERE",
  qty: 1
});

// RESPONSE =>
  {
  "success": true,
  "message": "order removed"
}


// Get Orders
axios.get(`${baseURL}/order/`);

// RESPONSE => 
  {
  "success": true,
  "orders": {
    "_id": "665f1234567890abcde12345",
    "userId": "664f9876543210abcdef5678",
    "products": [
      {
        "productId": {
          "_id": "662f1122334455abcdef1234",
          "title": "Sneakers",
          "price": 750,
          "stock": 100,
          "brand": "Nike"
        },
        "qty": 2
      }
    ],
    "cupon": "SAVE20",
    "modeOfPayment": "OFFLINE",
    "orderStatus": "PENDING",
    "address": "123 Street Name, City, Country",
    "__v": 0
  }
}

```
