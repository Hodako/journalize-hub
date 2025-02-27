
import React, { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Profile {
  username: string | null;
  avatar_url: string | null;
}

interface Article {
  id: string;
  title: string;
  abstract: string;
  thumbnail_url: string;
  category: string;
  author_id: string;
  created_at: string;
}

interface BookmarkData {
  id: string;
  article_id: string;
  user_id: string;
  article: Article;
}

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    fetchProfile();
    fetchUserArticles();
    fetchBookmarks();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        setProfile(profile);
        setUsername(profile.username || "");
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchUserArticles = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: articles } = await supabase
        .from('articles')
        .select('*')
        .eq('author_id', user.id)
        .order('created_at', { ascending: false });

      setArticles(articles || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookmarks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('bookmarks')
        .select(`
          id,
          article_id,
          user_id,
          article:articles (*)
        `)
        .eq('user_id', user.id);

      setBookmarks(data || []);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    }
  };

  const updateProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({ username })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Profile updated successfully');
      setEditing(false);
      fetchProfile();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const deleteArticle = async (articleId: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', articleId);

      if (error) throw error;

      toast.success('Article deleted successfully');
      fetchUserArticles();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const ArticleCard = ({ article }: { article: Article }) => (
    <Card>
      <div className="relative">
        <img
          src={article.thumbnail_url || ''}
          alt={article.title}
          className="w-full h-48 object-cover rounded-t"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => navigate(`/article/${article.id}`)}>
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(`/edit/${article.id}`)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-destructive"
              onClick={() => deleteArticle(article.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-2 line-clamp-2">{article.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {article.abstract}
        </p>
        <div className="mt-2 text-xs text-muted-foreground">
          {new Date(article.created_at).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-8">
        <div className="grid gap-6 md:grid-cols-[300px_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent>
              {editing ? (
                <div className="space-y-4">
                  <Input
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button onClick={updateProfile}>Save</Button>
                    <Button variant="ghost" onClick={() => setEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p>Username: {profile?.username || "Not set"}</p>
                  <Button onClick={() => setEditing(true)}>Edit Profile</Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Tabs defaultValue="articles">
              <TabsList>
                <TabsTrigger value="articles">Your Articles</TabsTrigger>
                <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
              </TabsList>

              <TabsContent value="articles" className="mt-6">
                {loading ? (
                  <p>Loading articles...</p>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {articles.map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                    {articles.length === 0 && (
                      <p className="col-span-full text-center text-muted-foreground">
                        You haven't created any articles yet.
                      </p>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="bookmarks" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {bookmarks.map((bookmark) => (
                    <ArticleCard key={bookmark.id} article={bookmark.article} />
                  ))}
                  {bookmarks.length === 0 && (
                    <p className="col-span-full text-center text-muted-foreground">
                      You haven't bookmarked any articles yet.
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
