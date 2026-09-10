import type { ComponentProps } from "react";
import type { FieldPath, FieldValues, UseControllerProps } from "react-hook-form";
import { Input as Primitive } from "@/shared/ui/shadcn/input";
import { useFormField } from "../../form/use-form-field";
import { cn } from "@/shared/ui/shadcn/utils";
import { Field, FieldLabel, FieldDescription, FieldError } from "@/shared/ui/shadcn/field";

export type InputProps<
  T extends FieldValues,
  N extends FieldPath<T> = FieldPath<T>,
> = UseControllerProps<T, N> &
  Omit<ComponentProps<"input">, "name" | "value" | "defaultValue" | "disabled" | "ref"> & {
    label: string;
    description?: string;
  };

export function Input<T extends FieldValues, N extends FieldPath<T> = FieldPath<T>>({
  name,
  control,
  rules,
  defaultValue,
  shouldUnregister,
  disabled,
  label,
  description,
  id: suppliedId,
  className,
  onChange,
  onBlur,
  ...props
}: InputProps<T, N>) {
  const { field, fieldState, id, descriptionId, errorId, describedBy } = useFormField({
    name,
    control,
    rules,
    defaultValue,
    shouldUnregister,
    disabled,
    id: suppliedId,
    description,
  });
  return (
    <Field
      data-invalid={fieldState.invalid || props["aria-invalid"]}
      data-disabled={field.disabled}
    >
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Primitive
        {...props}
        {...field}
        id={id}
        value={field.value ?? ""}
        className={cn(
          "border-[0.0625rem] hover:enabled:border-ring focus-visible:outline-[0.1875rem] focus-visible:outline-solid focus-visible:outline-ring focus-visible:outline-offset-[0.125rem] aria-invalid:outline-[0.125rem] aria-invalid:outline-solid aria-invalid:outline-destructive aria-invalid:outline-offset-[0.125rem]",
          className,
        )}
        aria-invalid={fieldState.invalid || props["aria-invalid"]}
        aria-describedby={
          [props["aria-describedby"], describedBy].filter(Boolean).join(" ") || undefined
        }
        onChange={(event) => {
          field.onChange(event);
          onChange?.(event);
        }}
        onBlur={(event) => {
          field.onBlur();
          onBlur?.(event);
        }}
      />
      {description && <FieldDescription id={descriptionId}>{description}</FieldDescription>}
      {fieldState.error && (
        <FieldError id={errorId}>{fieldState.error.message || "Invalid value"}</FieldError>
      )}
    </Field>
  );
}
