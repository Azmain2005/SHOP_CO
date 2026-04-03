import Footer from "./components/Footer.js";
import Navbar from "./components/Navbar.js";
import PromoBanner from "./components/topBar.js";
import FestiveBanner from "./components/FestiveBanner.js";
import TrendingCategories from "./components/TrendingCategories.js";
import CollectionBanner from "./components/CollectionBanner.js";
import FeaturedProducts from "./components/FeaturedProducts.js";

// High-quality editorial fashion images for each collection
const COLLECTION_IMAGES = {
  mens:
    "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=900&q=85&fit=crop",
  womens:
    "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=900&q=85&fit=crop",
  casual:
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=85&fit=crop",
  boys: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=900&q=85&fit=crop",
  kids: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=900&q=85&fit=crop",
};

export default function App() {
  return (
    <div className="bg-white">
      {/* Top promo bar + Navigation */}
      <PromoBanner />
      <Navbar />

      {/* 1. Full-width festive hero banner */}
      <FestiveBanner />

      {/* 2. Trending Categories thumbnail row */}
      <TrendingCategories />

      {/* 3. Men's Collection — image on right */}
      <CollectionBanner
        title="MEN'S COLLECTION"
        subtitle="New Season · 2024"
        imageUrl={COLLECTION_IMAGES.mens}
        imageAlign="right"
        bgColor="bg-[#EDE8E1]"
        href="/product?category=men"
      />

      {/* 4. Women's Collection — image on left */}
      <CollectionBanner
        title="WOMEN'S COLLECTION"
        subtitle="Everyday Elegance"
        imageUrl={COLLECTION_IMAGES.womens}
        imageAlign="left"
        bgColor="bg-[#F5F0EB]"
        href="/product?category=women"
      />

      {/* 5. Featured Products grid */}
      <FeaturedProducts />

      {/* 6. Casual Collection — image on right */}
      <CollectionBanner
        title="CASUAL COLLECTION"
        subtitle="Relaxed · Refined · Ready"
        imageUrl={COLLECTION_IMAGES.casual}
        imageAlign="right"
        bgColor="bg-[#EAEAEA]"
        href="/product?category=casual"
      />

      {/* 7. Boys Collection — image on left */}
      <CollectionBanner
        title="BOYS COLLECTION"
        subtitle="Cool Looks for Young Stars"
        imageUrl={COLLECTION_IMAGES.boys}
        imageAlign="left"
        bgColor="bg-[#EAF0EE]"
        href="/product?category=boys"
      />

      {/* 8. Kids / Girls Collection — image on right */}
      <CollectionBanner
        title="KIDS COLLECTION"
        subtitle="Playful · Comfortable · Bright"
        imageUrl={COLLECTION_IMAGES.kids}
        imageAlign="right"
        bgColor="bg-[#F0EAF5]"
        href="/product?category=kids"
      />

      {/* Footer with newsletter */}
      <Footer />
    </div>
  );
}