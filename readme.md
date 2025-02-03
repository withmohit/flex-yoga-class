# 🧘 Zen Yoga Studio - Membership Registration

A full-stack web application for managing yoga class registrations and membership renewals.

## 🚀 Tech Stack

- **Frontend:** React.js
- **Backend:** FastAPI
- **Database:** SQLite (In-Memory)
- **Containerization:** Docker
- **Hosting:** Render

## 🌐 Live Links

- **Full Website:** [Link1](https://flex-yoga-class-1.onrender.com)
- **Web Service (API):** [Link2](https://flex-yoga-class.onrender.com)

## 📌 Features

- **New Member Registration**
- **Existing Member Validation & Renewal**
- **Batch Selection (Non-Modifiable for 30 Days)**
- **Membership Expiry & Renewal Handling**

## 📜 Assumptions

- 🗓 **Registration Validity:** Each registration is valid for **30 days (1 month).**
- 💰 **First-Time Registration Cost:** ₹250 (One-Time) + ₹500 (First 30 Days) = **₹750**
- 🔄 **Renewal Cost:** ₹500 for every **30-day renewal**.
- 🚫 **Batch Change Restriction:** Once registered, the **batch cannot be changed for 30 days.**

## 🛠 Setup & Installation

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/your-username/yoga-registration.git
cd yoga-registration
```

### 2️⃣ Run Backend (FastAPI + SQLite)

```sh
cd backend
docker build -t yoga-backend .
docker run -p 8000:8000 yoga-backend
```

### 3️⃣ Run Frontend (React.js)

```sh
cd frontend
npm install
npm start
```

### 4️⃣ Access the Application

- Frontend: `http://localhost:3000`
- API Docs (Swagger UI): `http://localhost:8000/docs`,`https://flex-yoga-class.onrender.com`

## 🏗 API Endpoints

| Method | Endpoint                       | Description                                   |
| ------ | ------------------------------ | --------------------------------------------- |
| `POST` | `/form/update`                 | Register a new member or update membership   |
| `GET`  | `/form/query?phone=1234567890` | Check member details & validity              |

## 📜 License

This project is licensed under the **MIT License**.

---

**🎯 Developed with ❤️ for Yoga Enthusiasts!**
