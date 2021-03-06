import { rhythm, scale } from '../utils/typography';
import React from 'react';
import { Link } from 'gatsby';

export default (data: { location: { pathname: string }; title: string; children: object }) => {
  const { location, title, children } = data;

  const rootPath = `/`;
  let header: any;

  if (location.pathname === rootPath) {
    header = (
      <h1
        style={{
          ...scale(1.5),
          fontFamily: `Merriweather, sans-serif`,
          marginBottom: rhythm(1.5),
          marginTop: 0,
        }}
      >
        <Link
          style={{
            boxShadow: `none`,
            textDecoration: `none`,
            color: `inherit`,
          }}
          to={`/`}
        >
          {title}
        </Link>
      </h1>
    );
  } else {
    header = (
      <span
        style={{
          fontSize: `1.1487rem`,
          fontWeight: 700,
          fontFamily: `Merriweather, sans-serif`,
        }}
      >
        <Link
          style={{
            boxShadow: `none`,
            textDecoration: `none`,
            color: `inherit`,
          }}
          to={`/`}
        >
          {title}
        </Link>
      </span>
    );
  }

  return (
    <div
      style={{
        marginLeft: `auto`,
        marginRight: `auto`,
        maxWidth: rhythm(24),
        padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
      }}
    >
      <header>{header}</header>
      <main>{children}</main>
      <footer
        style={{
          borderTop: `1px solid rgba(0, 0, 0, 0.2)`,
        }}
      >
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.gatsbyjs.org">Gatsby</a>
      </footer>
    </div>
  );
};
