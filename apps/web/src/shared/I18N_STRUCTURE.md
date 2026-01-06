# i18n Constants Structure

## Overview

Đã tạo cấu trúc constants i18n-ready với backward compatibility.

## Structure

```
apps/web/src/shared/
├── constants/
│   └── form-messages.constant.ts  # Main translations (English)
└── locales/
    └── vi.ts                       # Vietnamese example
```

## Usage

### Current (Backward Compatible)

```typescript
import { VALIDATION_MESSAGES, FORM_LABELS } from "@/shared/constants/form-messages.constant";

// Still works!
VALIDATION_MESSAGES.required.email; // "Email is required"
FORM_LABELS.email; // "Email"
```

### Future (i18n Ready)

```typescript
import { translations, t } from "@/shared/constants/form-messages.constant";

// Nested access
translations.auth.validation.required.email;

// Using helper function
t("auth.validation.required.email"); // "Email is required"
t("auth.validation.required.email", "vi"); // "Email là bắt buộc"
```

## Adding New Languages

1. Create new locale file: `src/shared/locales/{locale}.ts`
2. Copy structure from `vi.ts`
3. Translate all strings
4. Import in your i18n configuration

## Benefits

✅ **Namespace organization** - Grouped by feature (auth, common, etc.)
✅ **Type-safe** - Full TypeScript support
✅ **Future-proof** - Ready for next-i18n or react-i18next
✅ **Zero breaking changes** - Backward compatible exports
✅ **Easy maintenance** - Clear structure for adding translations
