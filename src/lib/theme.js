// Application Theme Configuration
export const appTheme = {
  // Color Palette
  colors: {
    primary: {
      DEFAULT: "var(--primary)",
      50: "var(--primary-50)",
      100: "var(--primary-100)",
      200: "var(--primary-200)",
      300: "var(--primary-300)",
      400: "var(--primary-400)",
      500: "var(--primary-500)",
      600: "var(--primary-600)",
      700: "var(--primary-700)",
      800: "var(--primary-800)",
      900: "var(--primary-900)",
      950: "var(--primary-950)",
    },
    secondary: {
      DEFAULT: "var(--secondary)",
      50: "var(--secondary-50)",
      100: "var(--secondary-100)",
      200: "var(--secondary-200)",
      300: "var(--secondary-300)",
      400: "var(--secondary-400)",
      500: "var(--secondary-500)",
      600: "var(--secondary-600)",
      700: "var(--secondary-700)",
      800: "var(--secondary-800)",
      900: "var(--secondary-900)",
      950: "var(--secondary-950)",
    },
    accent: {
      DEFAULT: "var(--accent)",
      50: "var(--accent-50)",
      100: "var(--accent-100)",
      200: "var(--accent-200)",
      300: "var(--accent-300)",
      400: "var(--accent-400)",
      500: "var(--accent-500)",
      600: "var(--accent-600)",
      700: "var(--accent-700)",
      800: "var(--accent-800)",
      900: "var(--accent-900)",
      950: "var(--accent-950)",
    },
    emerald: {
      DEFAULT: "var(--emerald)",
      50: "var(--emerald-50)",
      100: "var(--emerald-100)",
      200: "var(--emerald-200)",
      300: "var(--emerald-300)",
      400: "var(--emerald-400)",
      500: "var(--emerald-500)",
      600: "var(--emerald-600)",
      700: "var(--emerald-700)",
      800: "var(--emerald-800)",
      900: "var(--emerald-900)",
      950: "var(--emerald-950)",
    },
    teal: {
      DEFAULT: "var(--teal)",
      50: "var(--teal-50)",
      100: "var(--teal-100)",
      200: "var(--teal-200)",
      300: "var(--teal-300)",
      400: "var(--teal-400)",
      500: "var(--teal-500)",
      600: "var(--teal-600)",
      700: "var(--teal-700)",
      800: "var(--teal-800)",
      900: "var(--teal-900)",
      950: "var(--teal-950)",
    },
    slate: {
      DEFAULT: "var(--slate)",
      50: "var(--slate-50)",
      100: "var(--slate-100)",
      200: "var(--slate-200)",
      300: "var(--slate-300)",
      400: "var(--slate-400)",
      500: "var(--slate-500)",
      600: "var(--slate-600)",
      700: "var(--slate-700)",
      800: "var(--slate-800)",
      900: "var(--slate-900)",
      950: "var(--slate-950)",
    },
  },

  // Typography
  typography: {
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

  // Layout
  layout: {
    container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
    card: "rounded-xl border border-slate-200 bg-card text-card-foreground shadow-sm",
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

  // Components
  components: {
    button: {
      base: "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      sizes: {
        sm: "h-9 px-3",
        md: "h-10 px-4 py-2",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
      variants: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
    input: {
      base: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    },
    card: {
      base: "rounded-xl border bg-card text-card-foreground shadow",
    },
  },

  // Gradients
  gradients: {
    emeraldToTeal: "bg-gradient-to-r from-emerald-600 to-teal-600",
    emeraldToTealLight: "bg-gradient-to-r from-emerald-500 to-teal-500",
    emeraldToTealDark: "bg-gradient-to-r from-emerald-700 to-teal-700",
  },

  // Shadows
  shadows: {
    sm: "shadow-sm",
    md: "shadow",
    lg: "shadow-md",
    xl: "shadow-lg",
    "2xl": "shadow-xl",
    inner: "shadow-inner",
  },
}
