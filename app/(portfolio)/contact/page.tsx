"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Mail, MapPin, Share2, Globe, MessageSquare, Check, AlertCircle } from "lucide-react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setSubmitStatus("error");
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "General Inquiry",
          message: "",
        });
      } else {
        setSubmitStatus("error");
        setErrorMessage(data.error || "Failed to submit your message. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus("error");
      setErrorMessage("An unexpected error occurred. Please check your network and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.subject.trim() !== "" &&
    formData.message.trim() !== "";

  return (
    <div className="min-h-screen bg-primary font-body">
      {/* Hero Header */}
      <section className="pt-16 md:pt-28 pb-6 md:pb-12 px-6 text-center animate-in fade-in duration-700">
        <h1 className="text-4xl md:text-6xl font-headline text-accent mb-3 italic">Get in Touch</h1>
        <p className="text-text-muted font-label uppercase tracking-widest text-xs md:text-sm max-w-lg mx-auto">
          If you’d like to connect, talk about art, or just say hello, feel free to reach out.
        </p>
      </section>

      {/* Mobile Studio Image */}
      <div className="lg:hidden px-6 pb-6 animate-in fade-in duration-700">
        <div className="relative h-60 w-full rounded-2xl overflow-hidden shadow-xs border border-neutral/10">
          <Image
            src="/images/contact-hero.png"
            alt="Studio Detail"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Contact Form */}
          <div className="bg-secondary/30 p-6 md:p-12 rounded-2xl border border-neutral/10 shadow-sm transition-all duration-300">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Feedback States */}
              {submitStatus === "success" && (
                <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-100 dark:border-emerald-900/30 text-sm font-label animate-in slide-in-from-top-4 duration-300">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0">
                    <Check size={14} />
                  </div>
                  <span>Your message has been sent successfully! We'll get back to you shortly.</span>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-900/30 text-sm font-label animate-in slide-in-from-top-4 duration-300">
                  <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center flex-shrink-0">
                    <AlertCircle size={14} />
                  </div>
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-label uppercase tracking-widest text-neutral">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    disabled={isSubmitting}
                    className="w-full bg-primary border border-neutral/10 rounded-xl py-3 px-4 text-sm font-label outline-none focus:ring-1 focus:ring-accent/20 transition-all disabled:opacity-50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-label uppercase tracking-widest text-neutral">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                    disabled={isSubmitting}
                    className="w-full bg-primary border border-neutral/10 rounded-xl py-3 px-4 text-sm font-label outline-none focus:ring-1 focus:ring-accent/20 transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-label uppercase tracking-widest text-neutral">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    disabled={isSubmitting}
                    className="w-full bg-primary border border-neutral/10 rounded-xl py-3 px-4 text-sm font-label outline-none focus:ring-1 focus:ring-accent/20 transition-all disabled:opacity-50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-label uppercase tracking-widest text-neutral">Subject *</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full bg-primary border border-neutral/10 rounded-xl py-3 px-4 text-sm font-label outline-none focus:ring-1 focus:ring-accent/20 transition-all appearance-none cursor-pointer disabled:opacity-50"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Commission Request">Commission Request</option>
                    <option value="Purchase Request">Purchase Request</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-label uppercase tracking-widest text-neutral">Message *</label>
                <textarea
                  rows={6}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project or inquiry..."
                  required
                  disabled={isSubmitting}
                  className="w-full bg-primary border border-neutral/10 rounded-xl py-3 px-4 text-sm font-label outline-none focus:ring-1 focus:ring-accent/20 transition-all resize-none disabled:opacity-50"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !isFormValid}
                className="w-full bg-accent text-primary py-4 rounded-xl font-label text-sm uppercase tracking-widest hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:opacity-40"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <span>Send Message</span>
                )}
              </button>
            </form>
          </div>

          {/* Contact Details & Image */}
          <div className="space-y-8 lg:space-y-12 animate-in slide-in-from-bottom-8 duration-700">
            <div className="hidden lg:block relative h-96 w-full rounded-3xl overflow-hidden shadow-sm border border-neutral/10">
              <Image
                src="/images/contact-hero.png"
                alt="Studio Detail"
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-sm font-label uppercase tracking-widest text-neutral flex items-center gap-2 font-semibold">
                  <MapPin size={14} /> My Space
                </h3>
                <p className="text-sm text-accent/80 leading-relaxed font-label">
                  Based in India<br />
                  Digital & Traditional Art Enthusiast
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-label uppercase tracking-widest text-neutral flex items-center gap-2 font-semibold">
                  <Mail size={14} /> Let’s Connect
                </h3>
                <p className="text-sm text-accent/80 font-label">
                  rs.artelier3@gmail.com<br />
                  Instagram: @rs.artelier
                </p>
              </div>
            </div>

            <div className="pt-8 border-t border-neutral/10">
              <h3 className="text-xs font-label uppercase tracking-widest text-neutral mb-6 font-semibold">Find Me Online</h3>
              <div className="flex gap-6">
                <a href="https://www.instagram.com/rs.artelier" target="_blank" rel="noopener noreferrer" className="text-neutral hover:text-accent transition-colors flex items-center gap-2 text-xs font-label uppercase tracking-widest">
                  <Globe size={16} /> @rs.artelier
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
