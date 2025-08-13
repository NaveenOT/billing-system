# 🏪 Billing System Desktop App

A robust, Electron-based billing and inventory management desktop application, actively used in a retail shop in Chennai. Built with **Electron**, **Vite**, **React**, **SQLite**, **Chart.js**, and **jsPDF**, it offers a full-featured solution for billing, inventory, dashboard analytics, expense tracking, and more.
---
## 🚀 Key Features

- **Invoice & Billing**: Create detailed bills with GST calculations, line items, quick notes, storage of bills etc.
- **Product & Catalogue Management**: Add/edit/remove products(Quick Access with code, price, qunatity, procurement rate, etc...)  
- **Dashboard Analytics**: Profit, revenue, sales trends, and expense analytics via Chart.js.  
- **Expense Management**: Log shop expenses and track monthly spending.  
- **Invoice Export**: Generate and save printable invoices using jsPDF.  
- **Local Storage**: Powered by SQLite (`billing.db`) for reliable, offline-first data persistence.  
- **Modern UI**: Clean, responsive React interface with Vite—designed for desktop efficiency and ease of use.  
- **Cross-Platform Desktop Support**: Packaged via `electron-builder` for Windows/macOS/Linux.

---

## 📂 Project Structure

## ✅ Tech Stack

- **Electron** – Desktop framework  
- **Vite + React** – Fast frontend UI
- **Tailwind CSS** - Styling
- **SQLite** – Embedded lightweight database  
- **Chart.js** – Charts for sales and expense analytics  
- **jsPDF** – Client-side PDF generation  
- **electron-builder** – Packaging for distributions

## Installation
- Clone the Repository
- Install Dependencies: npm install
- npm run build 
- npm run electron:build

## 🛡️ Data & Configuration

All data is saved in billing.db, stored alongside the app.
To backup or migrate, simply copy this file.
Settings (GST %, printer config) are stored in local JSON config files.

## 👤 Author
- Naveen O.T
- Built and maintained for a live retail shop in Chennai.
