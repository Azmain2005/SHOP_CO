import Footer from "./components/Footer.js";
import Navbar from "./components/Navbar.js";
import PromoBanner from "./components/topBar.js";
import FestiveBanner from "./components/FestiveBanner.js";
import TrendingCategories from "./components/TrendingCategories.js";
import CollectionBanner from "./components/CollectionBanner.js";
import FeaturedProducts from "./components/FeaturedProducts.js";

// Modest women's fashion — editorial collection images (verified Unsplash IDs)
const COLLECTION_IMAGES = {
  abaya:
    "https://i.ibb.co.com/mC7hXR4C/abdul-raheem-kannath-CWD8-UDt3y-PI-unsplash.jpg",
  kaftan:
    "https://i.ibb.co.com/ymdYSwVq/image.png",
  borka:
    "https://i.ibb.co.com/NdtRb9GD/modern-stylish-muslim-woman-hijab-city-street.jpg",
  hijab:"https://i.ibb.co.com/27Mm3Y7Y/muhammad-faiz-zulkeflee-Kr-R7x-En4-HV8-unsplash.jpg",
  kids: "https://images.unsplash.com/photo-1542156822-6924d1a71ace?w=900&q=85&fit=crop",
};


export default function App() {
  return (
    <div className="bg-white">
      {/* Top promo + Navbar */}
      <PromoBanner />
      <Navbar />

      {/* 1. Festive Eid/Boishakhi hero banner */}
      <FestiveBanner />

      {/* 2. Trending Categories — Abaya, Kaftan, Borka, Hijab, Prayer Set, Kids */}
      <TrendingCategories />

      {/* 3. Abaya Collection — image right */}
      <CollectionBanner
        title="ABAYA COLLECTION"
        subtitle="Timeless Elegance · Modest Luxury"
        imageUrl={COLLECTION_IMAGES.abaya}
        imageAlign="right"
        bgColor="bg-[#EDE8E1]"
        href="/product?category=abaya"
      />

      {/* 4. Kaftan Collection — image left */}
      <CollectionBanner
        title="KAFTAN COLLECTION"
        subtitle="Flowing Grace · Premium Fabrics"
        imageUrl={COLLECTION_IMAGES.kaftan}
        imageAlign="left"
        bgColor="bg-[#F5F0EB]"
        href="/product?category=kaftan"
      />

      {/* 5. Featured Products grid */}
      <FeaturedProducts />

      {/* 6. Borka Collection — image right */}
      <CollectionBanner
        title="BORKA COLLECTION"
        subtitle="Modest · Refined · Comfortable"
        imageUrl={COLLECTION_IMAGES.borka}
        imageAlign="right"
        bgColor="bg-[#EAEAEA]"
        href="/product?category=borka"
      />

      {/* 7. Prayer Set — image left */}
      <CollectionBanner
        title="HIJAB"
        subtitle="Pure · Serene · Devotion"
        imageUrl={COLLECTION_IMAGES.hijab}
        imageAlign="left"
        bgColor="bg-[#EAF0EE]"
        href="/product?category=hijab"
      />

      {/* 8. Kids Modest Wear — image right */}
      {/* <CollectionBanner
        title="KIDS COLLECTION"
        subtitle="Modest Fashion for Little Ones"
        imageUrl={COLLECTION_IMAGES.kids}
        imageAlign="right"
        bgColor="bg-[#F0EAF5]"
        href="/product?category=kids"
      /> */}

      {/* Footer */}
      <Footer />
    </div>
  );
}