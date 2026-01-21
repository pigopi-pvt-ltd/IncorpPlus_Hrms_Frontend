# HRMS Frontend - Human Resource Management System

A modern, role-based Human Resource Management System built with React, Vite, and Tailwind CSS.

## 🚀 Features

- **Role-Based Access Control (RBAC)**: Four user roles (Global Admin, Super Admin, HR, Employee)
- **Responsive Dashboard**: Role-specific dashboards with relevant metrics
- **Authentication**: Secure login/logout with token management
- **Navigation**: Dynamic sidebar navigation based on user roles
- **Modern UI**: Clean, responsive design using Tailwind CSS and ShadCN components

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **State Management**: React Context API
- **HTTP Client**: Axios
- **UI Components**: Custom ShadCN-inspired components

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/          # Layout components (Header, Sidebar, MainLayout)
│   ├── shared/          # Shared components (ProtectedRoute)
│   └── ui/             # Reusable UI components (Button, Card)
├── constants/          # Application constants (roles, endpoints)
├── contexts/           # React contexts (AuthContext)
├── lib/               # Utility functions
├── pages/             # Page components organized by role
│   ├── admin/         # Global Admin pages
│   ├── auth/          # Authentication pages
│   ├── dashboard/     # Main dashboard
│   ├── employee/      # Employee pages
│   ├── hr/            # HR Manager pages
│   └── super-admin/   # Super Admin pages
├── routes/            # Route configuration
├── services/          # API services and authentication
└── App.jsx           # Main application component
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd HRMS-Frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🔐 Authentication

### Demo Credentials

The application comes with a mock authentication service for testing:

- **Global Admin**: `admin@company.com` / `password123`
- **Super Admin**: `superadmin@system.com` / `password123`
- **HR Manager**: `hr@company.com` / `password123`
- **Employee**: `employee@company.com` / `password123`

### Switching to Real Backend

To connect to a real backend API:

1. Edit the `.env` file:

```bash
# Uncomment and set your backend URL
VITE_API_BASE_URL=http://localhost:3000
```

2. Restart the development server

## 🎨 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Component Development

All UI components follow a consistent pattern:

- Located in `src/components/ui/`
- Use Tailwind CSS classes
- Export individual components for easy importing

### Adding New Pages

1. Create the page component in the appropriate role directory
2. Add the route to `src/routes/routesConfig.js`
3. Update navigation in `src/components/layout/Sidebar.jsx` if needed

## 📱 Responsive Design

The application is fully responsive and works on:

- Desktop browsers
- Tablets
- Mobile devices

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:3000  # Your backend API URL
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with React and Vite
- Styled with Tailwind CSS
- Inspired by ShadCN UI components
