"use client";

import { useState, useRef, useEffect } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import {
    Send, Plus, Search, History, Settings,
    MessageSquare, ChevronDown, Paperclip,
    Zap, Sparkles, FolderGit2,
    Code2, Box, ArrowRight, Copy, Check
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Message {
    role: "user" | "model";
    content: string;
}

export default function ChatInterface() {
    const { user } = useUser();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState<"Agent" | "Ask">("Ask");
    const [model, setModel] = useState<"Fast" | "Pro">("Fast");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'inherit';
            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = `${Math.min(scrollHeight, 400)}px`;
        }
    }, [input]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage, history: messages }),
            });

            const data = await response.json();
            if (data.error) throw new Error(data.error);
            setMessages((prev) => [...prev, { role: "model", content: data.text }]);
        } catch (error: any) {
            console.error("Error:", error);
            setMessages((prev) => [
                ...prev,
                {
                    role: "model",
                    content: `### ⚠️ Error\n${error.message || "I encountered an unexpected error. Please try again."}`
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex h-screen bg-[#FFFFFF] text-[#111111] font-sans overflow-hidden antialiased relative selection:bg-green-100 selection:text-green-900">

            {/* Background Glow Effects - Refined & Subtler */}
            <div className="absolute top-[-100px] right-[-100px] -z-10 w-[800px] h-[800px] bg-green-200/20 rounded-full blur-[130px] opacity-60 pointer-events-none"></div>
            <div className="absolute bottom-[-100px] left-[-100px] -z-10 w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-[130px] opacity-60 pointer-events-none"></div>

            {/* 1. Icon Sidebar - Ultra Clean */}
            <div className="w-[68px] bg-white border-r border-[#F0F0F0] flex flex-col items-center py-5 flex-shrink-0 z-20">
                <div className="mb-8">
                    <div className="h-10 w-10 bg-black rounded-[12px] flex items-center justify-center text-white shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:scale-105 transition-transform cursor-pointer">
                        <Code2 size={20} strokeWidth={2.5} />
                    </div>
                </div>

                <div className="flex flex-col gap-4 w-full">
                    <NavIcon icon={<Search size={22} />} active label="Search" />
                    <NavIcon icon={<History size={22} />} label="History" />
                    <NavIcon icon={<FolderGit2 size={22} />} label="Projects" />
                </div>

                <div className="mt-auto flex flex-col gap-6 items-center mb-2">
                    <NavIcon icon={<Settings size={22} />} label="Settings" />
                    <div className="hover:ring-2 ring-slate-100 rounded-full transition-all duration-300 p-0.5 mb-2">
                        {mounted && <UserButton
                            appearance={{
                                elements: {
                                    avatarBox: "h-8 w-8"
                                }
                            }}
                            afterSignOutUrl="/"
                        />}
                    </div>
                </div>
            </div>

            {/* 2. Secondary Sidebar - Refined */}
            <div className="w-[300px] bg-[#FCFCFC] border-r border-[#F0F0F0] flex flex-col flex-shrink-0 z-10">
                <div className="h-[72px] flex items-center justify-between px-5">
                    <button className="flex items-center gap-2 group">
                        <div className="flex flex-col items-start">
                            <span className="text-sm font-bold text-[#111] leading-none mb-1 flex items-center gap-1.5">
                                venom001e
                                <ChevronDown size={12} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
                            </span>
                            <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest leading-none">Personal</span>
                        </div>
                    </button>
                    <button className="h-8 w-8 flex items-center justify-center bg-white border border-[#EAEAEA] rounded-lg text-slate-500 hover:text-black hover:border-black/20 hover:shadow-sm transition-all">
                        <Plus size={18} />
                    </button>
                </div>

                <div className="px-4 mb-6">
                    <div className="relative group">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-600 transition-colors" size={15} />
                        <input
                            placeholder="Search threads..."
                            className="w-full bg-[#F5F5F5] border-transparent rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500/10 focus:border-green-500/20 transition-all border outline-none"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-3 pb-4">
                    <div className="px-3 py-2 flex items-center justify-between mb-1">
                        <span className="text-[10px] font-black text-[#999] uppercase tracking-[0.2em]">Recent Activity</span>
                    </div>

                    {/* Empty State - Better Visuals */}
                    <div className="mt-16 flex flex-col items-center justify-center px-8 text-center">
                        <div className="w-12 h-12 bg-[#F5F5F5] rounded-full flex items-center justify-center mb-4">
                            <MessageSquare size={20} className="text-[#CCC]" />
                        </div>
                        <h3 className="text-sm font-semibold text-[#333] mb-1">No threads yet</h3>
                        <p className="text-xs text-[#999] leading-relaxed">Start a new conversation to see your history here.</p>
                    </div>
                </div>
            </div>

            {/* 3. Main Content */}
            <div className="flex-1 flex flex-col relative bg-white/50 backdrop-blur-sm z-0 overflow-hidden">

                <div className="flex-1 flex flex-col w-full h-full relative max-w-5xl mx-auto overflow-hidden">

                    {messages.length === 0 ? (
                        /* Initial State (Centered) */
                        <div className="flex-1 flex flex-col items-center justify-center px-4 w-full max-w-2xl mx-auto -mt-16 animate-in fade-in zoom-in-95 duration-500">

                            {/* Premium Badge */}
                            <div className="mb-10 cursor-default">
                                <span className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-green-100 text-green-700 text-[11px] font-bold tracking-wide uppercase shadow-sm hover:shadow-md hover:border-green-200 transition-all">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    CodInspect AI Engineer Coming Soon
                                </span>
                            </div>

                            {/* Heading */}
                            <h1 className="text-4xl md:text-5xl font-bold text-[#111111] mb-12 tracking-tight text-center leading-[1.1]">
                                How can I help you <br />
                                <span className="bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-transparent">ship software today?</span>
                            </h1>

                            {/* Input Box - The Centerpiece */}
                            <div className="w-full relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-green-100 via-blue-50 to-purple-50 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 blur-xl"></div>
                                <div className="relative w-full bg-white border border-[#EAEAEA] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] focus-within:shadow-[0_8px_30px_rgba(0,0,0,0.08)] focus-within:border-black/10 transition-all duration-300 overflow-hidden">
                                    <textarea
                                        ref={textareaRef}
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Ask a question or generate code..."
                                        className="w-full bg-transparent text-[#111111] placeholder:text-[#A0A0A0] text-[15px] px-5 py-4 resize-none outline-none min-h-[100px] leading-relaxed font-medium transition-all"
                                        rows={1}
                                    />

                                    {/* Toolbar */}
                                    <div className="flex items-center justify-between px-3 pb-3 pt-2 bg-gradient-to-b from-transparent to-white/50">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setModel(model === "Fast" ? "Pro" : "Fast")}
                                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#F5F5F5] hover:bg-[#EAEAEA] text-xs font-semibold text-[#555] transition-colors border border-transparent hover:border-[#DDD]"
                                            >
                                                <Zap size={12} className={model === "Fast" ? "text-amber-500 fill-amber-500" : "text-[#999]"} />
                                                {model}
                                                <ChevronDown size={12} className="opacity-40" />
                                            </button>
                                            <div className="w-px h-4 bg-slate-200 mx-1"></div>
                                            <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-[#F5F5F5] text-xs font-medium text-[#666] transition-colors">
                                                <Paperclip size={14} />
                                                Add Context
                                            </button>
                                        </div>

                                        <button
                                            onClick={handleSend}
                                            disabled={!input.trim()}
                                            className="h-8 w-8 flex items-center justify-center rounded-lg bg-[#111111] text-white hover:bg-black disabled:opacity-30 disabled:hover:bg-[#111111] transition-all shadow-sm hover:shadow-md active:scale-95"
                                        >
                                            <ArrowRight size={16} strokeWidth={2.5} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex gap-3 text-xs text-slate-400 font-medium">
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-100 rounded-full shadow-sm">
                                    <Code2 size={12} /> Agent Mode
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-100 rounded-full shadow-sm">
                                    <FolderGit2 size={12} /> RAG Enabled
                                </div>
                            </div>

                        </div>
                    ) : (
                        /* Chat View */
                        <div className="flex flex-col h-full w-full">
                            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 scroll-smooth pb-32">
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`flex gap-4 w-full ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                                        <div className={`${msg.role === "user" ? "max-w-[80%]" : "w-full"} rounded-2xl shadow-sm border ${msg.role === "user"
                                            ? "bg-[#F3F4F6] border-transparent text-black px-5 py-3 rounded-br-sm"
                                            : "bg-white border-[#EAEAEA] text-slate-800 px-6 py-5 rounded-bl-sm"
                                            }`}>
                                            {msg.role === "model" && (
                                                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-50">
                                                    <div className="h-6 w-6 rounded-md bg-black text-white flex items-center justify-center shadow-md shadow-green-900/10">
                                                        <Code2 size={14} />
                                                    </div>
                                                    <span className="text-sm font-semibold text-slate-900">CodInspect</span>
                                                    <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-medium tracking-tight">AI ENGINEER</span>
                                                </div>
                                            )}
                                            <div className={`prose prose-slate max-w-none text-[15px] leading-7 ${msg.role === "user" ? "" : "text-[#333]"}`}>
                                                <ReactMarkdown
                                                    components={{
                                                        code({ node, inline, className, children, ...props }: any) {
                                                            const match = /language-(\w+)/.exec(className || '')
                                                            return !inline && match ? (
                                                                <div className="rounded-xl overflow-hidden border border-slate-100 my-6 shadow-sm group/code">
                                                                    <div className="bg-slate-50/50 backdrop-blur-sm px-4 py-2 border-b border-slate-100 flex justify-between items-center text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                                                                        <span className="font-mono">{match[1]}</span>
                                                                        <button className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
                                                                            <Copy size={12} /> Copy
                                                                        </button>
                                                                    </div>
                                                                    <div className="overflow-x-auto custom-scrollbar">
                                                                        <SyntaxHighlighter
                                                                            style={oneLight}
                                                                            language={match[1]}
                                                                            PreTag="div"
                                                                            customStyle={{
                                                                                margin: 0,
                                                                                padding: '1.5rem',
                                                                                fontSize: '0.85rem',
                                                                                backgroundColor: '#ffffff',
                                                                                lineHeight: '1.6'
                                                                            }}
                                                                            {...props}
                                                                        >
                                                                            {String(children).replace(/\n$/, '')}
                                                                        </SyntaxHighlighter>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <code className={`${className} bg-slate-100/50 px-1.5 py-0.5 rounded text-[13px] font-mono text-slate-700 border border-slate-200/50`} {...props}>
                                                                    {children}
                                                                </code>
                                                            )
                                                        }
                                                    }}
                                                >
                                                    {msg.content}
                                                </ReactMarkdown>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex gap-4 px-0 max-w-[85%]">
                                        <div className="h-8 w-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                                            <Sparkles size={16} className="text-green-500 animate-spin" />
                                        </div>
                                        <div className="flex flex-col gap-2 pt-2 w-full">
                                            <div className="h-4 w-32 bg-slate-100 rounded animate-pulse"></div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Bottom Bar - Floating Glass */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white/95 to-transparent z-20">
                                <div className="max-w-3xl mx-auto">
                                    <div className="flex gap-3 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] focus-within:ring-2 ring-slate-100 transition-all">
                                        <div className="flex-1 relative flex items-center">
                                            <textarea
                                                ref={textareaRef}
                                                value={input}
                                                onChange={(e) => setInput(e.target.value)}
                                                onKeyDown={handleKeyDown}
                                                placeholder="Ask a follow-up..."
                                                className="w-full bg-transparent outline-none text-[15px] placeholder:text-slate-400 px-4 py-3 resize-none max-h-40 min-h-[44px] transition-all"
                                                rows={1}
                                            />
                                        </div>
                                        <button
                                            onClick={handleSend}
                                            disabled={!input.trim() || isLoading}
                                            className="h-10 w-10 flex items-center justify-center rounded-xl bg-black text-white hover:bg-slate-800 disabled:opacity-20 transition-all shadow-lg shadow-black/5 active:scale-95"
                                        >
                                            <ArrowRight size={18} strokeWidth={2.5} />
                                        </button>
                                    </div>
                                    <div className="text-center mt-3 text-[10px] text-slate-400 font-semibold tracking-wide uppercase opacity-70">
                                        CodInspect Agent Beta • AI can produce inaccurate code
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function NavIcon({ icon, active = false, label }: { icon: React.ReactNode, active?: boolean, label?: string }) {
    return (
        <div className="group relative flex items-center justify-center w-full px-2">
            {active && (
                <div className="absolute left-0 w-1 h-6 bg-[#111] rounded-r-full" />
            )}
            <button className={`p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center w-full ${active
                ? "text-black bg-[#F5F5F5]"
                : "text-slate-400 hover:text-black hover:bg-[#F5F5F5]"
                }`}>
                {icon}
            </button>
            {label && (
                <div className="absolute left-[calc(100%+12px)] px-3 py-1.5 bg-black text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-xl translate-x-1 group-hover:translate-x-0 z-50">
                    {label}
                </div>
            )}
        </div>
    );
}
