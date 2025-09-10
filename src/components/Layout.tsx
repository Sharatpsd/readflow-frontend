import { ReactNode } from "react";
import Navigation from "./Navigation";

interface LayoutProps {
  children: ReactNode;
  isLoggedIn?: boolean;
  username?: string;
  onLogout?: () => void;
}

const Layout = ({ children, isLoggedIn = false, username, onLogout }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        isLoggedIn={isLoggedIn} 
        username={username} 
        onLogout={onLogout} 
      />
      
      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t bg-card py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Library Management System. All rights reserved.</p>
          <p className="mt-1">Built with modern technology for seamless book management.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;