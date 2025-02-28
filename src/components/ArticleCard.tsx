
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface ArticleCardProps {
  id: string;
  title: string;
  abstract: string;
  thumbnail: string;
  category: string;
  author: string;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  id,
  title,
  abstract,
  thumbnail,
  category,
  author,
}) => {
  // Use article ID instead of slug-based URL
  return (
    <Link to={`/article/${id}`}>
      <Card className="article-card group animate-scale-up">
        <div className="relative">
          <img
            src={thumbnail}
            alt={title}
            className="article-card-image"
            loading="lazy"
          />
          <Badge className="absolute top-2 right-2 bg-black/75 hover:bg-black/90">
            {category}
          </Badge>
        </div>
        <CardHeader className="p-4 pb-2">
          <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {abstract}
          </p>
          <p className="text-xs text-muted-foreground">By {author}</p>
        </CardContent>
      </Card>
    </Link>
  );
};
