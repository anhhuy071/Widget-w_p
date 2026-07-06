export interface NewsArticle {
  id: string;
  title: string;
  url: string;
  source: string;
  category: string;
  imageUrl: string;
  publishedAt: string;
  likes: number;
}

const RSS_FEEDS: Record<string, string> = {
  thoisu: "https://vnexpress.net/rss/thoi-su.rss",
  thegioi: "https://vnexpress.net/rss/the-gioi.rss",
  thethao: "https://vnexpress.net/rss/the-thao.rss",
  giaitri: "https://vnexpress.net/rss/giai-tri.rss",
  suckhoe: "https://vnexpress.net/rss/suc-khoe.rss",
};

const extractImgSrc = (description: string): string => {
  const match = description.match(/<img[^>]+src="([^">]+)"/);
  return match ? match[1] : "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80";
};

const decodeXmlEntities = (str: string): string => {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
    .replace(/&#x([a-fA-F0-9]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)));
};

const getRelativeTime = (dateStr: string): string => {
  try {
    const ms = Date.parse(dateStr);
    if (isNaN(ms)) return dateStr;
    const diff = Date.now() - ms;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return "vài giây trước";
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return new Date(ms).toLocaleDateString("vi-VN");
  } catch {
    return dateStr;
  }
};

const parseRSS = (xml: string, category: string): NewsArticle[] => {
  const articles: NewsArticle[] = [];
  const items = xml.split("<item>");
  
  for (let i = 1; i < items.length; i++) {
    const item = items[i].split("</item>")[0];
    
    const titleMatch = item.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/);
    const linkMatch = item.match(/<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/);
    const descMatch = item.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/);
    const pubDateMatch = item.match(/<pubDate>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/pubDate>/);
    
    if (titleMatch && linkMatch) {
      const title = decodeXmlEntities(titleMatch[1].trim());
      const url = linkMatch[1].trim();
      const desc = descMatch ? descMatch[1].trim() : "";
      const pubDate = pubDateMatch ? pubDateMatch[1].trim() : "";
      
      const imageUrl = extractImgSrc(desc);
      const publishedAt = getRelativeTime(pubDate);
      
      const urlHash = url.split("/").pop()?.replace(".html", "") || String(Math.random());
      
      articles.push({
        id: `vnexpress-${urlHash}`,
        title,
        url,
        source: "VnExpress",
        category,
        imageUrl,
        publishedAt,
        likes: Math.floor(Math.random() * 45) + 5,
      });
    }
  }
  return articles;
};

export const fetchRealNews = async (categories?: string[]): Promise<NewsArticle[]> => {
  const targetCategories = categories && categories.length > 0
    ? categories
    : Object.keys(RSS_FEEDS);

  try {
    const promises = targetCategories.map(async (category) => {
      const url = RSS_FEEDS[category];
      if (!url) return [];
      
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "application/rss+xml, application/xml, text/xml, */*"
        }
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch RSS for category: ${category}`);
      }
      const xml = await response.text();
      return parseRSS(xml, category);
    });

    const results = await Promise.allSettled(promises);
    const articles: NewsArticle[] = [];

    results.forEach((result) => {
      if (result.status === "fulfilled") {
        articles.push(...result.value);
      } else {
        console.error("RSS fetch error:", result.reason);
      }
    });

    if (articles.length > 0) {
      return articles;
    }
    
    return [];
  } catch (error) {
    console.error("Failed to fetch real news:", error);
    return [];
  }
};
