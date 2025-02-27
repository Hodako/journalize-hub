
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { shuffle } from "@/lib/utils";

interface Article {
  id: string;
  title: string;
  content: string;
  abstract: string;
  category: string;
  thumbnail_url: string;
  author_id: string;
  created_at: string;
}

const ReadArticle = () => {
  const { id } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [suggestions, setSuggestions] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);

  useEffect(() => {
    if (id) {
      fetchArticle(id);
    }
  }, [id]);

  const fetchArticle = async (articleId: string) => {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", articleId)
        .single();

      if (error) throw error;
      setArticle(data);

      // Fetch suggestions after getting the article
      if (data) {
        fetchSuggestions(data.category, data.id);
      }
    } catch (error) {
      console.error("Error fetching article:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async (category: string, currentArticleId: string) => {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("category", category)
        .neq("id", currentArticleId)
        .limit(4);

      if (error) throw error;
      setSuggestions(shuffle(data || []));
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container max-w-4xl py-8">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/4 mb-8" />
          <Skeleton className="h-64 w-full mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Article not found</h1>
            <p>The article you're looking for doesn't exist or has been removed.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container max-w-4xl py-8">
        <article className="prose lg:prose-xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
          <div className="text-muted-foreground mb-8">
            {new Date(article.created_at).toLocaleDateString()}
          </div>
          {article.thumbnail_url && (
            <img
              src={article.thumbnail_url}
              alt={article.title}
              className="w-full h-64 object-cover rounded-lg mb-8"
            />
          )}
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </article>

        {/* Suggestions Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          {loadingSuggestions ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(3).fill(null).map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <Skeleton className="h-32 w-full mb-4" />
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : suggestions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestions.slice(0, 3).map((suggestion) => (
                <Card
                  key={suggestion.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => {
                    window.location.href = `/article/${suggestion.id}`;
                  }}
                >
                  <CardContent className="p-0">
                    <img
                      src={suggestion.thumbnail_url || ''}
                      alt={suggestion.title}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-2">
                        {suggestion.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {suggestion.abstract}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No related articles found.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReadArticle;
