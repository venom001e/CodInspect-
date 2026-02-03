import Banner from "@/components/banner";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        default: "CodInspect — Your Background AI Engineer",
        template: "%s | CodInspect",
    },
    description:
        "CodInspect is a Background AI Engineer that works silently in the background, building, testing, and shipping code while you focus on thinking, designing, and scaling.",
    keywords: [
        "AI Background Engineer",
        "Autonomous AI Engineer",
        "Background AI Worker",
        "AI Software Developer",
        "Collaborative AI Coding",
        "CodInspect",
    ],
    authors: [{ name: "CodInspect" }],
    creator: "CodInspect",
    publisher: "CodInspect",

    openGraph: {
        title: "CodInspect — Your Background AI Engineer",
        description:
            "CodInspect is an autonomous AI-powered software engineer designed to execute real development work in the background. Build, test, and ship code faster.",
        url: "https://codinspect.ai",
        siteName: "CodInspect",
        locale: "en_US",
        type: "website",
    },

    twitter: {
        card: "summary_large_image",
        title: "CodInspect — Your Background AI Engineer",
        description:
            "CodInspect works silently in the background, building, testing, and shipping code while you focus on growth.",
        creator: "@codinspect",
    },

    robots: {
        index: true,
        follow: true
    },

    alternates: {
        canonical: "https://codinspect.ai",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Banner />
            <Navbar />
            {children}
            <Footer />
        </>
    )
}