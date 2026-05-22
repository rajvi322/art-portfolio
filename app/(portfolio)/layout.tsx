import Header from "@/components/Header";
import SmoothScroll from "@/components/SmoothScroll";

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScroll>
      <Header />
      <main className="flex-1">
        {children}
      </main>
    </SmoothScroll>
  );
}
