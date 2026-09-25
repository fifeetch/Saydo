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
  note: '<path d="M14 2H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9z"/><path d="M14 2v7h7M8 14h8m-8 4h8"/>',
  list: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="m7 8 1 1 2-2m2 1h5m-10 5 1 1 2-2m2 1h5m-8 4H7m5 0h5"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18m-12 4 2 2 4-4"/>',
  paperclip: '<path d="m21.4 11.1-8.5 8.5a5.7 5.7 0 0 1-8-8l8.5-8.5a3.8 3.8 0 0 1 5.4 5.4L10.3 17a1.9 1.9 0 0 1-2.7-2.7l8-8"/>',
  upload: '<path d="M12 16V4m-5 5 5-5 5 5"/><path d="M4 16v4h16v-4"/>',
  trash: '<path d="M3 6h18m-2 0-.9 14H5.9L5 6m4 0V4h6v2m-5 4v6m4-6v6"/>',
  edit: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  pin: '<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"/>',
  google: '<path d="M20.4 12.2c0-.7-.1-1.4-.2-2H12v3.8h4.7a4 4 0 0 1-1.8 2.6v2.5h3.2c1.9-1.8 3-4.1 3-6.9Z" fill="#4285F4" stroke="none"/><path d="M12 21c2.4 0 4.4-.8 5.9-2.1l-3.2-2.5c-.9.6-1.8.9-2.7.9a5.2 5.2 0 0 1-4.9-3.5H3.8v2.6A9 9 0 0 0 12 21Z" fill="#34A853" stroke="none"/><path d="M7.1 13.8a5.3 5.3 0 0 1 0-3.6V7.6H3.8a9 9 0 0 0 0 8.8l3.3-2.6Z" fill="#FBBC05" stroke="none"/><path d="M12 6.7c1.3 0 2.5.5 3.4 1.4L18.2 5A9 9 0 0 0 3.8 7.6l3.3 2.6A5.2 5.2 0 0 1 12 6.7Z" fill="#EA4335" stroke="none"/>',
};
export function icon(name, className = '') {
  return `<svg class="icon ${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.book}</svg>`;
}
