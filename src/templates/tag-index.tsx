import Layout from '../components/layout';
import SEO from '../components/seo';
import { rhythm } from '../utils/typography';
import 'moment/locale/ja';

import React from 'react';
import moment from 'moment';
import { Link, graphql } from 'gatsby';

declare interface PageListObject {
  site: {
    siteMetadata: {
      title: string;
    };
  };
  allAsciidoc: {
    totalCount: number;
    edges: Array<{
      childAsciidoc: {
        fields: {
          slug: string;
        };
        document: {
          title: string;
        };
        revision: {
          date: Date;
        };
        pageAttributes: {
          description: string;
          tags: Array<string>;
        };
      };
    }>;
  };
  allMarkdownRemark: {
    totalCount: number;
    edges: Array<{
      childMarkdownRemark: {
        excerpt: string;
        fields: {
          slug: string;
        };
        frontmatter: {
          date: Date;
          title: string;
          tags: Array<string>;
        };
      };
    }>;
  };
}

type ListItemObject = {
  slug: string;
  title: string;
  description: string;
  date: Date;
  tags: Array<string>;
};

export default (result: {
  pageContext: any;
  data: PageListObject;
  location: { pathname: string };
}) => {
  const data: PageListObject = result.data;
  const count = data.allMarkdownRemark.totalCount + data.allAsciidoc.totalCount;
  const pages = [...data.allAsciidoc.edges, ...data.allMarkdownRemark.edges]
    .filter((edge) => {
      return edge.childAsciidoc || edge.childMarkdownRemark;
    })
    .map((edge) => {
      if (edge.childAsciidoc) {
        const child = edge.childAsciidoc;
        const item: ListItemObject = {
          slug: child.fields.slug,
          title: child.document.title,
          description: child.pageAttributes.description,
          date: child.revision.date,
          tags: child.pageAttributes.tags,
        };
        return item;
      } else {
        const child = edge.childMarkdownRemark;
        const item: ListItemObject = {
          slug: child.fields.slug,
          title: child.frontmatter.title,
          description: child.excerpt,
          date: child.frontmatter.date,
          tags: child.frontmatter.tags,
        };
        return item;
      }
    })
    .sort((a, b) => moment(b.date).diff(moment(a.date)));

  const pageContext = result.pageContext;
  return (
    <Layout location={result.location} title={data.site.siteMetadata.title}>
      <SEO title={pageContext.tag} description="" />
      <h1
        style={{
          marginTop: rhythm(1),
        }}
      >
        {pageContext.tag}({count}件)
      </h1>
      {pages.map((page) => {
        return (
          <article key={page.slug}>
            <header>
              <h3
                style={{
                  marginBottom: rhythm(1 / 4),
                }}
              >
                <Link style={{ boxShadow: `none` }} to={page.slug}>
                  {page.title}
                </Link>
              </h3>
              <small>{moment(page.date).format('lll')}</small>
              <small style={{ marginLeft: `1rem` }}>
                {page.tags.map((tag) => '[' + tag + ']')}
              </small>
            </header>
            <section>
              <p dangerouslySetInnerHTML={{ __html: page.description }} />
            </section>
          </article>
        );
      })}
    </Layout>
  );
};

export const query = graphql`
  query($tag: String!) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(limit: 1000, filter: { frontmatter: { tags: { in: [$tag] } } }) {
      totalCount
      edges {
        childMarkdownRemark: node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            title
            date
            tags
          }
        }
      }
    }
    allAsciidoc(limit: 1000, filter: { pageAttributes: { tags: { in: [$tag] } } }) {
      totalCount
      edges {
        childAsciidoc: node {
          fields {
            slug
          }
          document {
            title
          }
          pageAttributes {
            description
            tags
          }
          revision {
            date
          }
        }
      }
    }
  }
`;
