import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | InsightCalculator",
  description: "Read the Terms & Conditions for using InsightCalculator.",
};

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-3xl px-4 py-20 lg:px-8">
          <h1 className="mb-4 text-4xl font-bold lg:text-5xl">Terms & Conditions</h1>
          <p className="text-muted-foreground">Last updated: March 2026</p>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 py-16 lg:px-8 space-y-8">
        {/* Agreement to Terms */}
        <section>
          <h2 className="mb-4 text-2xl font-bold">Agreement to Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            By accessing and using InsightCalculator, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>
        </section>

        {/* Use License */}
        <section>
          <h2 className="mb-4 text-2xl font-bold">Use License</h2>
          <p className="mb-4 text-muted-foreground leading-relaxed">
            Permission is granted to temporarily download one copy of the materials (information or software) on InsightCalculator for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="space-y-2 text-muted-foreground mb-4">
            <li>• Modify or copy the materials</li>
            <li>• Use the materials for any commercial purpose or for any public display</li>
            <li>• Attempt to decompile or reverse engineer any software</li>
            <li>• Remove any copyright or other proprietary notations from the materials</li>
            <li>• Transfer the materials to another person or "mirror" the materials on any other server</li>
            <li>• Interfere with or disrupt the normal flow of dialog within InsightCalculator</li>
          </ul>
        </section>

        {/* Disclaimer of Warranties */}
        <section>
          <h2 className="mb-4 text-2xl font-bold">Disclaimer of Warranties</h2>
          <p className="text-muted-foreground leading-relaxed">
            The materials on InsightCalculator are provided on an 'as is' basis. InsightCalculator makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
        </section>

        {/* Limitations of Liability */}
        <section>
          <h2 className="mb-4 text-2xl font-bold">Limitations of Liability</h2>
          <p className="text-muted-foreground leading-relaxed">
            In no event shall InsightCalculator or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on InsightCalculator, even if InsightCalculator or an authorized representative has been notified orally or in writing of the possibility of such damage.
          </p>
        </section>

        {/* Accuracy of Materials */}
        <section>
          <h2 className="mb-4 text-2xl font-bold">Accuracy of Materials</h2>
          <p className="text-muted-foreground leading-relaxed">
            The materials appearing on InsightCalculator could include technical, typographical, or photographic errors. InsightCalculator does not warrant that any of the materials on the website are accurate, complete, or current. While we strive to provide accurate calculators based on engineering standards, we do not guarantee absolute precision for all use cases. Users should verify critical calculations independently.
          </p>
        </section>

        {/* Materials License */}
        <section>
          <h2 className="mb-4 text-2xl font-bold">License and Site Access</h2>
          <p className="text-muted-foreground leading-relaxed">
            InsightCalculator grants you a limited license to access and use the website. This license does not include the right to:
          </p>
          <ul className="space-y-2 text-muted-foreground mt-4">
            <li>• Download (other than page caching) any portion of the site without permission</li>
            <li>• Use any data mining, robots, or similar data gathering and extraction tools</li>
            <li>• Frame or utilize framing techniques to enclose any trademark, logo, or other proprietary information</li>
            <li>• Misrepresent affiliation with InsightCalculator</li>
          </ul>
        </section>

        {/* Modifications to Service */}
        <section>
          <h2 className="mb-4 text-2xl font-bold">Modifications to Service</h2>
          <p className="text-muted-foreground leading-relaxed">
            InsightCalculator may revise these terms of service for the website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
          </p>
        </section>

        {/* Governing Law */}
        <section>
          <h2 className="mb-4 text-2xl font-bold">Governing Law</h2>
          <p className="text-muted-foreground leading-relaxed">
            These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which InsightCalculator operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
          </p>
        </section>

        {/* User Responsibilities */}
        <section>
          <h2 className="mb-4 text-2xl font-bold">User Responsibilities</h2>
          <p className="text-muted-foreground leading-relaxed">
            You agree to use InsightCalculator only for lawful purposes and in a way that does not infringe upon the rights of others or restrict their use and enjoyment of the website. Prohibited behavior includes:
          </p>
          <ul className="space-y-2 text-muted-foreground mt-4">
            <li>• Any illegal activity or promoting illegal activities</li>
            <li>• Attempting to gain unauthorized access to our systems</li>
            <li>• Transmitting harmful code or disrupting normal functionality</li>
            <li>• Harassment or abuse of other users</li>
          </ul>
        </section>

        {/* Contact for Questions */}
        <section>
          <h2 className="mb-4 text-2xl font-bold">Contact Us</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you have any questions about these Terms & Conditions, please contact us at <a href="mailto:legal@insightcalculator.com" className="text-primary hover:underline">legal@insightcalculator.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
