# My Diary Web App - Backend

This is the backend of the Diary Web App. It is built with Express.js and PostgreSQL to manage diary entries. The API allows you to perform CRUD operations (Create, Read, Update, Delete) on diary entries.

## 📦 Technologies

- **Node.js** (Express.js framework)
- **PostgreSQL** (Database)
- **Body-parser** (Parsing request bodies)
- **Cors** (Cross-origin resource sharing)
- **pg** (PostgreSQL client for Node.js)

## 🛠 Setup & Installation

### 1. Clone the repository

First, clone this repository to your local machine:

```bash
git clone https://github.com/iamrupambiswas/personal-diary-beckend.git
cd personal-diary-frontend
```

### 2. Install dependencies
Install all the required dependencies using npm:
```
npm install
```

### 3. Set up the Database
Make sure you have PostgreSQL installed and running on your machine. You need to create a database named diary and a table named entries with the following structure:
```sql
CREATE TABLE entries (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    content TEXT NOT NULL
);
```

### 4. Start the server
Run the server using the following command:
```
node index.js
```

## 👤 Author
Developed by **Rupam Biswas**.

For any queries or suggestions, feel free to reach out!

- [LinkedIn](https://www.linkedin.com/in/iamrupambiswas/)
- [Twitter](https://x.com/iam_rupambiswas)

---
