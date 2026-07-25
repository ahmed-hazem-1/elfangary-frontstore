"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function NewsletterForm({ labels }: { labels: { placeholder: string; subscribe: string; success: string; error: string } }) {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setPending(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        toast.success(labels.success);
        setEmail("");
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
    <form onSubmit={submit} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={labels.placeholder}
        className="input-field flex-1"
        required
      />
      <button type="submit" disabled={pending} className="btn-primary">
        {labels.subscribe}
      </button>
    </form>
  );
}
