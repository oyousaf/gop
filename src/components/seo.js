import React from "react";
import Head from "next/head";

export default function SEO({
  description = "Uniting the Ummah with sacred knowledge of the Deen",
  author = "OYOUSAF,OYOUSAF87,OMAR YOUSAF,oyousaf_",
  meta,
  title = "Gardens of Paradise",
}) {
  const metaData = [
    {
      name: `description`,
      content: "Uniting the Ummah with sacred knowledge of the Deen",
    },
    {
      name: `title`,
      content: "Gardens of Paradise",
    },
    {
      name: `author`,
      content: "OYOUSAF,OYOUSAF87,OMAR YOUSAF,oyousaf_",
    },
    {
      property: `og:title`,
      content: title,
    },
    {
      property: `og:description`,
      content: description,
    },
    {
      property: `og:type`,
      content: `website`,
    },
    {
      name: `twitter:card`,
      content: `summary`,
    },
    {
      name: `twitter:creator`,
      content: author,
    },
    {
      name: `twitter:title`,
      content: title,
    },
    {
      name: `twitter:description`,
      content: description,
    },
  ].concat(meta);

  return (
    <Head>
      <title>{title}</title>
      {metaData.map(({ name, content }, i) => (
        <meta key={i} name={name} content={content} />
      ))}
    </Head>
  );
}

SEO.defaultProps = {
  url: "http://oyousaf.uk",
  lang: `en-gb`,
  meta: [],
  charset: "utf-8",
};
