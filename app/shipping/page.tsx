import PageHeader from "@/components/common/PageHeader";

export default function ShippingPage() {
  return (
    <main className="bg-zinc-50 dark:bg-zinc-950 pb-16">
      <PageHeader title="Shipping & Delivery Policy" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 text-zinc-800 dark:text-zinc-200">
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-brand-green">Order Processing</h2>
            <p className="leading-relaxed">Orders are typically processed within 1–2 business days, subject to product availability.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-brand-green">Delivery Timeline</h2>
            <p className="leading-relaxed mb-4">Estimated delivery time:</p>
            <ul className="list-disc pl-6 space-y-2 leading-relaxed mb-4">
              <li>Tamil Nadu: 1–3 Business Days</li>
              <li>South India: 2–5 Business Days</li>
              <li>Rest of India: 3–7 Business Days</li>
            </ul>
            <p className="leading-relaxed">Delivery timelines may vary depending on location, courier availability, weather conditions, or public holidays.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-brand-green">Shipping Charges</h2>
            <p className="leading-relaxed">Shipping charges, if applicable, will be displayed during checkout before payment.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-brand-green">Delivery Partners</h2>
            <p className="leading-relaxed">Orders are shipped through trusted logistics partners to ensure timely and safe delivery.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-brand-green">Order Tracking</h2>
            <p className="leading-relaxed">Customers will receive shipment tracking details via SMS, WhatsApp, or email once the order has been dispatched.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-brand-green">Delivery Delays</h2>
            <p className="leading-relaxed">While we strive to deliver on time, Kiddos Foods shall not be responsible for delays caused by courier partners or unforeseen circumstances beyond our control.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
