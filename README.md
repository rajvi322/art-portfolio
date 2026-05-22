
# 🎨 Art Portfolio

A full-stack portfolio and content management system built for artists. The public-facing side delivers a beautifully crafted gallery experience, while the backend gives artists full control over their work, inquiries, and audience — all from a single dashboard.

---

## 🛠️ Tech Stack

**Next.js 16** · **TypeScript** · **Tailwind CSS v4** · **MongoDB** · **Cloudinary** · **Framer Motion**

---

## ✨ Features

### 🖼️ Public Gallery
A responsive, Pinterest-style masonry gallery with a full-screen lightbox viewer and smooth Lenis-powered scrolling. Visitors can filter works by medium (Watercolors, Acrylics, Sketches, and more), browse an artist biography page, and send inquiries directly through a built-in contact form. Fully responsive and mobile-first across all breakpoints.

### 🔐 Admin Dashboard
A secure, JWT-authenticated panel where artists can add, edit, and delete artworks with ease. Images are uploaded via drag-and-drop or file picker and automatically optimised through Cloudinary. The standout feature: one-click AI metadata generation powered by the Hugging Face BLIP captioning model — producing artwork titles and descriptions independently, straight from the image itself.

### 📊 Analytics
Real-time audience insights without third-party tracking. The dashboard surfaces KPI cards (total views, unique visitors, time spent, interactions), a dual-line engagement chart comparing page views vs. unique visitors over time, and a ranked breakdown of top-performing artworks. Social media click-throughs are tracked, and a per-session activity log captures every page view, lightbox open, and inquiry — filterable by last 7 days, 30 days, or all time.

### 📬 Inquiry Management
All visitor inquiries land in a dedicated inbox inside the admin panel, keeping communication organised and easy to manage without relying on external email clients.

---

## 🚀 Deployment

The app is built on Next.js and deploys seamlessly to **Vercel**. Images are served via **Cloudinary's CDN**, and the database runs on **MongoDB Atlas** — making the full stack cloud-native and production-ready out of the box.

---

*🔒 Private & proprietary. All rights reserved.*

