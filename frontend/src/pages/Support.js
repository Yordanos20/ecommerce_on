// frontend/src/pages/Support.js
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import api from "../services/api";

export default function Support() {
  const { user } = useContext(AuthContext);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [openSections, setOpenSections] = useState({}); // for accordion

  if (!user)
    return <p className="p-6 text-center">Please log in to access support.</p>;

  const knowledgeBase = [
    { title: "How to return a product", content: "Step by step guide to return your product..." },
    { title: "How to track your order", content: "Track your order using your account dashboard..." },
    { title: "Payment and refund issues", content: "Common payment and refund questions answered..." },
    { title: "Account management", content: "How to reset password, change email, update profile..." },
  ];

  const faq = [
    { question: "How long does shipping take?", answer: "Shipping usually takes 3-7 business days." },
    { question: "Can I change my order after placing it?", answer: "You can update your order within 1 hour of placing it." },
    { question: "How do I reset my password?", answer: "Use the 'Forgot Password' link on the login page." },
  ];

  const privacyLegal = [
    { title: "Privacy Policy", content: "This is your Privacy Policy content. Explain how user data is collected, stored, and used." },
    { title: "Terms of Service", content: "This is your Terms of Service content. Explain rules, user rights, and responsibilities." },
  ];

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      toast.error("Subject and message are required");
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post("/support", { subject, message });
      setSubject("");
      setMessage("");
      toast.success("Support ticket submitted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit ticket");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Support Center</h1>

      {/* Knowledge Base */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Help Center / Knowledge Base</h2>
        <div className="flex flex-col gap-2">
          {knowledgeBase.map((item, idx) => (
            <div key={idx} className="border rounded shadow-sm hover:shadow-lg transition-all duration-200 bg-blue-50">
              <button
                onClick={() => toggleSection(`kb-${idx}`)}
                className="w-full text-left p-3 font-medium flex justify-between items-center hover:bg-blue-100"
              >
                {item.title}
                <span>{openSections[`kb-${idx}`] ? "▲" : "▼"}</span>
              </button>
              {openSections[`kb-${idx}`] && (
                <div className="p-3 text-gray-700 border-t bg-white">{item.content}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">FAQ</h2>
        <div className="flex flex-col gap-2">
          {faq.map((q, idx) => (
            <div key={idx} className="border rounded shadow-sm hover:shadow-lg transition-all duration-200 bg-green-50">
              <button
                onClick={() => toggleSection(`faq-${idx}`)}
                className="w-full text-left p-3 font-medium flex justify-between items-center hover:bg-green-100"
              >
                {q.question}
                <span>{openSections[`faq-${idx}`] ? "▲" : "▼"}</span>
              </button>
              {openSections[`faq-${idx}`] && (
                <div className="p-3 text-gray-700 border-t bg-white">{q.answer}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Submit Ticket */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Contact Support / Open a Ticket</h2>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {submitting ? "Submitting..." : "Submit Ticket"}
          </button>
        </form>
      </section>

      {/* Privacy & Legal */}
      <section>
        <h2 className="text-2xl font-semibold mb-2">Privacy & Legal</h2>
        <div className="flex flex-col gap-2">
          {privacyLegal.map((item, idx) => (
            <div key={idx} className="border rounded shadow-sm hover:shadow-lg transition-all duration-200 bg-purple-50">
              <button
                onClick={() => toggleSection(`privacy-${idx}`)}
                className="w-full text-left p-3 font-medium flex justify-between items-center hover:bg-purple-100"
              >
                {item.title}
                <span>{openSections[`privacy-${idx}`] ? "▲" : "▼"}</span>
              </button>
              {openSections[`privacy-${idx}`] && (
                <div className="p-3 text-gray-700 border-t bg-white">{item.content}</div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}