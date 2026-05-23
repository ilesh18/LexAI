import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { LawyerMarketplace } from "@/components/site/LawyerMarketplace";

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [
      { title: "Lawyer Marketplace — ApnaNyaya" },
      { name: "description", content: "Connect with verified, specialised advocates near you. Flat-fee consultations, pre-compiled AI briefs, and language filters." },
      { property: "og:title", content: "Lawyer Marketplace — ApnaNyaya" },
      { property: "og:description", content: "Connect with verified, specialised advocates near you. Flat-fee consultations, pre-compiled AI briefs, and language filters." },
    ],
  }),
  component: MarketplacePage,
});

function MarketplacePage() {
  return (
    <Layout>
      <div className="pt-8">
        <LawyerMarketplace />
      </div>
    </Layout>
  );
}
