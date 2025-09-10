import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, BookOpen, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BorrowedBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: "borrowed" | "returned" | "overdue";
  renewalCount: number;
  maxRenewals: number;
}

// Mock data for demonstration
const mockBorrowedBooks: BorrowedBook[] = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isbn: "978-0-7432-7356-5",
    borrowDate: new Date("2024-01-15"),
    dueDate: new Date("2024-02-15"),
    status: "borrowed",
    renewalCount: 0,
    maxRenewals: 2
  },
  {
    id: "2",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "978-0-06-112008-4",
    borrowDate: new Date("2024-01-10"),
    dueDate: new Date("2024-02-10"),
    returnDate: new Date("2024-02-08"),
    status: "returned",
    renewalCount: 1,
    maxRenewals: 2
  },
  {
    id: "3",
    title: "1984",
    author: "George Orwell",
    isbn: "978-0-452-28423-4",
    borrowDate: new Date("2023-12-01"),
    dueDate: new Date("2024-01-01"),
    status: "overdue",
    renewalCount: 2,
    maxRenewals: 2
  },
  {
    id: "4",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    isbn: "978-0-14-143951-8",
    borrowDate: new Date("2024-01-20"),
    dueDate: new Date("2024-02-20"),
    status: "borrowed",
    renewalCount: 1,
    maxRenewals: 2
  }
];

const BorrowedBooks = () => {
  const [books, setBooks] = useState<BorrowedBook[]>(mockBorrowedBooks);
  const [isLoggedIn] = useState(true); // This would come from your auth context
  const [username] = useState("John Doe");
  const { toast } = useToast();

  const handleReturn = (bookId: string) => {
    setBooks(prev => prev.map(book => 
      book.id === bookId 
        ? { ...book, status: "returned" as const, returnDate: new Date() }
        : book
    ));
    
    toast({
      title: "Book Returned",
      description: "Thank you for returning the book on time!",
    });
  };

  const handleRenew = (bookId: string) => {
    setBooks(prev => prev.map(book => {
      if (book.id === bookId && book.renewalCount < book.maxRenewals) {
        const newDueDate = new Date(book.dueDate);
        newDueDate.setDate(newDueDate.getDate() + 14); // Add 2 weeks
        
        return {
          ...book,
          dueDate: newDueDate,
          renewalCount: book.renewalCount + 1,
          status: "borrowed" as const
        };
      }
      return book;
    }));
    
    toast({
      title: "Book Renewed",
      description: "Your book has been renewed for 2 more weeks.",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const getDaysUntilDue = (dueDate: Date) => {
    const today = new Date();
    const timeDiff = dueDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const getStatusBadge = (book: BorrowedBook) => {
    switch (book.status) {
      case "returned":
        return (
          <Badge variant="default" className="bg-green-500 hover:bg-green-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            Returned
          </Badge>
        );
      case "overdue":
        return (
          <Badge variant="destructive">
            <AlertCircle className="w-3 h-3 mr-1" />
            Overdue
          </Badge>
        );
      default:
        const daysLeft = getDaysUntilDue(book.dueDate);
        if (daysLeft <= 3) {
          return (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
              <Clock className="w-3 h-3 mr-1" />
              Due Soon
            </Badge>
          );
        }
        return (
          <Badge variant="default" className="gradient-primary text-primary-foreground">
            <BookOpen className="w-3 h-3 mr-1" />
            Borrowed
          </Badge>
        );
    }
  };

  const activeBorrows = books.filter(book => book.status !== "returned");
  const returnedBooks = books.filter(book => book.status === "returned");
  const overdueBooks = books.filter(book => book.status === "overdue");

  if (!isLoggedIn) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-md mx-auto text-center p-8">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Login Required</h2>
            <p className="text-muted-foreground mb-6">
              Please log in to view your borrowed books.
            </p>
            <Button className="gradient-primary text-primary-foreground">
              Sign In
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout isLoggedIn={isLoggedIn} username={username}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Library</h1>
          <p className="text-muted-foreground">
            Manage your borrowed books and reading history
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card">
            <CardContent className="p-6 text-center">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{activeBorrows.length}</div>
              <div className="text-sm text-muted-foreground">Currently Borrowed</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">{returnedBooks.length}</div>
              <div className="text-sm text-muted-foreground">Books Returned</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="p-6 text-center">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-500" />
              <div className="text-2xl font-bold">{overdueBooks.length}</div>
              <div className="text-sm text-muted-foreground">Overdue</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-secondary" />
              <div className="text-2xl font-bold">{books.length}</div>
              <div className="text-sm text-muted-foreground">Total History</div>
            </CardContent>
          </Card>
        </div>

        {/* Currently Borrowed Books */}
        {activeBorrows.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Currently Borrowed</h2>
            <div className="space-y-4">
              {activeBorrows.map((book) => (
                <Card key={book.id} className="shadow-card hover:shadow-hover transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-md flex items-center justify-center">
                            <BookOpen className="h-8 w-8 text-muted-foreground" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold">{book.title}</h3>
                              {getStatusBadge(book)}
                            </div>
                            
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <User className="h-3.5 w-3.5" />
                                <span>by {book.author}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>Borrowed: {formatDate(book.borrowDate)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-3.5 w-3.5" />
                                <span>Due: {formatDate(book.dueDate)}</span>
                                {book.status === "borrowed" && (
                                  <span className="ml-2 text-xs">
                                    ({getDaysUntilDue(book.dueDate)} days left)
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 lg:flex-col xl:flex-row">
                        {book.status === "borrowed" && (
                          <>
                            <Button
                              onClick={() => handleReturn(book.id)}
                              className="gradient-primary text-primary-foreground"
                            >
                              Return Book
                            </Button>
                            
                            {book.renewalCount < book.maxRenewals && (
                              <Button
                                onClick={() => handleRenew(book.id)}
                                variant="outline"
                              >
                                Renew ({book.maxRenewals - book.renewalCount} left)
                              </Button>
                            )}
                          </>
                        )}
                        
                        {book.status === "overdue" && (
                          <Button
                            onClick={() => handleReturn(book.id)}
                            variant="destructive"
                          >
                            Return Overdue Book
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Reading History */}
        {returnedBooks.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Reading History</h2>
            <div className="space-y-4">
              {returnedBooks.map((book) => (
                <Card key={book.id} className="shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-md flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-muted-foreground" />
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{book.title}</h3>
                            {getStatusBadge(book)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">by {book.author}</p>
                          <div className="text-xs text-muted-foreground">
                            Borrowed: {formatDate(book.borrowDate)} • 
                            Returned: {book.returnDate ? formatDate(book.returnDate) : "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {books.length === 0 && (
          <Card className="text-center p-12">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No Books Yet</h3>
            <p className="text-muted-foreground mb-6">
              You haven't borrowed any books yet. Start exploring our collection!
            </p>
            <Button className="gradient-primary text-primary-foreground">
              Browse Books
            </Button>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default BorrowedBooks;