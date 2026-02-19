import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import FeaturedEvents from "@/components/home/FeaturedEvents";
import CategorySection from "@/components/home/CategorySection";
import StatsSection from "@/components/home/StatsSection";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturedEvents />
      <StatsSection />
      <CategorySection />
      <CTASection />
    </Layout>
  );
};

export default Index;
