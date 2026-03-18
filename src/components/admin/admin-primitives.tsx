/**
 * ADMIN PRIMITIVES
 * Re-exports from design system with admin-specific aliases.
 * Use these for admin panel forms and layouts.
 */

import {
  formCx,
  FormField,
  FieldGroup,
  SaveButton,
  PageHeader,
  StatusDot,
} from "@/design-system";

// Backward-compatible alias
export const adminCx = formCx;

export { FormField, FieldGroup, SaveButton, PageHeader, StatusDot };
