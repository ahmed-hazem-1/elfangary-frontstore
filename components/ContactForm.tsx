"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function ContactForm({ labels }: {
  labels: { name: string; email: string; message: string; send: string; sent: string; error: string };
}) {
  const [pending, setPending] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success(labels.sent);
        setForm({ name: "", email: "", message: "" });
      } else {
        toast.error(labels.error);
      }
    } catch {
      toast.error(labels.error);
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="card space-y-4 p-6">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink-dark">{labels.name}</label>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="input-field"
          required
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink-dark">{labels.email}</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="input-field"
          required
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink-dark">{labels.message}</label>
        <textarea
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          rows={5}
          className="input-field h-auto py-3"
          required
        />
      </div>
      <button type="submit" disabled={pending} className="btn-primary w-full">
        {labels.send}
      </button>
    </form>
  );
}
