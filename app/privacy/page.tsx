import PageHeader from "@/components/common/PageHeader";

export default function PrivacyPage() {
  return (
    <main className="bg-zinc-50 dark:bg-zinc-950 pb-16">
      <PageHeader title="Privacy Policy" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 text-zinc-800 dark:text-zinc-200">
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-brand-green">Information We Collect</h2>
            <p className="leading-relaxed mb-4">We may collect:</p>
            <ul className="list-disc pl-6 space-y-2 leading-relaxed">
              <li>Name</li>
              <li>Mobile Number</li>
              <li>Email Address</li>
              <li>Shipping Address</li>
              <li>Billing Address</li>
              <li>Payment Information (processed securely through payment gateways)</li>
              <li>Website usage information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-brand-green">How We Use Your Information</h2>
            <p className="leading-relaxed mb-4">Your information is used to:</p>
            <ul className="list-disc pl-6 space-y-2 leading-relaxed">
              <li>Process orders</li>
              <li>Deliver products</li>
              <li>Provide customer support</li>
              <li>Improve our services</li>
              <li>Send order updates</li>
              <li>Share promotional offers (only if you have opted in)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-brand-green">Data Security</h2>
            <p className="leading-relaxed">We implement appropriate security measures to protect your personal information against unauthorized access, disclosure, or misuse.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-brand-green">Third-Party Services</h2>
            <p className="leading-relaxed">We may use trusted third-party service providers such as payment gateways, logistics partners, and analytics providers to operate our business.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-brand-green">Cookies</h2>
            <p className="leading-relaxed">Our website may use cookies to improve your browsing experience and enhance website functionality.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-brand-green">Your Rights</h2>
            <p className="leading-relaxed">You may request access, correction, or deletion of your personal information by contacting us.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-brand-green">Contact</h2>
            <p className="leading-relaxed">For privacy-related concerns, please contact:</p>
            <p className="leading-relaxed mt-2">Email: <a href="mailto:care@kiddosfoods.com" className="text-brand-green hover:underline">care@kiddosfoods.com</a></p>
          </section>
        </div>
      </div>
    </main>
  );
}
