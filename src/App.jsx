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
      {/* Decorative Mandala Patterns */}
      <div className="mandala mandala-top-right"></div>
      <div className="mandala mandala-bottom-left"></div>

      <header className="header">
        <div className="brand">
          <span className="brand-checkmark">✓</span>
          <span className="brand-text">Films</span>
        </div>
        <button className="menu-toggle" aria-label="Menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>

      <main className="main">
        <div className="content-wrapper">
          {/* Left Section - Informational Text */}
          <section className="info-section">
            <div className="info-content">
              <p className="info-text">
                Whether you have an idea, a question, or simply want to explore how V can work together, V're just a message away.
              </p>
              <p className="info-text">Let's catch up over coffee.</p>
              <p className="info-quote">Great stories always begin with a good conversation</p>
            </div>
          </section>

          {/* Right Section - Contact Form */}
          <section className="form-section">
            <div className="form-container">
              <h2 className="form-title">Join the Story</h2>
              <p className="form-subtitle">Ready to bring your vision to life? Let's talk.</p>

              {errors.form && <div className="alert alert-error">{errors.form}</div>}

              <form onSubmit={handleSubmit} noValidate>
                <div className="form-fields">
                  <div className="field">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Your name*"
                      value={form.name}
                      onChange={handleChange}
                      autoComplete="name"
                    />
                  </div>

                  <div className="field">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Your email*"
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
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Phone"
                      value={form.phone}
                      onChange={handleChange}
                      autoComplete="tel"
                    />
                  </div>

                  <div className="field">
                    <textarea
                      id="message"
                      name="message"
                      placeholder="Your message*"
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

              <div className="contact-info">
                <span className="contact-email">vernita@varnanfilms.co.in</span>
                <span className="contact-separator">|</span>
                <span className="contact-phone">+91 98736 84567</span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}


