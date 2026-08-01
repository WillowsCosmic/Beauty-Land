import Footer from "./components/footer";
import GallerySection from "./components/gallerySection";
import Hero from "./components/Hero";
import ServicesSection from "./components/ServicesSection";

export default function Home() {
  return (
    <main>
      <Hero />
      <ServicesSection />
      <GallerySection />
      <Footer />
    </main>
  );
}