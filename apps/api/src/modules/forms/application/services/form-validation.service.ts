import { MESSAGES } from '@/shared/constants/messages.constant';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  FieldDefinition,
  FieldType,
} from '../../domain/entities/field-definition';

@Injectable()
export class FormValidationService {
  async validateSubmission(
    fields: FieldDefinition[],
    data: Prisma.JsonObject,
  ): Promise<void> {
    const errors: Record<string, string> = {};

    for (const field of fields) {
      const value = data[field.name];

      // Check required
      if (
        field.required &&
        (value === undefined || value === null || value === '')
      ) {
        errors[field.name] = `${field.label} is required`;
        continue;
      }

      // Skip validation if not required and empty
      if (!value) continue;

      // Validate by type
      const error = this.validateField(field, value);
      if (error) {
        errors[field.name] = error;
      }
    }

    if (Object.keys(errors).length > 0) {
      throw new BadRequestException({
        message: MESSAGES.SUBMISSION.VALIDATION_FAILED,
        errors,
      });
    }
  }

  private validateField(field: FieldDefinition, value: any): string | null {
    switch (field.type) {
      case FieldType.EMAIL:
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return `${field.label} must be a valid email`;
        }
        break;

      case FieldType.NUMBER:
        if (isNaN(Number(value))) {
          return `${field.label} must be a number`;
        }
        if (
          field.validation?.min !== undefined &&
          Number(value) < field.validation.min
        ) {
          return `${field.label} must be at least ${field.validation.min}`;
        }
        if (
          field.validation?.max !== undefined &&
          Number(value) > field.validation.max
        ) {
          return `${field.label} must be at most ${field.validation.max}`;
        }
        break;

      case FieldType.URL:
        try {
          new URL(value);
        } catch {
          return `${field.label} must be a valid URL`;
        }
        break;

      case FieldType.TEL:
        if (!/^\+?[\d\s\-()]+$/.test(value)) {
          return `${field.label} must be a valid phone number`;
        }
        break;
    }

    // String length validation
    if (typeof value === 'string') {
      if (field.validation?.min && value.length < field.validation.min) {
        return `${field.label} must be at least ${field.validation.min} characters`;
      }
      if (field.validation?.max && value.length > field.validation.max) {
        return `${field.label} must be at most ${field.validation.max} characters`;
      }
    }

    // Pattern validation
    if (field.validation?.pattern) {
      const regex = new RegExp(field.validation.pattern);
      if (!regex.test(String(value))) {
        return field.validation.message || `${field.label} format is invalid`;
      }
    }

    return null;
  }

  sanitizeData(data: Prisma.JsonObject): Prisma.JsonObject {
    const sanitized: Prisma.JsonObject = {};

    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        // Basic XSS prevention
        sanitized[key] = value
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .trim();
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }
}
