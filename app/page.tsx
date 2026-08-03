import Footer from "./components/footer";
import GallerySection from "./components/gallerySection";
import Hero from "./components/Hero";
import ServicesSection from "./components/ServicesSection";

export default function Home() {
  return (
    <main>
      <div id="hero">
        <Hero />
      </div>
      <div id="services">
        <ServicesSection />
      </div>
      <div id="gallery">
        <GallerySection />
      </div>
      <div id="contact">
        <Footer />
      </div>
    </main>
  );
}