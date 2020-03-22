import React from 'react';
import { useStaticQuery, graphql, Link } from 'gatsby';

const Tags = () => {
  const data = useStaticQuery(graphql`
    query TagsQuery {
      markdownTags: allMarkdownRemark(limit: 1000) {
        group(field: frontmatter___tags) {
          fieldValue
        }
      }
      asciidocTags: allAsciidoc(limit: 1000) {
        group(field: pageAttributes___tags) {
          fieldValue
        }
      }
    }
  `);

  const tags = Array.from(
    new Set(
      [...data.markdownTags.group, ...data.asciidocTags.group].map((value) => value.fieldValue),
    ),
  ).sort((a, b) => a.localeCompare(b));

  return (
    <div>
      <h4 style={{ marginBottom: 0 }}>Tags</h4>
      <ul style={{ marginLeft: 0 }}>
        {tags.map((tag) => {
          return (
            <li key={tag} style={{ display: 'inline-block', marginRight: '0.5rem' }}>
              <Link to={`/tags/${tag}`}>{tag}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Tags;
