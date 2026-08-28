import type { ReactNode } from "react";

type PanelProps = {
  title: string;
  children: ReactNode;
};

export function Panel({ title, children }: PanelProps) {
  return (
    <section className="mf-panel">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

