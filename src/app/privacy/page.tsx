import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | InsightCalculator",
  description: "Learn how InsightCalculator protects your privacy and data.",
};

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-3xl px-4 py-20 lg:px-8">
          <h1 className="mb-4 text-4xl font-bold lg:text-5xl">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: March 2026</p>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 py-16 lg:px-8 space-y-8">
        {/* Introduction */}
        <section>
          <h2 className="mb-4 text-2xl font-bold">Introduction</h2>
          <p className="text-muted-foreground leading-relaxed">
            InsightCalculator ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
          </p>
        </section>

        {/* Information We Collect */}
        <section>
          <h2 className="mb-4 text-2xl font-bold">Information We Collect</h2>
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 font-semibold">Non-Personal Information</h3>
              <p className="text-muted-foreground leading-relaxed">
                We may collect non-identifying information about you such as browser type, device type, operating system, referring URLs, and pages visited. This helps us understand how users interact with our site.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Calculation Data</h3>
              <p className="text-muted-foreground leading-relaxed">
                The values you enter into our calculators are processed locally on your device and are not stored on our servers unless you explicitly choose to save results.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Cookies</h3>
              <p className="text-muted-foreground leading-relaxed">
                We use cookies to remember your preferences, such as favorite calculators and display settings. You can control cookie settings through your browser.
              </p>
            </div>
          </div>
        </section>

        {/* How We Use Your Information */}
        <section>
          <h2 className="mb-4 text-2xl font-bold">How We Use Your Information</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Improve and optimize our website and calculator tools</li>
            <li>• Understand user preferences and behavior patterns</li>
            <li>• Provide technical support and troubleshoot issues</li>
            <li>• Monitor and prevent fraudulent activity</li>
            <li>• Send service-related announcements and updates</li>
          </ul>
        </section>

        {/* Data Security */}
        <section>
          <h2 className="mb-4 text-2xl font-bold">Data Security</h2>
          <p className="text-muted-foreground leading-relaxed">
            We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet is completely secure. While we strive to use commercially acceptable means to protect your data, we cannot guarantee absolute security.
          </p>
        </section>

        {/* Third-Party Links */}
        <section>
          <h2 className="mb-4 text-2xl font-bold">Third-Party Links</h2>
          <p className="text-muted-foreground leading-relaxed">
            Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review their privacy policies when visiting.
          </p>
        </section>

        {/* Your Rights */}
        <section>
          <h2 className="mb-4 text-2xl font-bold">Your Rights</h2>
          <p className="mb-4 text-muted-foreground leading-relaxed">
            You have the right to request access to, correct, or delete your personal information. To exercise these rights, please contact us using the information provided in the Contact section.
          </p>
        </section>

        {/* Children's Privacy */}
        <section>
          <h2 className="mb-4 text-2xl font-bold">Children's Privacy</h2>
          <p className="text-muted-foreground leading-relaxed">
            InsightCalculator does not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it promptly.
          </p>
        </section>

        {/* Changes to Privacy Policy */}
        <section>
          <h2 className="mb-4 text-2xl font-bold">Changes to This Policy</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on our website and updating the "Last updated" date.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="mb-4 text-2xl font-bold">Contact Us</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you have questions about this Privacy Policy or our privacy practices, please contact us at <a href="mailto:privacy@insightcalculator.com" className="text-primary hover:underline">privacy@insightcalculator.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
