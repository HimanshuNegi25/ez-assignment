import React, { useMemo, useState } from "react";

const API_URL = "https://vernanbackend.ezlab.in/api/contact-us/";

function isValidEmail(email) {
  // Simple RFC 5322-inspired pattern good enough for UI validation
  return /[^\s@]+@[^\s@]+\.[^\s@]+/.test(String(email).toLowerCase());
}

export default function App() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState({});
  const [statusText, setStatusText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormCompletelyEmpty = useMemo(() => {
    return Object.values(form).every((v) => !String(v || "").trim());
  }, [form]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function validate() {
    const nextErrors = {};

    // Empty form submission is not allowed
    if (isFormCompletelyEmpty) {
      nextErrors.form = "Please fill at least the email field.";
    }

    // Email validation at frontend (email is required by spec)
    if (!form.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!isValidEmail(form.email)) {
      nextErrors.email = "Enter a valid email";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatusText("");
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim(),
          // Backend appears to accept these optional fields too
          name: form.name.trim() || undefined,
          phone: form.phone.trim() || undefined,
          message: form.message.trim() || undefined,
        }),
      });

      if (response.ok) {
        // As per use case: show "Form Submitted" in the text field
        setStatusText("Form Submitted");
        // Optional: keep inputs for user reference, or clear them
        // setForm({ name: "", email: "", phone: "", message: "" });
        setErrors({});
      } else {
        const text = await response.text();
        setStatusText("Submission failed");
        setErrors((e) => ({ ...e, form: text || "Something went wrong" }));
      }
    } catch (err) {
      setStatusText("Submission failed");
      setErrors((e) => ({ ...e, form: err.message || "Network error" }));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="page">
      <header className="header">
        <div className="brand">EZ Labs</div>
        <nav className="nav">
          <a href="#home" className="nav-link">Home</a>
          <a href="#contact" className="nav-link">Contact</a>
        </nav>
      </header>

      <main className="main" id="home">
        <section className="hero">
          <div className="hero-content">
            <h1 className="hero-title">Get in touch</h1>
            <p className="hero-subtitle">
              We'd love to hear from you. Fill the form and we'll get back soon.
            </p>
          </div>
        </section>

        <section className="form-section" id="contact">
          <div className="card">
            <h2 className="card-title">Contact Us</h2>
            <p className="card-subtitle">Send us your query and contact details</p>

            {errors.form && <div className="alert alert-error">{errors.form}</div>}

            <form onSubmit={handleSubmit} noValidate>
              <div className="grid">
                <div className="field">
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                  />
                </div>

                <div className="field">
                  <label htmlFor="email">Email<span className="req">*</span></label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    required
                  />
                  {errors.email && (
                    <div className="field-error" id="email-error">{errors.email}</div>
                  )}
                </div>

                <div className="field">
                  <label htmlFor="phone">Phone</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="e.g. +1 555 123 4567"
                    value={form.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                  />
                </div>

                <div className="field field--full">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Write your message..."
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="actions">
                <button className="btn" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>

                {/* Status text field as per requirement */}
                <input
                  className="status-field"
                  type="text"
                  value={statusText}
                  onChange={() => {}}
                  readOnly
                  placeholder="Status will appear here"
                  aria-live="polite"
                />
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer className="footer">© {new Date().getFullYear()} EZ Labs</footer>
    </div>
  );
}


