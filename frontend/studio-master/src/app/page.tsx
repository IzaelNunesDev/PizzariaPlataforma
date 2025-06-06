import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BuildYourOwnPizzaSection from '@/components/sections/BuildYourOwnPizzaSection';
import MenuSection from '@/components/sections/MenuSection';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <BuildYourOwnPizzaSection />
        <MenuSection />
      </main>
      <Footer />
    </div>
  );
}
