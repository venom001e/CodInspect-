import CTASection from "@/sections/cta-section";
import FeaturesSection from "@/sections/features-section";
import HeroSection from "@/sections/hero-section";
import PricingSection from "@/sections/pricing-section";
import TeamSection from "@/sections/team-section";
import TestimonialSection from "@/sections/testimonial-section";

export default function Home() {
	return (
		<>
			<HeroSection />
			<FeaturesSection />
			<TeamSection />
			<PricingSection />
			<TestimonialSection />
			<CTASection />
		</>
	);
}
