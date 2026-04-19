// app/contact/page.tsx
'use client';

import { useState } from 'react';

type FormFields = {
  name: string;
  email: string;
  phone: string;
  comment: string;
};

type FormErrors = Partial<FormFields>;

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone: string): boolean {
  return /^\(\d{3}\)-\d{3}-\d{4}$|^\d{10}$/.test(phone.trim());
}

function validate(fields: FormFields): FormErrors {
  const errs: FormErrors = {};
  if (!fields.name.trim()) errs.name = 'Name is required.';
  if (!fields.email.trim()) {
    errs.email = 'Email is required.';
  } else if (!validateEmail(fields.email)) {
    errs.email = 'Please enter a valid email (e.g. jane@example.com).';
  }
  if (fields.phone && !validatePhone(fields.phone)) {
    errs.phone = 'Please enter a valid phone number — (925)-555-0101 or 9255550101.';
  }
  if (!fields.comment.trim()) errs.comment = 'Please leave a comment.';
  return errs;
}

export default function ContactPage() {
  const [form, setForm] = useState<FormFields>({
    name: '',
    email: '',
    phone: '',
    comment: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormFields, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    setForm(updated);
    if (touched[e.target.name as keyof FormFields]) {
      setErrors(validate(updated));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const field = e.target.name as keyof FormFields;
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate(form));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, phone: true, comment: true });
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitted(true);
  };

  const inputClass = (field: keyof FormFields) =>
    `border rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition w-full ${
      touched[field] && errors[field]
        ? 'border-red-400 focus:ring-red-400 bg-red-50'
        : 'border-gray-200 focus:ring-blue-500'
    }`;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
          Contact Us
        </h1>
        <p className="text-lg text-gray-600">
          We&apos;d love to hear from you. Fill out the form and we&apos;ll be in touch.
        </p>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-xl">
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <span className="text-3xl">✅</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Message Sent!
            </h2>
            <p className="text-gray-600 mb-6">
              Thanks, {form.name}. We&apos;ll get back to you at {form.email} shortly.
            </p>
            <button
              onClick={() => {
                setForm({ name: '', email: '', phone: '', comment: '' });
                setErrors({});
                setTouched({});
                setSubmitted(false);
              }}
              className="px-5 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            {/* Name */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-tight">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Jane Smith"
                className={inputClass('name')}
              />
              {touched.name && errors.name && (
                <p className="text-red-500 text-xs mt-0.5">⚠ {errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-tight">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="jane@example.com"
                className={inputClass('email')}
              />
              {touched.email && errors.email && (
                <p className="text-red-500 text-xs mt-0.5">⚠ {errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-tight">
                Phone Number{' '}
                <span className="text-gray-400 normal-case font-normal tracking-normal">
                  (optional)
                </span>
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="(925)-555-0101 or 9255550101"
                className={inputClass('phone')}
              />
              {touched.phone && errors.phone && (
                <p className="text-red-500 text-xs mt-0.5">⚠ {errors.phone}</p>
              )}
            </div>

            {/* Comment */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-tight">
                Comment
              </label>
              <textarea
                name="comment"
                value={form.comment}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={5}
                placeholder="How can we help you?"
                className={inputClass('comment')}
              />
              {touched.comment && errors.comment && (
                <p className="text-red-500 text-xs mt-0.5">⚠ {errors.comment}</p>
              )}
            </div>

            <div className="pt-2 border-t border-gray-50">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 text-white text-sm font-bold uppercase tracking-widest hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-200"
              >
                Send Message →
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}