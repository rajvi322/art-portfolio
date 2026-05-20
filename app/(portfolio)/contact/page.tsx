"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Mail,
  MapPin,
  Share2,
  MessageSquare,
  Check,
  AlertCircle,
} from "lucide-react";

const InstagramIcon = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const YoutubeIcon = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);
const PinterestIcon = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.168 0 7.41 2.967 7.41 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.366 18.625 0 12.017 0z" />
  </svg>
);

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
    website_url: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {
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
          website_url: "",
        });
      } else {
        setSubmitStatus("error");
        setErrorMessage(
          data.error || "Failed to submit your message. Please try again.",
        );
      }
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus("error");
      setErrorMessage(
        "An unexpected error occurred. Please check your network and try again.",
      );
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
        <h1 className="text-4xl md:text-6xl font-headline text-accent mb-3 italic">
          Get in Touch
        </h1>
        <p className="text-text-muted font-label uppercase tracking-widest text-xs md:text-sm max-w-lg mx-auto">
          If you’d like to connect, talk about art, or just say hello, feel free
          to reach out.
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
                  <span>
                    Your message has been sent successfully! We'll get back to
                    you shortly.
                  </span>
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
                  <label className="text-xs font-label uppercase tracking-widest text-neutral">
                    Full Name *
                  </label>
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
                  <label className="text-xs font-label uppercase tracking-widest text-neutral">
                    Email Address *
                  </label>
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
                  <label className="text-xs font-label uppercase tracking-widest text-neutral">
                    Phone Number
                  </label>
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
                  <label className="text-xs font-label uppercase tracking-widest text-neutral">
                    Subject *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full bg-primary border border-neutral/10 rounded-xl py-3 px-4 text-sm font-label outline-none focus:ring-1 focus:ring-accent/20 transition-all appearance-none cursor-pointer disabled:opacity-50"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Commission Request">
                      Commission Request
                    </option>
                    <option value="Purchase Request">Purchase Request</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-label uppercase tracking-widest text-neutral">
                  Message *
                </label>
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

              {/* Honeypot field - positioned off-screen to trick bots but not be display: none */}
              <div
                className="absolute opacity-0 -z-50 h-0 w-0 overflow-hidden pointer-events-none"
                aria-hidden="true"
              >
                <label className="text-xs">Website</label>
                <input
                  type="text"
                  name="website_url"
                  value={formData.website_url}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                />
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
                  Based in India
                  <br />
                  Digital & Traditional Art Enthusiast
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-label uppercase tracking-widest text-neutral flex items-center gap-2 font-semibold">
                  <Mail size={14} /> Let’s Connect
                </h3>
                <p className="text-sm text-accent/80 font-label">
                  rs.artelier3@gmail.com
                </p>
              </div>
            </div>

            <div className="pt-8 border-t border-neutral/10">
              <h3 className="text-xs font-label uppercase tracking-widest text-neutral mb-6 font-semibold">
                Find Me Online
              </h3>
              <div className="flex flex-wrap gap-6">
                <a
                  href="https://www.instagram.com/rs.artelier"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral hover:text-accent transition-colors flex items-center gap-2 text-xs font-label uppercase tracking-widest"
                >
                  <InstagramIcon size={16} /> Instagram
                </a>
                <a
                  href="https://youtube.com/@rsartelier?si=dm6fW_vYEbb6sjMS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral hover:text-accent transition-colors flex items-center gap-2 text-xs font-label uppercase tracking-widest"
                >
                  <YoutubeIcon size={16} /> YouTube
                </a>
                <a
                  href="https://pin.it/4VZ7pX357"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral hover:text-accent transition-colors flex items-center gap-2 text-xs font-label uppercase tracking-widest"
                >
                  <PinterestIcon size={16} /> Pinterest
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
