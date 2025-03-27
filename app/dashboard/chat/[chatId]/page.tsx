import ChatInterface from "@/components/ChatInterface";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getConvexClient } from "@/lib/convex";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// interface ChatPageProps {
//     params: {
//       chatId: Id<"chats">;
//     };
//   }

type ChatPageProps = Promise< {
  chatId: Id<"chats">;
}>

async function ChatPage( props : {
  params: ChatPageProps
}){
    const {chatId} = await props.params;

    // Get user authentication
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

try {
      // Get Convex client and fetch chat and messages
  const convex = getConvexClient();

  // Get messages
    const initialMessages = await convex.query(api.messages.list, { chatId });

    return (
        <div className="flex-1 overflow-hidden">
          <ChatInterface chatId={chatId} initialMessages={initialMessages} />
        </div>
      ); 
} catch (error) {
    console.error("🔥 Error loading chat:", error);
    redirect("/dashboard");
}
}

export default ChatPage;