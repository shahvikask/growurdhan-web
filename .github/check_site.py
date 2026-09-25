#!/usr/bin/env python3
"""Fail if a local link or image is missing, or an img has no alt attribute."""
from html.parser import HTMLParser
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]


class Parser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.hrefs = []
        self.imgs = []

    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        if tag == "a" and "href" in d:
            self.hrefs.append(d["href"])
        if tag == "img":
            self.imgs.append((d.get("src", ""), "alt" in d))


def local_target(page: Path, href: str):
    href = href.split("#", 1)[0].split("?", 1)[0]
    if not href or href.startswith(("http://", "https://", "mailto:", "tel:")):
        return None
    if href.startswith("/"):
        target = ROOT / href.lstrip("/")
    else:
        target = (page.parent / href).resolve()
    if target.is_dir():
        target = target / "index.html"
    return target


def main():
    errors = []
    pages = [p for p in ROOT.rglob("*.html") if ".git" not in p.parts]
    for page in pages:
        parser = Parser()
        parser.feed(page.read_text(encoding="utf-8"))
        for href in parser.hrefs:
            target = local_target(page, href)
            if target is None:
                continue
            if not target.is_file():
                errors.append(f"{page.relative_to(ROOT)} -> missing {href}")
        for src, has_alt in parser.imgs:
            if not has_alt:
                errors.append(f"{page.relative_to(ROOT)} img missing alt: {src}")
            target = local_target(page, src)
            if target is not None and not target.is_file():
                errors.append(f"{page.relative_to(ROOT)} -> missing image {src}")
    if errors:
        print("\n".join(errors))
        sys.exit(1)
    print(f"Checked {len(pages)} HTML files. Local links and image alts ok.")


if __name__ == "__main__":
    main()
