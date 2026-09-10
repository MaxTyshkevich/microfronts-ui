import type { ComponentProps } from "react";
import { Button as Primitive } from "@/shared/ui/shadcn/button";
import { cn } from "@/shared/ui/shadcn/utils";

export type ButtonProps = ComponentProps<typeof Primitive> & { error?: boolean };

export function Button({ error, className, ...props }: ButtonProps) {
  return (
    <Primitive
      {...props}
      aria-invalid={error || props["aria-invalid"]}
      className={cn(
        "border-[0.0625rem] rounded-lg active:translate-y-[0.0625rem] focus-visible:outline-[0.1875rem] focus-visible:outline-solid focus-visible:outline-ring focus-visible:outline-offset-[0.125rem] aria-invalid:outline-[0.125rem] aria-invalid:outline-solid aria-invalid:outline-destructive aria-invalid:outline-offset-[0.125rem]",
        className,
      )}
    />
  );
}
