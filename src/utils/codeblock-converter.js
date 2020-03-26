const asciidoc = require('asciidoctor')();
const Prism = require('prismjs');
const loadLanguages = require('prismjs/components/');
loadLanguages.silent = true;

class CodeblockConverter {
  constructor() {
    this.baseConverter = asciidoc.Html5Converter.$new();
  }

  convert(node, transform) {
    if (node.getNodeName() === 'listing' && node.getStyle() === 'source') {
      const language = node.attributes.$$smap.language;
      loadLanguages([language]);
      const title = node.getTitle() ? `<div class="title">${node.getTitle()}</div>` : '';
      const highlighted = Prism.highlight(
        node
          .getContent()
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&'),
        Prism.languages[language],
        language,
      );
      return (
        `<div class="listingblock">` +
        title +
        `<div class="content"><pre class="highlight language-${language}">` +
        `<code class="language-${language}">` +
        highlighted +
        `</code></pre></div></div>`
      );
    }

    return this.baseConverter.convert(node, transform);
  }
}

module.exports = CodeblockConverter;
