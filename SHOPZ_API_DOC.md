
# 🛍️ ShopZ API Documentation

> **Base URL:**  
> `https://shopz-back-end.onrender.com/api/v1`

---

## 📚 Endpoints

---

### 👤 User

| Action              | Method | Endpoint                | Payload |
|---------------------|--------|-------------------------|---------|
| Register            | POST   | `/user/register`        | `{ fname, lname, email, password, address, role }` |
| Login               | POST   | `/user/login`           | `{ email, password }` |
| Forget Password     | POST   | `/user/forget-password` | `{ email }` |
| Reset Password      | POST   | `/user/reset-password`  | `{ email, otp, newPassword }` |
| Change Password     | POST   | `/user/change-password` | `{ email, newPassword }` |

---

### 🛒 Products

| Action              | Method | Endpoint              | Payload |
|---------------------|--------|-----------------------|---------|
| Get All Products    | GET    | `/products/list`      | `—` |
| Get Single Product  | GET    | `/products/:id`       | `—` |
| Create Product      | POST   | `/products/create`    | `{ title, description, price, discount, stock, brand, category, thumbnail, images }` |
| Remove Product      | POST   | `/products/remove`    | `{ _id }` | *`_id` is the productId

---

### 🛍️ Cart

| Action              | Method | Endpoint         | Payload |
|---------------------|--------|------------------|---------|
| Add to Cart         | POST   | `/cart/add`      | `{ productId, qty }` |
| Remove from Cart    | POST   | `/cart/remove`   | `{ productId, qty }` |
| Get Cart Items      | GET    | `/cart/`         | `—` |

---

### 🛍️ Wishlist

| Action                  | Method | Endpoint            | Payload |
|-------------------------|--------|---------------------|---------|
| Add to Wishlist         | POST   | `/wishlist/add`     | `{ productId, qty }` |
| Remove from Wishlist    | POST   | `/wishlist/remove`  | `{ productId, qty }` |
| Get Wishlist Items      | GET    | `/wishlist/`        | `—` |

---

### 🎟️ Cupon

| Action              | Method | Endpoint         | Payload |
|---------------------|--------|------------------|---------|
| Create Coupon       | POST   | `/cupon/create`  | `{ code, discountPercentage, maxDixcountValue, minOrderValue, startDate, endDate }` |
| Get All Coupons     | GET    | `/cupon/list`    | `—` |

---

### 🔐 Auth

| Action              | Method | Endpoint                | Payload |
|---------------------|--------|--------------------------|---------|
| Stateless Login     | GET    | `/auth/bypass/login`     | `—` |

---

### 📦 Order

| Action              | Method | Endpoint            | Payload |
|---------------------|--------|---------------------|---------|
| Create Order        | POST   | `/order/create`     | `{ cupon (optional), mode: "ONLINE" | "COD", address (optional) }` |
| Get All Orders      | GET    | `/order/list`       | `—` |
| Remove Order        | POST   | `/order/remove`     | `{ productId, qty }` |

---

## ✅ Example Use Cases

> Replace `baseURL` with:  
> `https://shopz-back-end.onrender.com/api/v1`

---

### 👤 User APIs

```js
// Register
axios.post(`${baseURL}/user/register`, {
  fname: "Kankana",
  lname: "Das",
  email: "kankana@gmail.com",
  password: "123456",
  address: {
    addressLine1: "123 Main Street",
    addressLine2: "Near City Mall",
    landmark: "Opposite Central Park",
    city: "Kolkata",
    state: "West Bengal",
    pincode: "700001"
  },
  role: "buyer"
});

// Login
axios.post(`${baseURL}/user/login`, {
  email: "kankana@gmail.com",
  password: "123456"
});

// Stateless Login
axios.get(`${baseURL}/auth/bypass/login`);

// Forgot Password
axios.post(`${baseURL}/user/forget-password`, {
  email: "kankana@gmail.com"
});

// Reset Password
axios.post(`${baseURL}/user/reset-password`, {
  email: "kankana@gmail.com",
  otp: "1234",
  newPassword: "newsecurepass"
});

// Change Password
axios.post(`${baseURL}/user/change-password`, {
  email: "kankana@gmail.com",
  newPassword: "updatedpass123"
});
```

---

### 🛍️ Cart APIs

```js
// Add to Cart
axios.post(`${baseURL}/cart/add`, {
  productId: "PRODUCT_ID_HERE",
  qty: 2
});

// Remove from Cart
axios.post(`${baseURL}/cart/remove`, {
  productId: "PRODUCT_ID_HERE",
  qty: 1
});

// Get Cart Items
axios.get(`${baseURL}/cart/`);
```

---

### 🛍️ Wishlist APIs

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
  maxDixcountValue: 100,
  minOrderValue: 500,
  startDate: "2025-06-01",
  endDate: "2025-06-30"
});

// Get All Cupons
axios.get(`${baseURL}/cupon/list`);
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

// Remove Order
axios.post(`${baseURL}/order/remove`, {
  productId: "PRODUCT_ID_HERE",
  qty: 1
});

// Get Orders
axios.get(`${baseURL}/order/`);
```
