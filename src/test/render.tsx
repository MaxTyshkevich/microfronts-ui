import { afterEach } from "vitest";
import { act, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import "../styles.css";

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
const mounts: { root: Root; host: HTMLDivElement }[] = [];

export async function render(content: ReactNode) {
  const host = document.createElement("div");
  document.body.append(host);
  const root = createRoot(host);
  mounts.push({ root, host });
  await act(async () => {
    root.render(content);
  });
  return {
    host,
    async rerender(next: ReactNode) {
      await act(async () => {
        root.render(next);
      });
    },
  };
}

afterEach(async () => {
  for (const { root, host } of mounts.splice(0)) {
    await act(async () => {
      root.unmount();
    });
    host.remove();
  }
});
