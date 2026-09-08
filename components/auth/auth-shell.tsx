import Link from "next/link";
import type React from "react";

export function AuthShell({
  eyebrow,
  title,
  body,
  homeLabel,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  body: string;
  homeLabel: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-background px-6 py-8 text-foreground">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-foreground/65">{eyebrow}</p>
          <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-tight text-balance sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-xl leading-7 text-foreground/70">{body}</p>
          <Link href="/" className="mt-6 inline-flex text-sm font-semibold text-primary">
            {homeLabel}
          </Link>
        </div>
        <div className="border border-border bg-surface p-6 shadow-sm">
          {children}
          {footer ? <div className="mt-5 border-t border-border pt-4">{footer}</div> : null}
        </div>
      </section>
    </main>
  );
}

export function Field({
  label,
  name,
  type = "text",
  required = true,
  placeholder,
  min,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  min?: number;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-foreground">
      {label}
      <input
        className="border border-border bg-white px-3 py-2 font-normal text-foreground outline-none transition focus:border-primary"
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        min={min}
      />
    </label>
  );
}

export function Select({
  label,
  name,
  options,
  placeholder,
}: {
  label: string;
  name: string;
  options: Array<{ label: string; value: string }>;
  placeholder: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-foreground">
      {label}
      <select
        className="border border-border bg-white px-3 py-2 font-normal text-foreground outline-none transition focus:border-primary"
        defaultValue=""
        name={name}
        required
      >
        <option disabled value="">
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Textarea({
  label,
  name,
  placeholder,
}: {
  label: string;
  name: string;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-foreground">
      {label}
      <textarea
        className="min-h-28 border border-border bg-white px-3 py-2 font-normal text-foreground outline-none transition focus:border-primary"
        name={name}
        required
        placeholder={placeholder}
      />
    </label>
  );
}

export function SubmitButton({ label }: { label: string }) {
  return (
    <button className="w-full bg-primary px-4 py-3 text-sm font-semibold text-white" type="submit">
      {label}
    </button>
  );
}

export function FormError({ message }: { message?: string | string[] }) {
  const text = Array.isArray(message) ? message[0] : message;

  if (!text) {
    return null;
  }

  return <p className="mb-4 border border-border bg-accent px-3 py-2 text-sm text-foreground">{text}</p>;
}
