declare module 'virtual:product-docs' {
  const content: {
    documents: { path: string; title: string; section: string; source: string }[];
    groups: { title: string; links: { title: string; path: string }[] }[];
  };
  export default content;
}
