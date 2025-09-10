import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Library, Home, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 px-4">
        <Card className="max-w-md w-full shadow-card text-center">
          <CardContent className="p-8">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 gradient-primary rounded-full mb-4">
                <Library className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-6xl font-bold text-primary mb-2">404</h1>
              <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
              <p className="text-muted-foreground mb-6">
                Oops! The page you're looking for seems to have wandered off like a misplaced book. 
                Let's help you find your way back to our library.
              </p>
            </div>
            
            <div className="space-y-3">
              <Link to="/" className="block">
                <Button className="w-full gradient-primary text-primary-foreground">
                  <Home className="h-4 w-4 mr-2" />
                  Return to Library
                </Button>
              </Link>
              
              <Link to="/" className="block">
                <Button variant="outline" className="w-full">
                  <Search className="h-4 w-4 mr-2" />
                  Browse Books
                </Button>
              </Link>
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <p className="text-xs text-muted-foreground">
                Error Code: 404 - Route: {location.pathname}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default NotFound;
