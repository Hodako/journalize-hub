
import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Check, 
  X, 
  Users, 
  FileText, 
  BookOpen, 
  Bookmark,
  BarChart2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ArticleData {
  id: string;
  title: string;
  category: string;
  created_at: string;
  author: {
    username: string;
  } | null;
}

interface StatData {
  totalUsers: number;
  totalArticles: number;
  totalCategories: number;
}

const AdminDashboard = () => {
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [stats, setStats] = useState<StatData>({
    totalUsers: 0,
    totalArticles: 0,
    totalCategories: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles();
    fetchStats();
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    // This is a simple check. In a real app, you'd have admin roles in your database
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Unauthorized access");
      navigate("/");
      return;
    }
  };

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select(`
          id,
          title,
          category,
          created_at,
          author:profiles(username)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Get total users
      const { count: userCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Get total articles
      const { count: articleCount } = await supabase
        .from("articles")
        .select("*", { count: "exact", head: true });

      // Get unique categories
      const { data: categories } = await supabase
        .from("articles")
        .select("category")
        .not("category", "is", null);

      const uniqueCategories = new Set(categories?.map(item => item.category));

      setStats({
        totalUsers: userCount || 0,
        totalArticles: articleCount || 0,
        totalCategories: uniqueCategories.size
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;

    try {
      const { error } = await supabase
        .from("articles")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setArticles(articles.filter(article => article.id !== id));
      toast.success("Article deleted successfully");
      fetchStats(); // Update stats after deletion
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleViewArticle = (id: string) => {
    navigate(`/article/${id}`);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Users className="mr-2 h-5 w-5" /> Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <FileText className="mr-2 h-5 w-5" /> Total Articles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalArticles}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <BookOpen className="mr-2 h-5 w-5" /> Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalCategories}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="articles">
          <TabsList>
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="articles" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Articles</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div>Loading articles...</div>
                ) : articles.length === 0 ? (
                  <div>No articles found</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-4">Title</th>
                          <th className="text-left py-2 px-4">Author</th>
                          <th className="text-left py-2 px-4">Category</th>
                          <th className="text-left py-2 px-4">Date</th>
                          <th className="text-right py-2 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {articles.map((article) => (
                          <tr key={article.id} className="border-b hover:bg-muted/50">
                            <td className="py-2 px-4">{article.title}</td>
                            <td className="py-2 px-4">
                              {article.author?.username || "Unknown"}
                            </td>
                            <td className="py-2 px-4">{article.category}</td>
                            <td className="py-2 px-4">
                              {new Date(article.created_at).toLocaleDateString()}
                            </td>
                            <td className="py-2 px-4 text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleViewArticle(article.id)}
                                >
                                  View
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeleteArticle(article.id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statistics" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Statistics Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <div className="text-lg mb-2">Articles per Category</div>
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-muted-foreground">
                      <BarChart2 className="h-12 w-12 mx-auto mb-2" />
                      <p>Statistics visualization would go here in a production app</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
