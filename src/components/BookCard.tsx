import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, User, Calendar, Hash } from "lucide-react";

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publishedYear: number;
  isAvailable: boolean;
  genre?: string;
  coverImage?: string;
}

interface BookCardProps {
  book: Book;
  onBorrow?: (bookId: string) => void;
  showBorrowButton?: boolean;
}

const BookCard = ({ book, onBorrow, showBorrowButton = true }: BookCardProps) => {
  const handleBorrow = () => {
    if (onBorrow && book.isAvailable) {
      onBorrow(book.id);
    }
  };

  return (
    <Card className="group h-full shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1 border-0 overflow-hidden">
      <CardHeader className="p-0">
        <div className="aspect-[3/4] bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center relative overflow-hidden">
          {book.coverImage ? (
            <img 
              src={book.coverImage} 
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-muted-foreground p-8">
              <BookOpen className="h-16 w-16 mb-2" />
              <span className="text-xs text-center font-medium">{book.title}</span>
            </div>
          )}
          <div className="absolute top-3 right-3">
            <Badge 
              variant={book.isAvailable ? "default" : "secondary"}
              className={book.isAvailable ? "gradient-primary text-primary-foreground" : ""}
            >
              {book.isAvailable ? "Available" : "Borrowed"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 flex-1">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {book.title}
        </h3>
        
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <User className="h-3.5 w-3.5" />
            <span>{book.author}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Hash className="h-3.5 w-3.5" />
            <span>ISBN: {book.isbn}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5" />
            <span>Published: {book.publishedYear}</span>
          </div>
          
          {book.genre && (
            <Badge variant="outline" className="mt-2">
              {book.genre}
            </Badge>
          )}
        </div>
      </CardContent>
      
      {showBorrowButton && (
        <CardFooter className="p-4 pt-0">
          <Button 
            onClick={handleBorrow}
            disabled={!book.isAvailable}
            className={`w-full transition-all duration-200 ${
              book.isAvailable 
                ? "gradient-primary text-primary-foreground hover:shadow-lg" 
                : ""
            }`}
            variant={book.isAvailable ? "default" : "secondary"}
          >
            {book.isAvailable ? "Borrow Book" : "Not Available"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default BookCard;