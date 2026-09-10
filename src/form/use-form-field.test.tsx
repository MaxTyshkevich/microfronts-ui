import { expect, test, vi } from "vitest";
import { page } from "vitest/browser";
import { act } from "react";
import { FormProvider, useForm, type Control } from "react-hook-form";
import { useFormField } from "./use-form-field";
import { render } from "../test/render";

type Values = { first: string; second: string };

// Native input deliberately isolates the hook contract from the shadcn wrapper.
function Probe({
  name,
  control,
  id,
  description,
  disabled,
}: {
  name: "first" | "second";
  control?: Control<Values>;
  id?: string;
  description?: string;
  disabled?: boolean;
}) {
  const result = useFormField({
    name,
    control,
    id,
    description,
    disabled,
    rules: name === "first" ? { required: "Required" } : undefined,
  });
  const { field, fieldState, descriptionId, errorId, describedBy } = result;
  return (
    <>
      <label htmlFor={result.id}>{name}</label>
      <input
        {...field}
        id={result.id}
        aria-describedby={describedBy}
        aria-invalid={fieldState.invalid}
      />
      {description && <p id={descriptionId}>{description}</p>}
      {fieldState.error && (
        <p id={errorId} role="alert">
          {fieldState.error.message}
        </p>
      )}
      <output aria-label={name + " state"}>
        {JSON.stringify({
          dirty: fieldState.isDirty,
          touched: fieldState.isTouched,
        })}
      </output>
    </>
  );
}

function Harness({
  context = false,
  id,
  description,
  disabled,
  second = false,
  onSubmit = () => {},
}: {
  context?: boolean;
  id?: string;
  description?: string;
  disabled?: boolean;
  second?: boolean;
  onSubmit?: (values: Values) => void;
}) {
  const form = useForm<Values>({ defaultValues: { first: "", second: "" } });
  const content = (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Probe
        name="first"
        control={context ? undefined : form.control}
        id={id}
        description={description}
        disabled={disabled}
      />
      {second && <Probe name="second" control={context ? undefined : form.control} />}
      <button type="submit">Submit</button>
      <button type="button" onClick={() => form.reset()}>
        Reset
      </button>
    </form>
  );
  return context ? <FormProvider {...form}>{content}</FormProvider> : content;
}

test.each([false, true])(
  "hook uses explicit control or FormProvider (context=%s)",
  async (context) => {
    const submitted = vi.fn();
    await render(<Harness context={context} onSubmit={submitted} />);
    await act(async () => {
      await page.getByRole("textbox", { name: "first" }).fill("Value");
    });
    await act(async () => {
      await page.getByRole("button", { name: "Submit" }).click();
    });
    expect(submitted).toHaveBeenCalledTimes(1);
    expect(submitted.mock.calls[0][0]).toEqual({ first: "Value", second: "" });
  },
);

test("generated ids are unique and stable after input and rerender", async () => {
  const view = await render(<Harness second />);
  const first = page.getByRole("textbox", { name: "first" });
  const second = page.getByRole("textbox", { name: "second" });
  const id = first.element().id;
  expect(id).not.toBe("");
  expect(second.element().id).not.toBe(id);
  await act(async () => {
    await first.fill("Changed");
  });
  await view.rerender(<Harness second />);
  expect(first.element().id).toBe(id);
  await expect.element(first).toHaveValue("Changed");
  await expect.element(first).not.toHaveAttribute("aria-describedby");
});

test("explicit id and ARIA descriptions follow validation and reset", async () => {
  await render(<Harness id="custom-id" description="Help text" />);
  const input = page.getByRole("textbox", { name: "first" });
  await expect.element(input).toHaveAttribute("id", "custom-id");
  await expect.element(input).toHaveAttribute("aria-describedby", "custom-id-description");
  await act(async () => {
    await page.getByRole("button", { name: "Submit" }).click();
  });
  await expect
    .element(input)
    .toHaveAttribute("aria-describedby", "custom-id-description custom-id-error");
  await expect.element(page.getByRole("alert")).toHaveAttribute("id", "custom-id-error");
  await expect.element(input).toHaveFocus();
  await expect.element(input).toHaveAttribute("aria-invalid", "true");
  await act(async () => {
    await page.getByRole("button", { name: "Reset" }).click();
  });
  await expect.element(page.getByRole("alert")).not.toBeInTheDocument();
  await expect.element(input).toHaveAttribute("aria-describedby", "custom-id-description");
  await expect.element(input).toHaveAttribute("aria-invalid", "false");
});

test("field handlers update dirty/touched and reset restores defaults", async () => {
  await render(<Harness />);
  const state = page.getByRole("status", { name: "first state" });
  await expect.element(state).toHaveTextContent('{"dirty":false,"touched":false}');
  await act(async () => {
    await page.getByRole("textbox", { name: "first" }).fill("Changed");
  });
  await act(async () => {
    await page.getByRole("button", { name: "Submit" }).click();
  });
  await expect.element(state).toHaveTextContent('{"dirty":true,"touched":true}');
  await act(async () => {
    await page.getByRole("button", { name: "Reset" }).click();
  });
  await expect.element(state).toHaveTextContent('{"dirty":false,"touched":false}');
  await expect.element(page.getByRole("textbox", { name: "first" })).toHaveValue("");
});

test("disabled field is disabled in DOM and omitted from submitted values", async () => {
  const submitted = vi.fn();
  await render(<Harness disabled onSubmit={submitted} />);
  await expect.element(page.getByRole("textbox", { name: "first" })).toBeDisabled();
  await act(async () => {
    await page.getByRole("button", { name: "Submit" }).click();
  });
  expect(submitted).toHaveBeenCalledTimes(1);
  expect(submitted.mock.calls[0][0].first).toBeUndefined();
});
