import { Geist, Geist_Mono } from "next/font/google";
import Providers from "../providers"; // ✅ Go one level up
import { GoogleOAuthProvider } from "@react-oauth/google";

import { AppSidebar } from '@/components/ui/adminSidebar/app-sidebar';
import { SidebarProvider, SidebarTrigger, useSidebar } from '@/components/ui/adminSidebar/sidebar';
import React from 'react';
import FloatingSidebarTrigger from "./components/FloatingSidebarTrigger";
import AdminNavbar from "../components/AdminNavbar";
import { Toaster } from 'react-hot-toast';





function useIsMobile() {
    const [isMobile, setIsMobile] = React.useState(false);
    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return isMobile;
}




const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "Admin Dashboard",
    description: "Admin section layout",
};

const CLIENT_ID =
    "1037614128251-kk326tc7ll40i5gfo3f6d0flc3n6tjmc.apps.googleusercontent.com";

export default function AdminLayout({ children }) {
    return (
        // Remove <html> and <body> tags
        <>
                <Providers>
                    <AdminNavbar />
                    <GoogleOAuthProvider clientId={CLIENT_ID}>
                        <SidebarProvider>                            
                            <AppSidebar />
                            <FloatingSidebarTrigger />
                            {children}
                            <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
                        </SidebarProvider>
                    </GoogleOAuthProvider>
                </Providers>
            </>
    );
}
