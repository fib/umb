```bash
git clone git@github.com:fib/umb.git
cd umb
npm i
npm run dev -- --open
```

----

This tool aims to provide a convenient way to browse courses offered at UMass Boston. It enables you to filter courses by keywords, subjects, and gen-ed/diversity attributes.

Scraping done in Python with [Requests](https://requests.readthedocs.io/en/latest/). Parsed with [BeautifulSoup](https://www.crummy.com/software/BeautifulSoup/bs4/doc/).

Web UI written using [svelte-table](https://github.com/dasDaniel/svelte-table) and [Pico.css](https://picocss.com/).


