import PageHeader from "@/components/common/PageHeader";

export default function ReturnsPage() {
  return (
    <main className="bg-zinc-50 dark:bg-zinc-950 pb-16">
      <PageHeader title="Return & Refund Policy" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 text-zinc-800 dark:text-zinc-200">
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-brand-green">Returns</h2>
            <p className="leading-relaxed">Due to the perishable nature of many food products, returns are generally not accepted once products have been delivered.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-brand-green">Damaged or Incorrect Products</h2>
            <p className="leading-relaxed mb-4">If you receive:</p>
            <ul className="list-disc pl-6 space-y-2 leading-relaxed mb-4">
              <li>Damaged products</li>
              <li>Incorrect products</li>
              <li>Missing items</li>
            </ul>
            <p className="leading-relaxed mb-4">Please contact us within 24 hours of delivery with:</p>
            <ul className="list-disc pl-6 space-y-2 leading-relaxed">
              <li>Order Number</li>
              <li>Photographs of the product</li>
              <li>Description of the issue</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-brand-green">Refund Eligibility</h2>
            <p className="leading-relaxed mb-4">Refunds or replacements may be approved after verification if:</p>
            <ul className="list-disc pl-6 space-y-2 leading-relaxed">
              <li>Wrong product was delivered.</li>
              <li>Product arrived damaged.</li>
              <li>Product was missing from the order.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-brand-green">Refund Timeline</h2>
            <p className="leading-relaxed">Approved refunds will be processed within 5–7 business days to the original payment method.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-brand-green">Cancellation</h2>
            <p className="leading-relaxed">Orders may be cancelled only before dispatch. Once an order has been shipped, cancellation requests cannot be accepted.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-brand-green">Contact for Returns</h2>
            <p className="leading-relaxed mt-2">Email: <a href="mailto:care@kiddosfoods.com" className="text-brand-green hover:underline">care@kiddosfoods.com</a></p>
            <p className="leading-relaxed mt-2">Phone: <a href="tel:+917845945455" className="text-brand-green hover:underline">+91 78459 45455</a></p>
          </section>
        </div>
      </div>
    </main>
  );
}
