import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

// Execute the real inline scripts with controlled DOM inputs; no network or test hits.
const source = readFileSync(new URL('../src/layouts/Base.astro', import.meta.url), 'utf8');
const scripts = [...source.matchAll(/<script is:inline>([\s\S]*?)<\/script>/g)].map(m => m[1]);
function setup(href = 'https://ansh0eman.in/') {
  const handlers = {}, observed = [], tags = [];
  class Element {
    constructor(attrs = {}, role = '') { this.attrs = attrs; this.role = role; this.id = attrs.id || ''; }
    getAttribute(name) { return this.attrs[name] ?? null; }
    closest(selector) {
      if (selector === 'a[href]') return this.role === 'link' ? this : null;
      if (selector === 'button, [role="button"]') return this.role === 'button' ? this : null;
      return { tagName: 'MAIN' };
    }
  }
  class HTMLInputElement extends Element {}
  class HTMLFormElement extends Element {}
  const location = new URL(href);
  const document = {
    readyState: 'loading', documentElement: { scrollHeight: 2000 },
    addEventListener(name, fn) { (handlers[name] ||= []).push(fn); },
    createElement: () => ({}), head: { appendChild: tag => tags.push(tag) },
    querySelectorAll() { assert.equal(document.readyState, 'complete', 'sections queried before DOM ready'); return [{ id: 'work' }, { id: 'notes' }]; }
  };
  const context = { location, document, URL, URLSearchParams, Element, HTMLInputElement, HTMLFormElement, innerHeight: 1000, scrollY: 0,
    addEventListener: document.addEventListener, requestAnimationFrame: fn => fn(),
    IntersectionObserver: class { constructor(fn) { context.intersect = fn; } observe(el) { observed.push(el); } unobserve() {} }
  };
  context.window = context;
  vm.createContext(context);
  scripts.forEach(script => vm.runInContext(script, context));
  const fire = (name, event = {}) => (handlers[name] || []).forEach(fn => fn(event));
  const events = () => (context.dataLayer || []).filter(e => e[0] === 'event').map(e => [e[1], e[2]]);
  return { context, tags, observed, document, fire, events, Element, HTMLInputElement, HTMLFormElement };
}
for (const host of ['localhost', 'deploy-preview-1--ansh0eman.netlify.app', 'ansh0eman.in.evil.example']) {
  const test = setup(`https://${host}/`); assert.equal(test.tags.length, 0); assert.equal(test.events().length, 0);
}
for (const query of ['utm_source=ig&utm_medium=social&utm_content=link_in_bio', 'utm_source=instagram&utm_medium=bio', 'utm_source=Instagram']) {
  const { context, tags } = setup(`https://ansh0eman.in/?${query}`);
  assert.equal(tags.length, 1); const config = context.dataLayer[1];
  assert.equal(config[1], 'G-SDMJBN6NQP'); assert.equal(config[2].campaign_source, 'instagram'); assert.equal(config[2].campaign_medium, 'social');
}
for (const query of ['', 'utm_source=newsletter&utm_medium=email', 'utm_source=instagram&utm_medium=paid_social']) {
  const { context } = setup(`https://ansh0eman.in/?${query}`);
  assert.equal(context.dataLayer[1][2].campaign_medium, undefined, 'must not overwrite unrelated/paid attribution');
}
const t = setup('https://ansh0eman.in/?analytics_debug=1&utm_source=ig&utm_medium=social');
assert.equal(t.context.dataLayer[1][2].debug_mode, true);
assert.equal(t.observed.length, 0); t.document.readyState = 'complete'; t.fire('DOMContentLoaded'); assert.equal(t.observed.length, 2);
for (const [href, kind, destination] of [
  ['/about/', 'internal', '/about/'], ['#work', 'anchor', '/#work'],
  ['/resume/resume.pdf?download=1#page=2', 'pdf', '/resume/resume.pdf#page=2'],
  ['https://github.com/ansh0eman?secret=omit', 'outbound', 'github.com/ansh0eman'],
  ['mailto:private@example.com?body=private', 'mailto', 'mailto:'], ['tel:12345', 'tel', 'tel:']
]) {
  t.fire('click', { target: new t.Element({ href }, 'link') });
  const [, value] = t.events().at(-1); assert.equal(value.link_kind, kind); assert.equal(value.link_destination, destination);
}
t.fire('auxclick', {button: 1, target: new t.Element({href:'/about/'}, 'link')}); assert.equal(t.events().at(-1)[0], 'site_link_click');
t.fire('click', {target:new t.Element({'data-analytics-label':'select_project_leda'}, 'button')}); assert.equal(t.events().at(-1)[1].button_label,'select_project_leda');
const input = new t.HTMLInputElement({id:'light-switch'}); input.checked=true; t.fire('change',{target:input}); assert.equal(t.events().at(-1)[1].button_label,'theme_dark');
t.fire('submit',{target:new t.HTMLFormElement({id:'contact'})}); assert.equal(t.events().at(-1)[1].form_id,'contact');
t.context.scrollY=950; t.fire('scroll'); t.fire('scroll');
assert.equal(JSON.stringify(t.events().filter(e=>e[0]==='site_scroll_depth').map(e=>e[1].scroll_percent)), '[25,50,75,90]');
t.context.intersect([{isIntersecting:true,target:{id:'work'}}]); t.context.intersect([{isIntersecting:true,target:{id:'work'}}]);
assert.equal(t.events().filter(e=>e[0]==='site_section_view').length,1);
assert.ok(t.events().every(e=>e[1].page_path==='/'));
console.log('PASS: production host guard; Instagram normalization without inventing source; debug opt-in; DOM-ready sections; internal/anchor/PDF/outbound/contact links; middle-click; buttons; theme; form identifiers; scroll and section deduplication.');
