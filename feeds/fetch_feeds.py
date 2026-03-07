#!/usr/bin/env python3
"""
RSS Feed Fetcher — collects items from configured feeds, dedupes, writes JSON.
No LLM involved. Pure data collection.

Run via cron every 15 min. Outputs feed-data.json for the web UI.
"""

import json
import os
import sys
import hashlib
import time
from datetime import datetime, timezone
from pathlib import Path

import feedparser

SCRIPT_DIR = Path(__file__).parent
CONFIG_PATH = SCRIPT_DIR / "config.json"
STATE_PATH = SCRIPT_DIR / "state.json"
OUTPUT_PATH = SCRIPT_DIR / "feed-data.json"
MAX_ITEMS = 500  # keep last N items in output

def load_json(path, default=None):
    if path.exists():
        with open(path) as f:
            return json.load(f)
    return default if default is not None else {}

def save_json(path, data):
    with open(path, 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def item_id(entry, feed_name):
    """Generate a stable ID for deduplication."""
    raw = entry.get('id') or entry.get('link') or entry.get('title', '')
    return hashlib.sha256(f"{feed_name}:{raw}".encode()).hexdigest()[:16]

def parse_timestamp(entry):
    """Extract best timestamp from feed entry."""
    for field in ('published_parsed', 'updated_parsed'):
        t = entry.get(field)
        if t:
            try:
                return datetime(*t[:6], tzinfo=timezone.utc).isoformat()
            except Exception:
                pass
    return datetime.now(timezone.utc).isoformat()

def matches_keywords(text, keywords):
    """Check if text contains any keyword (case-insensitive)."""
    text_lower = text.lower()
    return any(kw in text_lower for kw in keywords)

def fetch_feed(feed_config, timeout=15):
    """Fetch and parse a single feed."""
    try:
        d = feedparser.parse(feed_config['url'],
                           request_headers={'User-Agent': 'Edward-RSS/1.0'})
        if d.bozo and not d.entries:
            return [], f"Parse error: {d.bozo_exception}"
        return d.entries, None
    except Exception as e:
        return [], str(e)

def main():
    config = load_json(CONFIG_PATH)
    if not config:
        print("ERROR: No config.json found", file=sys.stderr)
        sys.exit(1)

    state = load_json(STATE_PATH, {"seen_ids": [], "last_run": None, "errors": {}})
    seen_ids = set(state.get("seen_ids", []))

    keywords_iran = [k.lower() for k in config.get("keywords_iran", [])]
    keywords_broad = [k.lower() for k in config.get("keywords_broad", [])]
    all_keywords = keywords_iran + keywords_broad

    # Load existing items
    existing = load_json(OUTPUT_PATH, {"items": [], "meta": {}})
    items = existing.get("items", [])
    errors = {}

    new_count = 0
    for feed_cfg in config.get("feeds", []):
        name = feed_cfg["name"]
        category = feed_cfg.get("category", "other")
        entries, err = fetch_feed(feed_cfg)

        if err:
            errors[name] = err
            continue

        for entry in entries:
            eid = item_id(entry, name)
            if eid in seen_ids:
                continue

            title = entry.get('title', '').strip()
            link = entry.get('link', '').strip()
            summary = entry.get('summary', '').strip()
            # Strip HTML tags from summary (basic)
            import re
            summary_clean = re.sub(r'<[^>]+>', '', summary)[:300]

            # Check keyword relevance
            search_text = f"{title} {summary_clean}"
            is_relevant = matches_keywords(search_text, all_keywords)
            is_iran = matches_keywords(search_text, keywords_iran)

            item = {
                "id": eid,
                "title": title,
                "link": link,
                "summary": summary_clean,
                "source": name,
                "category": category,
                "published": parse_timestamp(entry),
                "fetched": datetime.now(timezone.utc).isoformat(),
                "relevant": is_relevant,
                "iran_specific": is_iran
            }

            items.append(item)
            seen_ids.add(eid)
            new_count += 1

    # Sort by published date, newest first
    items.sort(key=lambda x: x.get("published", ""), reverse=True)

    # Trim to MAX_ITEMS
    items = items[:MAX_ITEMS]

    # Update output
    output = {
        "meta": {
            "last_updated": datetime.now(timezone.utc).isoformat(),
            "total_items": len(items),
            "new_this_run": new_count,
            "feeds_configured": len(config.get("feeds", [])),
            "errors": errors
        },
        "items": items
    }
    save_json(OUTPUT_PATH, output)

    # Update state (keep seen_ids trimmed)
    seen_list = list(seen_ids)[-2000:]  # keep last 2000 IDs
    state = {
        "seen_ids": seen_list,
        "last_run": datetime.now(timezone.utc).isoformat(),
        "errors": errors
    }
    save_json(STATE_PATH, state)

    print(f"Fetched {new_count} new items from {len(config['feeds'])} feeds. "
          f"Total: {len(items)}. Errors: {len(errors)}")
    if errors:
        for name, err in errors.items():
            print(f"  ERROR [{name}]: {err}", file=sys.stderr)

if __name__ == "__main__":
    main()
