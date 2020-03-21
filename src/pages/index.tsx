import SEO from '../components/seo';
import Bio from '../components/bio';
import Layout from '../components/layout';
import { rhythm } from '../utils/typography';

import React from 'react';
import { Link, graphql } from 'gatsby';
import 'moment/locale/ja';
import moment from 'moment';

declare interface PageListObject {
  site: {
    siteMetadata: {
      title: string;
    };
  };
  allFile: {
    edges: Array<{
      node: {
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

export default (result: { data: PageListObject; location: { pathname: string } }) => {
  const data: PageListObject = result.data;
  const pages = data.allFile.edges
    .filter((edge) => {
      return edge.node.childAsciidoc || edge.node.childMarkdownRemark;
    })
    .map((edge) => {
      if (edge.node.childAsciidoc) {
        const child = edge.node.childAsciidoc;
        const item: ListItemObject = {
          slug: child.fields.slug,
          title: child.document.title,
          description: child.pageAttributes.description,
          date: child.revision.date,
          tags: child.pageAttributes.tags,
        };
        return item;
      } else {
        const child = edge.node.childMarkdownRemark;
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

  return (
    <Layout location={result.location} title={data.site.siteMetadata.title}>
      <SEO title="All posts" />
      <Bio />
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

export const pageQuery = graphql`
  query {
    allFile(filter: { sourceInstanceName: { eq: "blog" }, extension: { regex: "/(md|adoc)/" } }) {
      edges {
        node {
          childMarkdownRemark {
            id
            fields {
              slug
            }
            excerpt
            frontmatter {
              date
              title
              tags
            }
          }
          childAsciidoc {
            id
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
    site {
      siteMetadata {
        title
      }
    }
  }
`;
