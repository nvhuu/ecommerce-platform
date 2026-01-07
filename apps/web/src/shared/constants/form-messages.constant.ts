// Locale type for future i18n support
export type Locale = "en" | "vi";

// Translation structure - organized by feature/domain
export const translations = {
  // Authentication related
  auth: {
    validation: {
      required: {
        email: "Email is required",
        password: "Password is required",
        firstName: "First name is required",
        lastName: "Last name is required",
        confirmPassword: "Please confirm your password",
      },
      format: {
        email: "Invalid email address",
      },
      length: {
        passwordMin: "Password must be at least 6 characters",
        firstNameMin: "First name must be at least 2 characters",
        lastNameMin: "Last name must be at least 2 characters",
      },
      match: {
        password: "Passwords don't match",
      },
    },
    labels: {
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm password",
      firstName: "First name",
      lastName: "Last name",
    },
    placeholders: {
      email: "m@example.com",
      emailAddress: "Email address",
      password: "Password",
      firstName: "John",
      lastName: "Doe",
    },
    buttons: {
      signIn: "Sign In",
      signUp: "Sign up",
      createAccount: "Create account",
    },
    links: {
      forgotPassword: "Forgot password?",
      haveAccount: "Already have an account?",
      noAccount: "Don't have an account?",
    },
    titles: {
      welcomeBack: "Welcome back",
      createAccount: "Create an account",
      cmsAdmin: "CMS Admin",
    },
    descriptions: {
      login: "Enter your email and password to sign in to your account",
      register: "Enter your information to create a new account",
      cmsLogin: "Sign in to your account",
    },
  },

  // Common messages across the app
  common: {
    success: {
      loginSuccessful: "Login successful!",
      registerSuccessful: "Registration successful!",
    },
    error: {
      loginFailed: "Login failed",
      registerFailed: "Registration failed",
    },
  },
} as const;

// Export type for translations (useful for type-safe access)
export type Translations = typeof translations;

// Helper function to get translation (placeholder for future i18n)
export const t = (key: string): string => {
  // For now, just return English
  // In the future, this will support multiple locales: t(key, locale)
  const keys = key.split(".");
  let value: Record<string, unknown> | string = translations;

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k] as Record<string, unknown> | string;
    } else {
      return key; // Return key if not found
    }
  }

  return typeof value === "string" ? value : key;
};

// Backward compatibility exports (can be removed after full migration)
export const VALIDATION_MESSAGES = translations.auth.validation;
export const FORM_LABELS = translations.auth.labels;
export const FORM_PLACEHOLDERS = translations.auth.placeholders;
export const BUTTON_LABELS = translations.auth.buttons;
export const LINK_TEXTS = translations.auth.links;
export const PAGE_TITLES = translations.auth.titles;
export const PAGE_DESCRIPTIONS = translations.auth.descriptions;
export const MESSAGES = translations.common;
