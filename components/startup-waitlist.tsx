"use client";

import { useState } from "react";
import Reveal from "@/components/reveal";
import { Field, PillGroup, inputClass } from "@/components/form";
import { supabase } from "@/lib/supabase";

const STAGES = ["Idea", "MVP", "Launched", "Funded"];
const BUILDER_TYPES = [
  "Content",
  "DevRel",
  "Product Marketing",
  "Design",
  "Engineering",
];

type Status = "idle" | "submitting" | "success" | "error";

export default function StartupWaitlist() {
  const [stage, setStage] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = new FormData(form);

    const { error } = await supabase.from("startup_waitlist").insert({
      startup_name: String(data.get("startup_name") || ""),
      website: String(data.get("website") || ""),
      building: String(data.get("building") || ""),
      stage: stage[0] || null,
      momentum: String(data.get("momentum") || ""),
      builder_types: types,
      budget: String(data.get("budget") || ""),
      founder_email: String(data.get("founder_email") || ""),
    });

    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
      return;
    }

    form.reset();
    setStage([]);
    setTypes([]);
    setStatus("success");
  }

  return (
    <section id="waitlist" className="border-t border-hairline py-22 md:py-32">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <div className="grid grid-cols-12 items-start gap-x-8 gap-y-14">
          {/* Copy + supporting status block */}
          <div className="col-span-12 lg:col-span-5">
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-secondary">
                For startups
              </p>
              <h2 className="mt-5 font-display text-4xl font-medium leading-[1.08] tracking-tight md:text-5xl">
                Get early access to Public Builders.
              </h2>
              <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-ink-secondary">
                We are onboarding a small group of early startups first. Join
                the waitlist to hire Public Builders who understand your
                product and turn its progress into public momentum.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <div className="mt-10 rounded-[4px] border border-hairline">
                <div className="grid-texture flex items-center justify-between border-b border-hairline px-4 py-3">
                  <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-secondary">
                    Early access · Batch 01
                  </span>
                  <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-ink-secondary">
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-amber"
                      aria-hidden="true"
                    />
                    Onboarding
                  </span>
                </div>
                <dl className="divide-y divide-hairline px-4 font-mono text-[11px]">
                  <div className="flex justify-between py-2.5">
                    <dt className="uppercase tracking-[0.12em] text-ink-secondary/80">
                      Startup slots
                    </dt>
                    <dd className="text-ink">25</dd>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <dt className="uppercase tracking-[0.12em] text-ink-secondary/80">
                      Review window
                    </dt>
                    <dd className="text-ink-secondary">Within 1 week</dd>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <dt className="uppercase tracking-[0.12em] text-ink-secondary/80">
                      Next step
                    </dt>
                    <dd className="text-ink-secondary">Intro call, then match</dd>
                  </div>
                </dl>
              </div>
            </Reveal>
          </div>

          {/* Form */}
          <div className="col-span-12 lg:col-span-7">
            <Reveal delay={80}>
              <form
                className="space-y-8 rounded-[4px] border border-hairline p-6 md:p-8"
                onSubmit={handleSubmit}
              >
                <div className="grid gap-8 sm:grid-cols-2">
                  <Field label="Startup name" htmlFor="w-name">
                    <input
                      id="w-name"
                      name="startup_name"
                      type="text"
                      required
                      placeholder="Acme Systems"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Website" htmlFor="w-site">
                    <input
                      id="w-site"
                      name="website"
                      type="url"
                      placeholder="acme.dev"
                      className={inputClass}
                    />
                  </Field>
                </div>
                <Field label="What are you building?" htmlFor="w-building">
                  <textarea
                    id="w-building"
                    name="building"
                    rows={3}
                    placeholder="One or two sentences on the product and who it is for."
                    className={inputClass}
                  />
                </Field>
                <Field label="Stage">
                  <PillGroup
                    label="Stage"
                    options={STAGES}
                    selected={stage}
                    onToggle={(option) => setStage([option])}
                  />
                </Field>
                <Field
                  label="What kind of public momentum do you want?"
                  htmlFor="w-momentum"
                >
                  <textarea
                    id="w-momentum"
                    rows={3}
                    placeholder="Launch buzz, weekly demos, a build-in-public presence, developer trust."
                    className={inputClass}
                  />
                </Field>
                <Field label="Preferred Public Builder type">
                  <PillGroup
                    label="Preferred Public Builder type"
                    options={BUILDER_TYPES}
                    selected={types}
                    onToggle={(option) =>
                      setTypes((prev) =>
                        prev.includes(option)
                          ? prev.filter((t) => t !== option)
                          : [...prev, option],
                      )
                    }
                  />
                </Field>
                <div className="grid gap-8 sm:grid-cols-2">
                  <Field label="Budget range" htmlFor="w-budget">
                    <input
                      id="w-budget"
                      name="budget"
                      type="text"
                      placeholder="$1,500 to $3,000 / month"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Founder email" htmlFor="w-email">
                    <input
                      id="w-email"
                      name="founder_email"
                      type="email"
                      required
                      placeholder="you@acme.dev"
                      className={inputClass}
                    />
                  </Field>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="rounded-[4px] bg-accent px-5 py-3 font-mono text-xs font-medium uppercase tracking-[0.15em] text-canvas transition-opacity duration-[120ms] ease-signature hover:opacity-85 disabled:opacity-50"
                  >
                    {status === "submitting"
                      ? "Joining…"
                      : "Join Startup Waitlist"}
                  </button>
                  {status === "success" && (
                    <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-accent">
                      You are on the list. We will be in touch.
                    </p>
                  )}
                  {status === "error" && (
                    <p className="font-mono text-[11px] text-red-500">
                      {errorMsg || "Something went wrong. Please try again."}
                    </p>
                  )}
                </div>
              </form>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
