# 🛍️ ShopZ API Documentation

> **Base URL:**  
> `https://shopz-back-end.onrender.com/api/v1`

---

## 📚 Endpoints

---

### 👤 User

| Action              | Method | Endpoint                      |
|---------------------|--------|-------------------------------|
| Register            | POST   | `/user/register`              |
| Login               | POST   | `/user/login`                 |
| Forget Password     | POST   | `/user/forget-password`       |
| Reset Password      | POST   | `/user/reset-password`        |
| Change Password     | POST   | `/user/change-password`       |

---

### 🛒 Products

| Action              | Method | Endpoint                      |
|---------------------|--------|-------------------------------|
| Get All Products    | GET    | `/products/list`              |
| Get Single Product  | GET    | `/products/:id`               |
| Create Product      | POST   | `/products/create`            |
| Remove Product      | POST   | `/products/remove`            |

> **Note:** Use the product's `_id` as the `:id` parameter.

---

### 🛍️ Cart

| Action              | Method | Endpoint                      |
|---------------------|--------|-------------------------------|
| Add to Cart         | POST   | `/cart/add`                   |
| Remove from Cart    | POST   | `/cart/remove`                |
| Get Cart Items      | GET    | `/cart/`                      |

---

### 🎟️ Cupon

| Action              | Method | Endpoint                      |
|---------------------|--------|-------------------------------|
| Create Coupon       | POST   | `/cupon/create`               |
| Get All Coupons     | GET    | `/cupon/list`                 |

---

### 🔐 Auth

| Action              | Method | Endpoint                      |
|---------------------|--------|-------------------------------|
| Stateless Login     | GET    | `/auth/bypass/login`          |

---

### 📦 Order

| Action              | Method | Endpoint                      |
|---------------------|--------|-------------------------------|
| Create Order        | POST   | `/order/create`               |
| Get All Orders      | GET    | `/order/list`                 |
