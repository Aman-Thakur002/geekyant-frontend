# 🚀 Engineering Resource Management – Frontend

A modern, responsive frontend built using **Vite**, **React**, **TypeScript**, **TailwindCSS**, and **Radix UI** to manage engineering resources across multiple projects. This app provides an intuitive interface for managers and engineers to collaborate effectively.

---

## 🌟 Features

### 👨‍💼 User Roles
- **Manager**: Assign engineers to projects, view resource allocations.
- **Engineer**: View current assignments and project details.

### 📅 Project Resource Management
- View current allocations.
- Assign and schedule engineers with capacity tracking.
- Manage multiple projects and engineer profiles.

### ⚙️ Tech Stack
- **React 18 + Vite** for fast development experience
- **TypeScript** for type-safe code
- **TailwindCSS** for custom, responsive design
- **Radix UI** for accessible, headless UI components
- **React Hook Form + Zod** for robust form handling and validation
- **Axios** for API calls
- **ShadCN UI** for UI primitives

---

## 📁 Project Structure (Simplified)

```
.
├── components/         # UI components (buttons, forms, etc.)
├── pages/             # Main pages (dashboard, login, etc.)
├── hooks/             # Custom React hooks
├── utils/             # Utility functions
├── types/             # TypeScript type definitions
├── public/            # Static assets
├── .env.example       # Example env file
├── tailwind.config.ts
├── vite.config.ts
└── package.json
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repo

```bash
git clone https://github.com/yourusername/engineering-resource-management-frontend.git
cd engineering-resource-management-frontend
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Create a .env File

```bash
cp .env.example .env
```

Update `VITE_API_URL` in `.env` to your backend URL:

```env
VITE_API_URL=http://localhost:3000/api
```

### 4️⃣ Run Development Server

```bash
npm run dev
```

Your app should now be running on http://localhost:5173.

---

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Runs the development server |
| `npm run build` | Builds the project for production |
| `npm run preview` | Previews the production build locally |
| `npm run check` | TypeScript type checking |

---

## 📌 Environment Variables

| Key | Description |
|-----|-------------|
| `VITE_API_URL` | Base URL for backend API calls |

---

## 🧪 Testing (Coming Soon)

Testing setup with Vitest and React Testing Library is planned in future iterations.

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

---

## 🔧 Development Guidelines

- Use TypeScript for all components and utilities
- Follow the existing folder structure
- Use TailwindCSS for styling
- Implement proper error handling
- Add proper TypeScript types for all props and functions

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🧑‍💻 Author

**Engineering Resource Manager**
- Frontend by [Your Name]
- Challenge by GeekyAnts

---

## 📞 Support

If you have any questions or need help with setup, please open an issue in the GitHub repository.