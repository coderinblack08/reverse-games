import { NextApiRequest, NextApiResponse } from "next";
import * as cheerio from "cheerio";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return res.status(405).end();
  const html = await fetch(req.query.url as string);
  const $ = cheerio.load(await html.text());
  // span.TermText
  // .SetPageTerm-wordText
  // .SetPageTerm-definitionText
  const term = new Array<string>();
  const definition = new Array<string>();
  $(".SetPageTerm-wordText > span.TermText").each((_, element) => {
    term.push($(element).text());
  });

  $(".SetPageTerm-definitionText > span.TermText").each((_, element) => {
    definition.push($(element).text());
  });

  return term.reduce((acc, cur, index) => {
    acc[cur] = definition[index];
    return acc;
  }, {} as Record<string, string>);
}
