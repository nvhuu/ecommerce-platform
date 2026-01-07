// Locale type for future i18n support
export type Locale = "en" | "vi";

// Translation structure - organized by category
export const translations = {
  // Error messages
  errors: {
    auth: {
      sessionExpired: "Session expired. Please login again.",
      unauthorized: "You are not authorized to perform this action.",
      loginFailed: "Login failed. Please check your credentials.",
    },
    network: {
      generic: "An unexpected error occurred",
      connectionFailed: "Failed to connect to server",
      timeout: "Request timeout. Please try again.",
    },
    validation: {
      requiredField: "This field is required",
      invalidEmail: "Invalid email address",
      invalidFormat: "Invalid format",
    },
  },

  // Success messages
  success: {
    payment: {
      refundProcessed: "Refund processed successfully",
      statusUpdated: "Payment status updated successfully",
    },
    order: {
      created: "Order created successfully",
      updated: "Order updated successfully",
      cancelled: "Order cancelled successfully",
    },
    product: {
      created: "Product created successfully",
      updated: "Product updated successfully",
      deleted: "Product deleted successfully",
    },
    generic: {
      saved: "Changes saved successfully",
      deleted: "Deleted successfully",
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
export const ERROR_MESSAGES = translations.errors;
export const SUCCESS_MESSAGES = translations.success;
