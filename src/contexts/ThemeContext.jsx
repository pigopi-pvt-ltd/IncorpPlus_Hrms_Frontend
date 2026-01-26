import React, { createContext, useContext, useState, useEffect } from "react"

// Define the theme context
const ThemeContext = createContext()

// Default theme configuration
const defaultTheme = {
  colors: {
    primary: "emerald",
    secondary: "teal",
    accent: "slate",
    background: "white",
    foreground: "slate-900",
  },
  typography: {
    fontFamily: "Inter, sans-serif",
    headings: {
      h1: "text-4xl font-bold",
      h2: "text-3xl font-bold",
      h3: "text-2xl font-bold",
      h4: "text-xl font-bold",
      h5: "text-lg font-bold",
      h6: "text-base font-bold",
    },
    body: {
      large: "text-lg",
      medium: "text-base",
      small: "text-sm",
      xsmall: "text-xs",
    },
  },
  layout: {
    container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
    card: "rounded-xl border bg-card text-card-foreground shadow",
    cardPadding: "p-6",
    spacing: {
      xs: "0.25rem", // 4px
      sm: "0.5rem", // 8px
      md: "1rem", // 16px
      lg: "1.5rem", // 24px
      xl: "2rem", // 32px
      "2xl": "3rem", // 48px
    },
  },
  gradients: {
    emeraldToTeal: "bg-gradient-to-r from-emerald-600 to-teal-600",
    emeraldToTealLight: "bg-gradient-to-r from-emerald-500 to-teal-500",
    emeraldToTealDark: "bg-gradient-to-r from-emerald-700 to-teal-700",
  },
  shadows: {
    sm: "shadow-sm",
    md: "shadow",
    lg: "shadow-md",
    xl: "shadow-lg",
    "2xl": "shadow-xl",
    inner: "shadow-inner",
  },
}

export const ThemeProvider = ({
  children,
  theme: initialTheme = defaultTheme,
}) => {
  const [theme, setTheme] = useState(initialTheme)

  // Apply theme colors to CSS variables
  useEffect(() => {
    const root = document.documentElement

    // Set theme colors as CSS variables
    Object.entries(theme.colors).forEach(([colorName, colorValue]) => {
      if (typeof colorValue === "string") {
        root.style.setProperty(`--color-${colorName}`, `var(--${colorValue})`)
      }
    })
  }, [theme])

  const updateTheme = (newTheme) => {
    setTheme((prev) => ({
      ...prev,
      ...newTheme,
    }))
  }

  const updateThemeSection = (section, newValues) => {
    setTheme((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...newValues,
      },
    }))
  }

  const value = {
    theme,
    updateTheme,
    updateThemeSection,
    colors: theme.colors,
    typography: theme.typography,
    layout: theme.layout,
    gradients: theme.gradients,
    shadows: theme.shadows,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

// Custom hook to get themed classes
export const useThemedClasses = () => {
  const { theme } = useTheme()

  return {
    // Get themed button classes
    getButtonClass: (variant = "default", size = "md") => {
      const base =
        "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      const sizes = {
        sm: "h-9 px-3",
        md: "h-10 px-4 py-2",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      }
      const variants = {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      }

      return `${base} ${sizes[size] || sizes.md} ${
        variants[variant] || variants.default
      }`
    },

    // Get themed card classes
    getCardClass: () => {
      return theme.layout.card
    },

    // Get themed input classes
    getInputClass: () => {
      return "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    },

    // Get themed gradient classes
    getGradientClass: (name) => {
      return theme.gradients[name] || theme.gradients.emeraldToTeal
    },

    // Get themed shadow classes
    getShadowClass: (name) => {
      return theme.shadows[name] || theme.shadows.md
    },
  }
}
