import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  tone?: "blue" | "green" | "amber";
};

export function Badge({ children, tone = "blue" }: BadgeProps) {
  return <span className={`mf-badge mf-badge-${tone}`}>{children}</span>;
}
