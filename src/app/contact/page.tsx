import { Metadata } from "next";
import { Mail, MessageSquare, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | InsightCalculator",
  description: "Get in touch with InsightCalculator. We'd love to hear from you.",
};

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-3xl px-4 py-20 lg:px-8">
          <h1 className="mb-4 text-4xl font-bold lg:text-5xl">Contact Us</h1>
          <p className="text-lg text-muted-foreground">
            We'd love to hear from you. Get in touch with our team today.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
        {/* Contact Methods */}
        <section className="mb-16">
          <h2 className="mb-8 text-2xl font-bold">Get In Touch</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Email */}
            <div className="rounded-lg border border-border bg-card p-8 text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Mail className="h-6 w-6" />
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold">Email</h3>
              <p className="mb-4 text-sm text-muted-foreground">Send us your message anytime</p>
              <a href="mailto:support@insightcalculator.com" className="text-primary hover:underline">
                support@insightcalculator.com
              </a>
            </div>

            {/* Support */}
            <div className="rounded-lg border border-border bg-card p-8 text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MessageSquare className="h-6 w-6" />
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold">Support</h3>
              <p className="mb-4 text-sm text-muted-foreground">Help with calculator features</p>
              <a href="mailto:help@insightcalculator.com" className="text-primary hover:underline">
                help@insightcalculator.com
              </a>
            </div>

            {/* Feedback */}
            <div className="rounded-lg border border-border bg-card p-8 text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Globe className="h-6 w-6" />
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold">Feedback</h3>
              <p className="mb-4 text-sm text-muted-foreground">Share your suggestions</p>
              <a href="mailto:feedback@insightcalculator.com" className="text-primary hover:underline">
                feedback@insightcalculator.com
              </a>
            </div>
          </div>
        </section>

        {/* Response Time */}
        <section className="mb-16 rounded-lg border border-border bg-card p-8">
          <h2 className="mb-4 text-xl font-bold">Response Time</h2>
          <p className="text-muted-foreground leading-relaxed">
            We appreciate all inquiries and try to respond to messages within 24-48 hours during business days. For urgent matters, please mark your email as urgent and we'll prioritize accordingly.
          </p>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="mb-8 text-2xl font-bold">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 font-semibold">Are your calculators accurate?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, all our calculators are based on validated engineering formulas and industry standards. However, we recommend verifying critical calculations independently, especially for professional applications.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Do you store my data?</h3>
              <p className="text-sm text-muted-foreground">
                No, your calculation inputs are processed locally on your device. We do not store this data on our servers unless you explicitly save results. See our Privacy Policy for more details.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Can I use these calculators offline?</h3>
              <p className="text-sm text-muted-foreground">
                Currently, our calculators require an internet connection. However, you can save your results and export them for offline reference.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">How often are calculators updated?</h3>
              <p className="text-sm text-muted-foreground">
                We continuously review and update our calculators to reflect the latest engineering standards and best practices. Major updates are announced on our website.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Can I request a new calculator?</h3>
              <p className="text-sm text-muted-foreground">
                Absolutely! We love hearing feature requests. Please send your suggestions to <a href="mailto:feedback@insightcalculator.com" className="text-primary hover:underline">feedback@insightcalculator.com</a>.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Is there an API available?</h3>
              <p className="text-sm text-muted-foreground">
                We're exploring API options for enterprise users. Please contact our team at <a href="mailto:support@insightcalculator.com" className="text-primary hover:underline">support@insightcalculator.com</a> to discuss your needs.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
