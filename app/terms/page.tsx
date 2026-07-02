import PageHeader from "@/components/common/PageHeader";

export default function TermsPage() {
  return (
    <main className="bg-zinc-50 dark:bg-zinc-950 pb-16">
      <PageHeader title="Terms & Conditions" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 text-zinc-800 dark:text-zinc-200">
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-brand-green">1. Acceptance of Terms</h2>
            <p className="leading-relaxed">Welcome to Kiddos Foods. By accessing or using our website, you agree to comply with these Terms & Conditions. If you do not agree, please refrain from using our website.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-brand-green">2. Products</h2>
            <p className="leading-relaxed">We strive to provide accurate product descriptions, images, and pricing. However, minor variations in packaging, colour, weight, or appearance may occur.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-brand-green">3. Pricing</h2>
            <ul className="list-disc pl-6 space-y-2 leading-relaxed">
              <li>All prices are displayed in Indian Rupees (₹).</li>
              <li>Prices are subject to change without prior notice.</li>
              <li>Applicable taxes will be charged as per government regulations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-brand-green">4. Orders</h2>
            <p className="leading-relaxed">Kiddos Foods reserves the right to accept or reject any order due to stock availability, payment issues, or any other valid reason.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-brand-green">5. Payments</h2>
            <p className="leading-relaxed">We accept secure online payments through approved payment gateways. Kiddos Foods does not store your payment details.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-brand-green">6. Intellectual Property</h2>
            <p className="leading-relaxed">All website content, including text, graphics, logos, images, videos, and designs, is the property of Kiddos Foods and may not be copied or reproduced without written permission.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-brand-green">7. Limitation of Liability</h2>
            <p className="leading-relaxed">Kiddos Foods shall not be liable for indirect, incidental, or consequential damages arising from the use of our website or products.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-brand-green">8. Governing Law</h2>
            <p className="leading-relaxed">These Terms & Conditions shall be governed by the laws of India. Any disputes shall be subject to the jurisdiction of the courts in Coimbatore, Tamil Nadu.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
