import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Bookmark, Share } from "lucide-react";
import { toast } from "sonner";

interface Article {
  id: string;
  title: string;
  content: string;
  abstract: string;
  category: string;
  thumbnail_url: string;
  author_id: string;
  created_at: string;
  slug: string; // Add slug here
  author?: {
    username: string;
  };
}

const AuthorArticle = () => {
  const { author, slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (author && slug) {
      fetchArticleBySlug(author, slug);
      document.title = `${slug} - BanguJournal`;
    }
  }, [author, slug]);

  const generateSimplifiedSlug = (title: string): string => {
    if (!title) return "";

    const banglaToEnglish: { [key: string]: string } = {
      " ": "-",
      "া": "a",
      "ি": "i",
      "ী": "i",
      "ু": "u",
      "ূ": "u",
      "ে": "e",
      "ৈ": "oi",
      "ো": "o",
      "ৌ": "ou",
      "ঁ": "",
    };

    let slug = title
      .toLowerCase()
      .split("")
      .map((char) => banglaToEnglish[char] || (/[a-z0-9]/.test(char) ? char : "-"))
      .join("")
      .replace(/--+/g, "-")
      .replace(/^-+|-+$/g, "");

    return slug;
  };

  const fetchArticleBySlug = async (authorId: string, articleSlug: string) => {
    try {
      console.log(`Fetching article by author: ${authorId} and slug: ${articleSlug}`);

      const { data, error } = await supabase
        .from("articles")
        .select(`
          *,
          author:profiles(username)
        `)
        .eq("author_id", authorId)
        .eq("slug", articleSlug)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          navigate("/404");
          return;
        }
        throw error;
      }

      if (!data) {
        console.error("Article not found");
        navigate("/404");
        return;
      }

      console.log("Article found:", data.title);
      setArticle(data);
      checkBookmarkStatus(data.id);
    } catch (error) {
      console.error("Error fetching article:", error);
      toast.error("Error loading article.");
    } finally {
      setLoading(false);
    }
  };

  const checkBookmarkStatus = async (articleId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("article_id", articleId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!error && data) {
      setIsBookmarked(true);
    }
  };

  const toggleBookmark = async () => {
    if (!article) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please sign in to bookmark articles");
      return;
    }

    try {
      if (isBookmarked) {
        const { error } = await supabase
          .from("bookmarks")
          .delete()
          .match({ article_id: article.id, user_id: user.id });

        if (error) throw error;
        setIsBookmarked(false);
        toast.success("Bookmark removed");
      } else {
        const { error } = await supabase
          .from("bookmarks")
          .insert({ article_id: article.id, user_id: user.id });

        if (error) throw error;
        setIsBookmarked(true);
        toast.success("Article bookmarked");
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast.error("Failed to update bookmark");
    }
  };

  const shareArticle = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        text: article?.abstract,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
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
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold mb-0">{article?.title}</h1>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleBookmark}
                className={isBookmarked ? "text-primary" : ""}
              >
                <Bookmark className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={shareArticle}>
                <Share className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="text-muted-foreground mb-8 flex justify-between">
            <span>By {article.author?.username || `user_${article.author_id.substring(0, 8)}`}</span>
            <span>{article?.created_at && new Date(article.created_at).toLocaleDateString()}</span>
          </div>
          {article?.thumbnail_url && (
            <img
              src={article.thumbnail_url}
              alt={article.title}
              className="w-full h-64 object-cover rounded-lg mb-8"
            />
          )}
          <div 
            className="prose dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: article?.content || "" }} 
          />
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default AuthorArticle;

 
