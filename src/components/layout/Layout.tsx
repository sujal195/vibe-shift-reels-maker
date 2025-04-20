
import { ReactNode } from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-20 pb-16 px-4 max-w-7xl mx-auto">
        {children}
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground border-t border-border">
        <p>MEMORIA – Your Life as a Living Timeline</p>
        <p className="mt-1 text-xs">Created By: Sujal Giri</p>
      </footer>
    </div>
  );
};

export default Layout;
