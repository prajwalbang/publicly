"use client";

import { useState } from "react";
import Reveal from "@/components/reveal";
import { Field, PillGroup, inputClass } from "@/components/form";
import { supabase } from "@/lib/supabase";

const WORK_TYPES = [
  "Content",
  "DevRel",
  "Product Marketing",
  "Design",
  "Engineering",
];

const BUILDER_UPSIDES = [
  ["Paid pilots", "From day one"],
  ["Real products", "Not spec work"],
  ["Public portfolio", "Every post counts"],
  ["Distribution", "Your reach grows too"],
];

type Status = "idle" | "submitting" | "success" | "error";

export default function BuilderApplication() {
  const [canPost, setCanPost] = useState<string[]>([]);
  const [work, setWork] = useState<string[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = new FormData(form);

    // Upload the optional video first, if one was chosen.
    let videoPath: string | null = null;
    const video = data.get("video");
    if (video instanceof File && video.size > 0) {
      const safeName = video.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const path = `${Date.now()}-${safeName}`;
      const { error: uploadError } = await supabase.storage
        .from("builder-videos")
        .upload(path, video);

      if (uploadError) {
        setStatus("error");
        setErrorMsg(`Video upload failed: ${uploadError.message}`);
        return;
      }
      videoPath = path;
    }

    const { error } = await supabase.from("builder_applications").insert({
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      location: String(data.get("location") || ""),
      content_style: String(data.get("content_style") || ""),
      technical_fluency: String(data.get("technical_fluency") || ""),
      portfolio: String(data.get("portfolio") || ""),
      social_links: String(data.get("social_links") || ""),
      can_post: canPost[0] || null,
      preferred_work: work,
      availability: String(data.get("availability") || ""),
      video_path: videoPath,
    });

    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
      return;
    }

    form.reset();
    setCanPost([]);
    setWork([]);
    setStatus("success");
  }

  return (
    <section id="apply" className="border-t border-hairline py-22 md:py-32">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        {/* Mirrored composition: form left, copy right */}
        <div className="grid grid-cols-12 items-start gap-x-8 gap-y-14">
          <div className="order-2 col-span-12 lg:order-1 lg:col-span-7">
            <Reveal delay={80}>
              <form
                className="space-y-8 rounded-[4px] border border-hairline p-6 md:p-8"
                onSubmit={handleSubmit}
              >
                <div className="grid gap-8 sm:grid-cols-2">
                  <Field label="Name" htmlFor="a-name">
                    <input
                      id="a-name"
                      name="name"
                      type="text"
                      required
                      placeholder="Your name"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Email" htmlFor="a-email">
                    <input
                      id="a-email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      className={inputClass}
                    />
                  </Field>
                </div>
                <Field label="Location / timezone" htmlFor="a-location">
                  <input
                    id="a-location"
                    name="location"
                    type="text"
                    placeholder="Lisbon, UTC+1"
                    className={inputClass}
                  />
                </Field>
                <Field label="Content style and formats" htmlFor="a-style">
                  <textarea
                    id="a-style"
                    name="content_style"
                    rows={3}
                    placeholder="Build logs, 30s demos, launch threads, YouTube Shorts. Whatever you actually ship."
                    className={inputClass}
                  />
                </Field>
                <Field label="Technical fluency" htmlFor="a-tech">
                  <input
                    id="a-tech"
                    name="technical_fluency"
                    type="text"
                    placeholder="React, AI APIs, Figma"
                    className={inputClass}
                  />
                </Field>
                <Field label="Portfolio and best posts" htmlFor="a-portfolio">
                  <input
                    id="a-portfolio"
                    name="portfolio"
                    type="url"
                    placeholder="Links to the work you are proudest of"
                    className={inputClass}
                  />
                </Field>
                <Field
                  label="Social links, with reach if you have it"
                  htmlFor="a-social"
                >
                  <input
                    id="a-social"
                    name="social_links"
                    type="text"
                    placeholder="x.com/you (8K), youtube.com/@you (2K subs)"
                    className={inputClass}
                  />
                </Field>
                <Field label="Can you post publicly 3 to 5 times per week?">
                  <PillGroup
                    label="Can you post publicly 3 to 5 times per week?"
                    options={["Yes", "No"]}
                    selected={canPost}
                    onToggle={(option) => setCanPost([option])}
                  />
                </Field>
                <Field label="Preferred work">
                  <PillGroup
                    label="Preferred work"
                    options={WORK_TYPES}
                    selected={work}
                    onToggle={(option) =>
                      setWork((prev) =>
                        prev.includes(option)
                          ? prev.filter((t) => t !== option)
                          : [...prev, option],
                      )
                    }
                  />
                </Field>
                <div className="grid gap-8 sm:grid-cols-2">
                  <Field label="Availability" htmlFor="a-availability">
                    <input
                      id="a-availability"
                      name="availability"
                      type="text"
                      placeholder="15 hrs/week"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Short video intro" htmlFor="a-video" optional>
                    <input
                      id="a-video"
                      name="video"
                      type="file"
                      accept="video/*"
                      className="w-full rounded-[4px] border border-hairline bg-transparent px-3 py-2 font-mono text-[11px] text-ink-secondary file:mr-3 file:rounded-full file:border file:border-hairline file:bg-transparent file:px-3 file:py-1 file:font-mono file:text-[10px] file:uppercase file:tracking-[0.12em] file:text-ink"
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
                      ? "Submitting…"
                      : "Apply as a Public Builder"}
                  </button>
                  {status === "success" && (
                    <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-accent">
                      Application received. We will be in touch.
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

          <div className="order-1 col-span-12 lg:order-2 lg:col-span-5">
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-secondary">
                For Public Builders
              </p>
              <h2 className="mt-5 font-display text-4xl font-medium leading-[1.08] tracking-tight md:text-5xl">
                Become a Public Builder.
              </h2>
              <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-ink-secondary">
                Join startups early, understand what they are building, and turn
                real progress into a public portfolio.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <dl className="mt-10 divide-y divide-hairline border-y border-hairline">
                {BUILDER_UPSIDES.map(([term, detail]) => (
                  <div
                    key={term}
                    className="flex items-baseline justify-between gap-4 py-3"
                  >
                    <dt className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink">
                      {term}
                    </dt>
                    <dd className="font-mono text-[11px] text-ink-secondary">
                      {detail}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
