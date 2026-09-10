import { useId } from "react";
import {
  useController,
  type FieldPath,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form";

export function useFormField<T extends FieldValues, N extends FieldPath<T>>(
  props: UseControllerProps<T, N> & { id?: string; description?: string },
) {
  const generatedId = useId();
  const { field, fieldState } = useController(props);
  const id = props.id ?? generatedId;
  const descriptionId = props.description ? id + "-description" : undefined;
  const errorId = fieldState.error ? id + "-error" : undefined;
  return {
    field,
    fieldState,
    id,
    descriptionId,
    errorId,
    describedBy: [descriptionId, errorId].filter(Boolean).join(" ") || undefined,
  };
}
