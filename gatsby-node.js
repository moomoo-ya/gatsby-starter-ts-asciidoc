// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createFilePath } = require(`gatsby-source-filesystem`);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require(`path`);

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;
  if (node.internal.type === 'MarkdownRemark' || node.internal.type === 'Asciidoc') {
    const slug = createFilePath({ node, getNode });
    createNodeField({
      node,
      name: 'slug',
      value: slug,
    });
  }
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  // **Note:** The graphql function call returns a Promise
  // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise for more info
  const result = await graphql(`
    query {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
      allAsciidoc {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
  `);

  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    const slug = node.fields.slug;
    createPage({
      path: slug,
      component: path.resolve(`./src/templates/blog-post.tsx`),
      context: {
        // Data passed to context is available
        // in page queries as GraphQL variables.
        slug: slug,
      },
    });
  });

  result.data.allAsciidoc.edges.forEach(({ node }) => {
    createPage({
      path: node.fields.slug,
      component: path.resolve(`./src/templates/blog-post.tsx`),
      context: {
        // Data passed to context is available
        // in page queries as GraphQL variables.
        slug: node.fields.slug,
      },
    });
  });
};

exports.createSchemaCustomization = ({ actions, schema }) => {
  const { createTypes } = actions;
  const typeDefs = `
    type File implements Node {
      childAsciidoc: Asciidoc
      childMarkdownRemark: MarkdownRemark
    }
  `;
  createTypes(typeDefs);

  const markdownTypeDefs = `
    type MarkdownRemark implements Node {
      id: ID!
      html: String!
      excerpt: String!
      fields: MarkdownRemarkFields
      frontmatter: MarkdownRemarkFrontmatter
    }
    type MarkdownRemarkFields {
      slug: String!
    }
    type MarkdownRemarkFrontmatter {
      title: String!
      date: Date
      tags: [String]!
    }
  `;
  createTypes(markdownTypeDefs);

  const asciidocTypeDefs = `
    type Asciidoc implements Node {
      id: ID!
      html: String!
      document: AsciidocDocument
      fields: AsciidocFields
      revision: AsciidocRevision
      pageAttributes: AsciidocPageAttributes
    }
    type AsciidocDocument {
      title: String!
    }
    type AsciidocFields {
      slug: String!
    }
    type AsciidocRevision {
      date: Date
    }
  `;
  createTypes(asciidocTypeDefs);

  const additionalTypeDefs = [
    schema.buildObjectType({
      name: `AsciidocPageAttributes`,
      fields: {
        description: 'String',
        tags: {
          type: '[String]!',
          resolve(parent) {
            if (parent.tags) return JSON.parse(parent.tags.replace(/'/g, '"'));
            else return [];
          },
        },
      },
      interfaces: [`Node`],
    }),
  ];
  createTypes(additionalTypeDefs);
};
