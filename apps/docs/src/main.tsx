import { useEffect, useRef, useState, type ComponentProps } from 'react';
import { createRoot } from 'react-dom/client';
import Markdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, ArrowRight, BookOpen, Check, Copy, FileText, Menu, Search, X } from 'lucide-react';
import { Button } from '../../web/src/components/ui/button';
import { Input } from '../../web/src/components/ui/input';
import content from 'virtual:product-docs';
import { documentUrl, headings, resolveDocumentLink } from './navigation';
import './style.css';

const { documents, groups } = content;
const initialPath = () => new URLSearchParams(location.search).get('doc') || 'spec/product/core-domains.md';
const sectionNames: Record<string, string> = {
  product: 'Product foundations', domain: 'Domain records', 'cross-cutting': 'Shared requirements',
  contracts: 'Contracts', architecture: 'Architecture', decisions: 'Decisions', research: 'Research',
  proposals: 'Proposals', capabilities: 'All capabilities', 'Start here': 'Start here',
};

function App() {
  const [path, setPath] = useState(initialPath);
  const [query, setQuery] = useState('');
  const [menu, setMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const main = useRef<HTMLElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const doc = documents.find((item) => item.path === path);
  const folder = documents.filter((item) => item.path.startsWith(`${path}/`));
  const source = doc?.source ?? (folder.length ? `# ${sectionNames[path.split('/')[1]] || path}\n\n${folder.map((item) => `- [${item.title} · ${item.path.split('/').slice(-2).join('/')}](/${item.path})`).join('\n')}` : '');
  const outline = headings(source);
  const activeGroup = groups.find((group) => group.links.some((link) => link.path === path ||
    (link.path.endsWith('/spec.md') && path.startsWith(link.path.slice(0, -7)))));
  const ordered = groups.flatMap((group) => group.links);
  const position = ordered.findIndex((item) => item.path === path);
  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const matches = tokens.length ? documents.filter((item) => tokens.every((token) =>
    `${item.title} ${item.path} ${item.source}`.toLowerCase().includes(token))) : [];

  useEffect(() => {
    const update = () => { setPath(initialPath()); setQuery(''); setMenu(false); };
    const shortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        if (window.innerWidth < 768) setMenu(true);
        requestAnimationFrame(() => search.current?.focus());
      }
      if (event.key === 'Escape') { setMenu(false); setQuery(''); }
    };
    window.addEventListener('popstate', update);
    window.addEventListener('keydown', shortcut);
    return () => { window.removeEventListener('popstate', update); window.removeEventListener('keydown', shortcut); };
  }, []);

  useEffect(() => {
    document.title = `${doc?.title || 'Product documentation'} · GP Clinic`;
    if (location.hash) {
      try { document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView(); } catch { /* Invalid fragments leave the document readable. */ }
    } else window.scrollTo(0, 0);
  }, [path, doc?.title, query]);

  function navigate(next: string, fragment = '') {
    history.pushState(null, '', documentUrl(next, fragment));
    setPath(next); setQuery(''); setMenu(false); setCopied(false);
    requestAnimationFrame(() => {
      if (fragment) document.getElementById(decodeURIComponent(fragment))?.scrollIntoView();
      else { window.scrollTo(0, 0); main.current?.focus(); }
    });
  }

  function DocLink({ to, children, className = '' }: { to: string; children: React.ReactNode; className?: string }) {
    return <a href={documentUrl(to)} className={className} aria-current={to === path ? 'page' : undefined}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault(); navigate(to);
      }}>{children}</a>;
  }

  const components: Components = {
    a: ({ href = '', children }) => {
      const target = resolveDocumentLink(path, href);
      if (!target) return <a href={href} rel="noreferrer">{children}</a>;
      return <a href={documentUrl(target.path, target.fragment)} onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault(); navigate(target.path, target.fragment);
      }}>{children}</a>;
    },
  };
  for (const tag of ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const) {
    components[tag] = ({ node, children, ...props }) => {
      const Tag = tag;
      return <Tag {...props} id={outline.find((heading) => heading.line === node?.position?.start.line)?.id}>{children}</Tag>;
    };
  }
  components.table = ({ children, ...props }: ComponentProps<'table'>) => <div className="overflow-x-auto"><table {...props}>{children}</table></div>;

  return <>
    <a className="skip-link" href="#document">Skip to document</a>
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-card px-4 md:px-7 print:hidden">
      <a href={documentUrl('spec/product/core-domains.md')} className="flex shrink-0 items-center gap-3 font-semibold tracking-tight" onClick={(e) => { e.preventDefault(); navigate('spec/product/core-domains.md'); }}>
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><BookOpen size={17} /></span>
        <span>GP Clinic <span className="ml-2 hidden border-l pl-3 font-normal text-muted-foreground sm:inline">Product documentation</span></span>
      </a>
      <div className="flex items-center gap-2">
        <span className="hidden text-xs text-muted-foreground lg:inline">Version 1 · Draft specification</span>
        <Button variant="ghost" size="icon" aria-label={menu ? 'Close navigation' : 'Open navigation'} aria-expanded={menu} aria-controls="navigation" className="md:hidden" onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</Button>
      </div>
    </header>

    <div className="mx-auto grid max-w-[1600px] md:grid-cols-[272px_minmax(0,1fr)]">
      <aside id="navigation" className={`${menu ? 'block' : 'hidden'} fixed inset-x-0 bottom-0 top-16 z-20 overflow-y-auto border-r bg-card p-5 md:sticky md:block md:h-[calc(100vh-4rem)] print:hidden`}>
        <label htmlFor="search" className="mb-2 flex items-center justify-between text-xs font-medium text-muted-foreground">Search documentation <span>⌘ / Ctrl K</span></label>
        <div className="relative"><Search className="pointer-events-none absolute left-2.5 top-2 size-4 text-muted-foreground" /><Input id="search" ref={search} value={query} className="pl-8" placeholder="Search words or topics…" onChange={(e) => { setQuery(e.target.value); }} /></div>
        {menu && query && <Button className="mt-3 w-full" onClick={() => setMenu(false)}>Show {matches.length} results</Button>}
        <nav aria-label="Documentation" className="mt-6 space-y-6">
          <DocLink to="spec/product/core-domains.md" className="nav-link font-medium"><BookOpen size={15} />Core domains</DocLink>
          {groups.map((group, index) => <div key={group.title}>
            <p className="mb-2 flex gap-2 text-xs font-semibold tracking-wide text-muted-foreground"><span className="tabular-nums opacity-60">0{index + 1}</span>{group.title}</p>
            <div className="space-y-0.5">{group.links.map((link) => <DocLink key={link.path} to={link.path} className="nav-link">{link.title}</DocLink>)}</div>
          </div>)}
          <div className="border-t pt-5"><p className="mb-3 text-xs font-semibold text-muted-foreground">REFERENCE LIBRARY</p>
            {['Start here', 'product', 'domain', 'cross-cutting', 'contracts', 'architecture', 'decisions', 'proposals', 'research', 'capabilities'].map((section) =>
              <details key={section} className="mb-2 text-sm"><summary className="cursor-pointer rounded px-2 py-1.5 text-muted-foreground hover:text-foreground">{sectionNames[section]}</summary>
                {documents.filter((item) => item.section === section).map((item) => <DocLink key={item.path} to={item.path} className="nav-link ml-2 text-xs">{item.title}{!item.path.endsWith('.md') && <span className="text-muted-foreground"> · {item.path.split('/').at(-2)}</span>}</DocLink>)}
              </details>)}
          </div>
        </nav>
      </aside>

      <main id="document" ref={main} tabIndex={-1} className="min-w-0 outline-none">
        {query.trim() ? <div className="mx-auto max-w-4xl px-6 py-10 md:px-12">
          <div className="flex items-center justify-between gap-3"><h1 className="text-2xl font-semibold">Search results</h1><Button variant="ghost" onClick={() => setQuery('')}>Clear search</Button></div>
          <p className="my-4 text-sm text-muted-foreground" role="status">{matches.length} documents match “{query}”</p>
          {!matches.length && <p>No documents match. Try a different word or topic.</p>}
          <div className="divide-y">{matches.map((item) => {
            const first = item.source.toLowerCase().indexOf(tokens[0]);
            const excerpt = item.source.slice(Math.max(0, first - 60), Math.max(0, first - 60) + 200).replace(/[#*`]/g, '');
            return <DocLink key={item.path} to={item.path} className="block py-5 focus-visible:outline-2 focus-visible:outline-ring"><p className="font-medium text-primary">{item.title}</p><p className="mt-1 break-all text-xs text-muted-foreground">{item.path}</p><p className="mt-2 text-sm leading-relaxed">…{excerpt}…</p></DocLink>;
          })}</div>
        </div> : <div className="grid min-w-0 xl:grid-cols-[minmax(0,1fr)_210px]">
          <div className="min-w-0 px-6 py-8 md:px-12 md:py-10 lg:px-16">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground print:hidden">
              <span className="flex items-center gap-2"><FileText size={14} />{activeGroup?.title || sectionNames[doc?.section || ''] || 'Documentation'}</span>
              <Button variant="ghost" size="sm" onClick={async () => { try { await navigator.clipboard.writeText(location.href); setCopied(true); } catch { setCopied(false); } }}>{copied ? <Check /> : <Copy />}{copied ? 'Link copied' : 'Copy link'}</Button>
            </div>
            {source ? <>
              <div className="mb-4 break-all font-mono text-[11px] text-muted-foreground">{path}</div>
              <article className="document mx-auto max-w-[78ch]">
                {doc && !doc.path.endsWith('.md') ? <><h1>{doc.title}</h1><pre><code>{doc.source}</code></pre></> : <Markdown remarkPlugins={[remarkGfm]} components={components} skipHtml>{source}</Markdown>}
              </article>
              {doc?.path.endsWith('/spec.md') && <div className="mt-10 flex flex-wrap gap-3 border-t pt-5 print:hidden">{['acceptance.feature', 'review.yaml'].map((file) => <Button key={file} variant="outline" asChild><DocLink to={path.replace(/spec\.md$/, file)}>{file === 'review.yaml' ? 'Review evidence' : 'Acceptance examples'}<ArrowRight /></DocLink></Button>)}</div>}
              {position >= 0 && <div className="mt-12 flex flex-wrap justify-between gap-4 border-t pt-6 print:hidden">
                {ordered[position - 1] ? <DocLink to={ordered[position - 1].path} className="flex items-center gap-2 text-sm text-primary"><ArrowLeft size={15} />{ordered[position - 1].title}</DocLink> : <span />}
                {ordered[position + 1] && <DocLink to={ordered[position + 1].path} className="flex items-center gap-2 text-sm text-primary">{ordered[position + 1].title}<ArrowRight size={15} /></DocLink>}
              </div>}
            </> : <div role="alert"><h1 className="text-2xl font-semibold">Document not found</h1><p className="my-4 break-all text-muted-foreground">“{path}” is not included in this documentation.</p><Button asChild><DocLink to="spec/product/core-domains.md">Browse core domains</DocLink></Button></div>}
          </div>
          <aside aria-label="On this page" className="sticky top-16 hidden h-[calc(100vh-4rem)] overflow-y-auto px-4 py-10 xl:block print:hidden">
            <p className="mb-4 text-xs font-semibold text-muted-foreground">ON THIS PAGE</p>
            <nav className="space-y-3">{outline.filter((item) => item.depth === 2).map((item) => <a key={item.id} href={`#${item.id}`} className="block text-xs leading-relaxed text-muted-foreground hover:text-primary">{item.title}</a>)}</nav>
            <div className="mt-8 border-t pt-4 text-xs leading-relaxed text-muted-foreground">{doc && `${Math.max(1, Math.ceil(doc.source.split(/\s+/).length / 220))} min read`}<p className="mt-2">Rendered from repository Markdown.</p></div>
          </aside>
        </div>}
      </main>
    </div>
  </>;
}

createRoot(document.getElementById('root')!).render(<App />);
