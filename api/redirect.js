import { readFileSync } from "fs";
import path from "path";

export default function redirect(req, res) {
  let url = process.env.MY_EXTERNAL_LINK;

  if (!url) {
    const file = path.join(process.cwd(), "link.txt");
    url = readFileSync(file, "utf8");
  }

  if (!url) {
    return res.status(404).send("MY_EXTERNAL_LINK is missing");
  }

  url = url.replace(/(^\s+|\s+$)/g, "");

  if (!url.match(/^https?:\/\//)) {
    url = `https://${url}`;
  }

  if (req.headers["user-agent"]?.match(/^Twitterbot/)) {
    res.setHeader("content-type", "text/html");
    return res.send(
      `<meta http-equiv="refresh" content="0; url=${encodeURIComponent(
        url
      )}" /><a href="${encodeURIComponent(url)}">Continue to ${url}</a>`
    );
  }

  res.setHeader("location", url);
  return res
    .status(301)
    .send(`<a href="${encodeURIComponent(url)}">Continue to ${url}</a>`);
}
