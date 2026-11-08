import type { ReactNode } from 'react';
import type { SitePage, SitePageBlock } from '@/lib/site-pages';
import { imgSrc } from '@/lib/utils';

function Block({ block }: { block: SitePageBlock }) {
  if (block.type === 'paragraph') {
    return <p>{block.text}</p>;
  }

  if (block.type === 'list') {
    return (
      <ul className="site-content__list">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  return (
    <div className="site-content__cards">
      {block.items.map((item) => (
        <article key={item.title} className="site-content__card">
          <h3>{item.title}</h3>
          <p>{item.text}</p>
        </article>
      ))}
    </div>
  );
}

export function SiteContentPage({ page, cta }: { page: SitePage; cta?: ReactNode }) {
  return (
    <main id="main-content" tabIndex={-1}>
      <section className="category_banner">
        <div className="container">
          <div className="category_banner__content">
            <h1>{page.title}</h1>
            <div className="category_banner__breadcrumb">
              <a href="/">home</a>
              <span>/</span>
              <p>{page.title.toLowerCase()}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="site-content global_section">
        <div className="container">
          <div className="site-content__grid">
            <div className="site-content__media">
              <img src={imgSrc(page.image)} alt={page.imageAlt} />
            </div>
            <div className="site-content__body">
              {page.eyebrow ? <p className="site-content__eyebrow">{page.eyebrow}</p> : null}
              <h2>{page.title}</h2>
              <p className="site-content__intro">{page.intro}</p>
              {page.blocks.map((block, index) => (
                <Block key={`${page.slug}-${index}`} block={block} />
              ))}
              {cta ?? (page.cta ? (
                <a className="site-content__cta" href={page.cta.href}>
                  {page.cta.label}
                </a>
              ) : null)}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
