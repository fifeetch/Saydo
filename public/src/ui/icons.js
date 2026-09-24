const paths = {
  book: '<path d="M12 6c-3-2-7-2-10-1v15c3-1 7-1 10 1 3-2 7-2 10-1V5c-3-1-7-1-10 1Zm0 0v15"/>',
  home: '<path d="m3 10 9-7 9 7v11H3Zm6 11v-8h6v8"/>',
  family: '<circle cx="12" cy="6" r="3"/><path d="M6 21v-5a6 6 0 0 1 12 0v5M4 5a3 3 0 0 0 0 6m16-6a3 3 0 0 1 0 6M4 14a4 4 0 0 0-3 4v3m19-7a4 4 0 0 1 3 4v3"/>',
  heart: '<path d="M20 5c-3-3-7-1-8 1-1-2-5-4-8-1-6 6 8 15 8 15s14-9 8-15Z"/>',
  work: '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V3h8v4M3 12l9 3 9-3m-9 0v5"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m16 8-3 5-5 3 3-5Z"/>',
  inbox: '<path d="M3 14 6 4h12l3 10v6H3Zm0 0h5l2 3h4l2-3h5"/>',
  arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
  mic: '<rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 10v3a7 7 0 0 0 14 0v-3m-7 10v3m-4 0h8"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 1v2m0 18v2M1 12h2m18 0h2M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2"/>',
};
export function icon(name, className = '') {
  return `<svg class="icon ${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.book}</svg>`;
}
