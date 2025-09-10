import { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import BookCard from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, BookOpen, Users, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for demonstration
const mockBooks = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isbn: "978-0-7432-7356-5",
    publishedYear: 1925,
    isAvailable: true,
    genre: "Classic Literature"
  },
  {
    id: "2", 
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "978-0-06-112008-4",
    publishedYear: 1960,
    isAvailable: false,
    genre: "Fiction"
  },
  {
    id: "3",
    title: "1984",
    author: "George Orwell",
    isbn: "978-0-452-28423-4",
    publishedYear: 1949,
    isAvailable: true,
    genre: "Dystopian Fiction"
  },
  {
    id: "4",
    title: "Pride and Prejudice",
    author: "Jane Austen", 
    isbn: "978-0-14-143951-8",
    publishedYear: 1813,
    isAvailable: true,
    genre: "Romance"
  },
  {
    id: "5",
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    isbn: "978-0-316-76948-0",
    publishedYear: 1951,
    isAvailable: false,
    genre: "Coming-of-age"
  },
  {
    id: "6",
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    isbn: "978-0-439-70818-8",
    publishedYear: 1997,
    isAvailable: true,
    genre: "Fantasy"
  },
  {
    id: "7",
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    isbn: "978-0-544-00341-5",
    publishedYear: 1954,
    isAvailable: true,
    genre: "Fantasy"
  },
  {
    id: "8",
    title: "Dune",
    author: "Frank Herbert",
    isbn: "978-0-441-17271-9",
    publishedYear: 1965,
    isAvailable: false,
    genre: "Science Fiction"
  },
  {
    id: "9",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    isbn: "978-0-547-92822-7",
    publishedYear: 1937,
    isAvailable: true,
    genre: "Fantasy"
  }
];

const BookList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all");
  const [isLoggedIn] = useState(false); // This would come from your auth context

  // Get unique genres for filter
  const genres = useMemo(() => {
    const uniqueGenres = [...new Set(mockBooks.map(book => book.genre).filter(Boolean))];
    return uniqueGenres;
  }, []);

  // Filter books based on search and filters
  const filteredBooks = useMemo(() => {
    return mockBooks.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          book.isbn.includes(searchTerm);
      
      const matchesGenre = selectedGenre === "all" || book.genre === selectedGenre;
      
      const matchesAvailability = availabilityFilter === "all" || 
                                (availabilityFilter === "available" && book.isAvailable) ||
                                (availabilityFilter === "borrowed" && !book.isAvailable);

      return matchesSearch && matchesGenre && matchesAvailability;
    });
  }, [searchTerm, selectedGenre, availabilityFilter]);

  const handleBorrow = (bookId: string) => {
    console.log("Borrowing book:", bookId);
    // Here you would typically call an API to borrow the book
  };

  const stats = {
    total: mockBooks.length,
    available: mockBooks.filter(book => book.isAvailable).length,
    borrowed: mockBooks.filter(book => !book.isAvailable).length
  };

  return (
    <Layout isLoggedIn={isLoggedIn}>
      {/* Hero Section */}
      <section className="gradient-hero py-16 text-center text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            📚 Welcome to Our Library
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Discover your next great read from our extensive collection
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4 text-center">
                <BookOpen className="h-8 w-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm opacity-90">Total Books</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4 text-center">
                <Star className="h-8 w-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.available}</div>
                <div className="text-sm opacity-90">Available</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.borrowed}</div>
                <div className="text-sm opacity-90">Currently Borrowed</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title, author, or ISBN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filter:</span>
              </div>
              
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Genres" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genres</SelectItem>
                  {genres.map(genre => (
                    <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Books</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="borrowed">Borrowed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters */}
          <div className="flex gap-2 mt-4">
            {searchTerm && (
              <Badge variant="secondary" className="gap-1">
                Search: "{searchTerm}"
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-xs ml-1"
                  onClick={() => setSearchTerm("")}
                >
                  ✕
                </Button>
              </Badge>
            )}
            {selectedGenre !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Genre: {selectedGenre}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-xs ml-1"
                  onClick={() => setSelectedGenre("all")}
                >
                  ✕
                </Button>
              </Badge>
            )}
            {availabilityFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Status: {availabilityFilter}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-xs ml-1"
                  onClick={() => setAvailabilityFilter("all")}
                >
                  ✕
                </Button>
              </Badge>
            )}
          </div>
        </div>
      </section>

      {/* Books Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Our Collection</h2>
            <p className="text-muted-foreground">
              Showing {filteredBooks.length} of {mockBooks.length} books
            </p>
          </div>
          
          {filteredBooks.length === 0 ? (
            <Card className="p-12 text-center">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No books found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or filters
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onBorrow={handleBorrow}
                  showBorrowButton={!isLoggedIn ? false : true}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default BookList;