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

export const MOCK_ARTICLES: NewsArticle[] = [
  {
    id: "news-1",
    title: "Ngọc nữ bị bắt",
    url: "https://tienphong.vn",
    source: "Tiền Phong",
    category: "giaitri",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    publishedAt: "9 giờ trước",
    likes: 20,
  },
  {
    id: "news-2",
    title: "Điều gì xảy ra khi dùng nước luộc thịt để nấu canh?",
    url: "https://vnexpress.net",
    source: "VnExpress",
    category: "suckhoe",
    imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80",
    publishedAt: "1 tuần trước",
    likes: 76,
  },
  {
    id: "news-3",
    title: "Phó Thủ tướng Phạm Thị Thanh Trà kiểm tra công tác chuẩn bị Lễ triển khai...",
    url: "https://vietnamplus.vn",
    source: "VietnamPlus",
    category: "thoisu",
    imageUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80",
    publishedAt: "6 giờ trước",
    likes: 12,
  },
  {
    id: "news-4",
    title: "Vụ hơn 140 điểm 10 toán tốt nghiệp ở Tuyên Quang: Bộ Giáo dục nói có bất...",
    url: "https://tuoitre.vn",
    source: "Tuổi Trẻ",
    category: "thoisu",
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80",
    publishedAt: "21 phút trước",
    likes: 45,
  },
  {
    id: "news-5",
    title: "Bão suy yếu, mưa vẫn tiếp tục ở miền Bắc",
    url: "https://tienphong.vn",
    source: "Tiền Phong",
    category: "thoisu",
    imageUrl: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=600&q=80",
    publishedAt: "6 giờ trước",
    likes: 31,
  },
  {
    id: "news-6",
    title: "Trước thềm hội nghị thượng đỉnh NATO, Mỹ điện đàm với Nga và Trung Quốc",
    url: "https://baoquocte.vn",
    source: "Thế giới & Việt Nam",
    category: "thegioi",
    imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80",
    publishedAt: "15 giờ trước",
    likes: 4,
  },
  {
    id: "news-7",
    title: "Vòng 16 World Cup: Pháp giành chiến thắng sát sao 1-0 trước Paraguay",
    url: "https://vnexpress.net",
    source: "VnExpress",
    category: "thethao",
    imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80",
    publishedAt: "5 ngày trước",
    likes: 98,
  },
  {
    id: "news-8",
    title: "Công nghệ AI mới của Google dịch trực tiếp hơn 100 ngôn ngữ cực nhanh",
    url: "https://tuoitre.vn",
    source: "Tuổi Trẻ",
    category: "thegioi",
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
    publishedAt: "3 giờ trước",
    likes: 56,
  },
  {
    id: "news-9",
    title: "Liveshow ca hát diva nhạc Việt cháy vé chỉ sau 5 phút mở bán trực tuyến",
    url: "https://tienphong.vn",
    source: "Tiền Phong",
    category: "giaitri",
    imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    publishedAt: "12 giờ trước",
    likes: 88,
  },
  {
    id: "news-10",
    title: "Bí quyết sống khỏe kéo dài tuổi thọ cực kỳ bổ ích của người dân vùng Okinawa",
    url: "https://vnexpress.net",
    source: "VnExpress",
    category: "suckhoe",
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
    publishedAt: "3 ngày trước",
    likes: 120,
  },
];

export const fetchMockNews = (categories?: string[]): NewsArticle[] => {
  if (!categories || categories.length === 0) {
    return MOCK_ARTICLES;
  }
  return MOCK_ARTICLES.filter((article) => categories.includes(article.category));
};
