import { currentUser } from "@clerk/nextjs/server";
import ChatInterface from "@/components/chat-interface";

export default async function DashboardPage() {
    const user = await currentUser();

    if (!user) return null;

    return <ChatInterface />;
}
