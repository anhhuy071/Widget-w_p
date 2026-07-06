import { fetchRealNews } from "../server/newsCore";

type QueryValue = string | string[] | undefined;

type ServerlessRequest = {
  headers?: {
    host?: string;
  };
  query?: Record<string, QueryValue>;
  url?: string;
};

type ServerlessResponse = {
  statusCode: number;
  setHeader: (name: string, value: string) => void;
  end: (body?: string) => void;
};

const json = (res: ServerlessResponse, statusCode: number, body: unknown) => {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  return res.end(JSON.stringify(body));
};

const firstValue = (value: QueryValue) => (Array.isArray(value) ? value[0] : value);

export const readQuery = (req: ServerlessRequest) => {
  const base = `http://${req.headers?.host || "localhost"}`;
  const parsedUrl = new URL(req.url || "/", base);
  const searchQuery = Object.fromEntries(parsedUrl.searchParams.entries());

  return {
    ...searchQuery,
    ...req.query,
  };
};

export default async function handler(req: ServerlessRequest, res: ServerlessResponse) {
  const query = readQuery(req);
  const categoriesQuery = firstValue(query.categories);
  let categories: string[] | undefined = undefined;

  if (typeof categoriesQuery === "string") {
    categories = categoriesQuery
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
  }

  const articles = await fetchRealNews(categories);
  res.setHeader("Cache-Control", "s-maxage=21600, stale-while-revalidate=43200");
  return json(res, 200, articles);
}
