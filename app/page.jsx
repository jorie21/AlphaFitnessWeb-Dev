
import AboutSection from "@/components/sections/AboutSection";
import TestimonialSection from "@/components/sections/TestimonialSection";
import AnnouncementSection from "@/components/sections/AnnouncementSection";
import HeroSection from "@/components/sections/HeroSection";
import FooterSection from "@/components/sections/FooterSection";

export default function Home() {
  
  return (
    <main className="space-y-8 ">
      <HeroSection/>
      <AnnouncementSection/>
      <AboutSection/>
      <div>
        <TestimonialSection/>
        <FooterSection/>
      </div>
    </main>
  );
}
