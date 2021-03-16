import axios from "axios";
import React from "react";
import { Resource } from "../types/Resource";
import { User } from "../types/User";

const staticLinks = [
  "",
  "create",
  "login",
  "faq",
  "login",
  "signup",
  "legal",
  "legal/privacy",
  "legal/rules",
  "legal/terms",
  "dashboard",
  "directory/resources/plugin",
  "directory/resources/mod",
  "directory/resources/software",
  // "dashboard/coupons",
  // "dashboard/sales",
  // "dashboard/webhooks",
];

const baseURL = "https://savagelabs.net/marketplace";

const createSitemap = (
  resources: Resource[],
  users: User[]
) => `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${staticLinks
          .map((link) => {
            return `
                    <url>
                        <loc>${baseURL}/${link}</loc>
                    </url>
                `;
          })
          .join("")}
          ${resources
            .map((resource) => {
              return `
                      <url>
                          <loc>${baseURL}/resources/${resource._id}.${resource.slug}</loc>
                          <lastmod>${resource.updated}</lastmod>
                      </url>
                  `;
            })
            .join("")}
            ${users
              .map((user) => {
                return `
                          <url>
                              <loc>${baseURL}/users/${user._id}</loc>
                          </url>
                      `;
              })
              .join("")}
    </urlset>
    `;

class Sitemap extends React.Component {
  static async getInitialProps({ req, res }) {
    // const request = await fetch(EXTERNAL_DATA_URL);
    // const posts = await request.json();

    const sitemapInfo = await axios.post(
      process.env.NEXT_PUBLIC_BASE_URL + "/directory/sitemap-info",
      {
        "system-password": process.env.SYSTEM_PASSWORD,
      }
    );

    res.setHeader("Content-Type", "text/xml");
    res.write(
      createSitemap(
        sitemapInfo.data.payload.resources,
        sitemapInfo.data.payload.users
      )
    );
    res.end();
    return {revalidate: 60}
  }
}

export default Sitemap;
