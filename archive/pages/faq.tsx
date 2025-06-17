import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

type FAQ = {
  question: string;
  answer: string;
};

type FAQGroup = {
  title: string;
  faqs: FAQ[];
};

const faqSections: FAQGroup[] = [
  {
    title: "🌸 Sacred Purpose & Philosophy",
    faqs: [
      {
        question: "What is PromptFlora?",
        answer: "PromptFlora is a sacred digital ecosystem for real-time gifting, ceremony hosting, and intentional participation through portals and projects."
      },
      {
        question: "What makes PromptFlora different from GoFundMe or Patreon?",
        answer: "PromptFlora is not about fundraising or subscriptions. It's about unconditional giving, energetic alignment, and sacred witnessing."
      },
      {
        question: "Is this a religion, a community, or a tech platform?",
        answer: "None and all. It’s a relational field that holds portals of presence. It’s not dogmatic or transactional. It’s ritual tech."
      }
    ]
  },
  {
    title: "💮 How Gifting Works",
    faqs: [
      {
        question: "How do I send a gift?",
        answer: "Go to a gifting altar, select a tier, and scan the QR code using a Lightning-enabled wallet. No login required."
      },
      {
        question: "Can I gift anonymously?",
        answer: "Yes. You are never required to create an account to give. Gifting is always open."
      },
      {
        question: "What is a Lightning invoice?",
        answer: "A time-limited payment link from the Bitcoin Lightning Network. It allows sacred microgifting with low fees and no middleman."
      }
    ]
  },
  {
    title: "🌾 Portals & Receiving",
    faqs: [
      {
        question: "How do I open a portal?",
        answer: "Register, choose your archetype, and create a project, session, or event. Once your portal blooms, it can receive gifts."
      },
      {
        question: "What’s the difference between a project, session, and event?",
        answer: "A project is ongoing. A session is intimate and rhythmic. An event is time-bound and ceremonial."
      },
      {
        question: "Can I edit or remove my portal?",
        answer: "Yes. You can manage all portals from your dashboard."
      }
    ]
  },
  {
    title: "🧘 Witnessing & Observing",
    faqs: [
      {
        question: "Do I need an account to explore?",
        answer: "No. The garden is open. You can wander, observe, and bear witness without logging in."
      },
      {
        question: "What is the Sacred Thread?",
        answer: "The Thread is a public scroll of reflections, offerings, and sacred moments shared by the community."
      }
    ]
  },
  {
    title: "🔐 Boundaries & Safety",
    faqs: [
      {
        question: "Is my data private?",
        answer: "Yes. We collect minimal data and never sell it. See the Privacy page for full clarity."
      },
      {
        question: "Why use Bitcoin Lightning?",
        answer: "It allows decentralized, borderless gifting without surveillance or delay."
      },
      {
        question: "Can I delete my data?",
        answer: "Yes. Email bugs@promptflora.org and we’ll erase your imprint."
      }
    ]
  }
];

export default function FAQPage() {
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const toggle = (question: string) => {
    setOpenQuestion(openQuestion === question ? null : question);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-pink-50 to-lilac-50 text-purple-800 px-6 py-16 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto space-y-10"
      >
        <h1 className="text-4xl font-extrabold text-center">🌼 Frequently Asked Questions</h1>
        {faqSections.map((section) => (
          <div key={section.title}>
            <h2 className="text-2xl font-semibold text-purple-600 mb-4">{section.title}</h2>
            <div className="space-y-4">
              {section.faqs.map(({ question, answer }) => (
                <div key={question} className="border-b border-purple-200 pb-2">
                  <button
                    onClick={() => toggle(question)}
                    className="w-full text-left font-medium text-purple-700 hover:text-purple-900 transition"
                  >
                    {question}
                  </button>
                  {openQuestion === question && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-2 text-purple-600"
                    >
                      {answer}
                    </motion.p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="text-center mt-12">
          <Link href="/" className="inline-block px-6 py-3 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-lg transition">
            Return to Garden
          </Link>
        </div>
      </motion.div>
    </div>
  );
}