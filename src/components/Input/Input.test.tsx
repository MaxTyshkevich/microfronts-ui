import { expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { act } from "react";
import { render } from "../../test/render";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../Button/Button";
import { Input } from "./Input";

const schema = z.object({ email: z.email("Enter a valid email") });
type Values = z.infer<typeof schema>;
function Form({
  onSubmit,
  disabled = false,
}: {
  onSubmit: (values: Values) => void;
  disabled?: boolean;
}) {
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { email: "" } });
  return (
    <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
      <Input control={form.control} name="email" label="Email" type="email" disabled={disabled} />
      <Button type="submit">Submit</Button>
      <Button type="button" onClick={() => form.reset()}>
        Reset
      </Button>
    </form>
  );
}

test("Input validates, focuses errors, submits browser input and resets", async () => {
  const onSubmit = vi.fn();
  await render(<Form onSubmit={onSubmit} />);
  const input = page.getByRole("textbox", { name: "Email" });
  await act(async () => {
    await page.getByRole("button", { name: "Submit" }).click();
  });
  await expect.element(page.getByRole("alert")).toHaveTextContent("Enter a valid email");
  await expect.element(input).toHaveFocus();
  expect(input.element().closest('[data-slot="field"]')).toHaveAttribute("data-invalid", "true");
  expect(onSubmit).not.toHaveBeenCalled();
  await act(async () => {
    await input.fill("hello@example.com");
  });
  await act(async () => {
    await page.getByRole("button", { name: "Submit" }).click();
  });
  expect(onSubmit).toHaveBeenCalledTimes(1);
  expect(onSubmit.mock.calls[0][0]).toEqual({ email: "hello@example.com" });
  await expect.element(page.getByRole("alert")).not.toBeInTheDocument();
  expect(input.element().closest('[data-slot="field"]')).not.toHaveAttribute("data-invalid");
  await act(async () => {
    await page.getByRole("button", { name: "Reset" }).click();
  });
  await expect.element(input).toHaveValue("");
});

test("disabled Input is omitted from keyboard navigation", async () => {
  await render(<Form disabled onSubmit={vi.fn()} />);
  await expect.element(page.getByRole("textbox", { name: "Email" })).toBeDisabled();
  await act(async () => {
    await userEvent.tab();
  });
  await expect.element(page.getByRole("button", { name: "Submit" })).toHaveFocus();
});

for (const theme of ["light", "dark"]) {
  test(theme + ": Input applies theme, hover and keyboard focus", async () => {
    await render(
      <div className={theme}>
        <div className="bg-background text-foreground p-6">
          <Form onSubmit={vi.fn()} />
        </div>
      </div>,
    );
    const input = page.getByRole("textbox", { name: "Email" });
    const container = input.element().closest(".bg-background")!;
    expect(getComputedStyle(container).backgroundColor).toBe(
      theme === "dark" ? "oklch(0.145 0 0)" : "oklch(1 0 0)",
    );
    await userEvent.hover(container, { position: { x: 1, y: 1 } });
    const initial = getComputedStyle(input.element()).borderColor;
    await input.hover();
    await expect.poll(() => input.element().matches(":hover")).toBe(true);
    await expect.poll(() => getComputedStyle(input.element()).borderColor).not.toBe(initial);
    await act(async () => {
      await userEvent.tab();
    });
    await expect.element(input).toHaveFocus();
    expect(getComputedStyle(input.element()).outlineStyle).toBe("solid");
  });
}
