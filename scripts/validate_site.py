#!/usr/bin/env python3
"""Validate the static site structure for deployment.

Checks that the required files and directories exist and that
the index/home page is well-formed enough to be served.
"""

import os
import sys

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

REQUIRED_FILES = [
    "index.html",
    "404.html",
    "sitemap.xml",
    "CNAME",
]

# Marker files that only need to exist (may be empty)
MARKER_FILES = [
    ".nojekyll",
]

REQUIRED_DIRS = [
    "assets",
    "assets/css",
    "assets/js",
    "img",
    "docs",
    "blog",
    "en",
]

REQUIRED_INDEX_MARKERS = [
    "<!doctype html>",
    "<html",
    "<head",
    "<body",
    "</html>",
]


def check_files() -> list[str]:
    """Return a list of error messages for missing required files."""
    errors: list[str] = []
    for name in REQUIRED_FILES:
        path = os.path.join(REPO_ROOT, name)
        if not os.path.isfile(path):
            errors.append(f"Missing required file: {name}")
        elif os.path.getsize(path) == 0:
            errors.append(f"Required file is empty: {name}")
    for name in MARKER_FILES:
        path = os.path.join(REPO_ROOT, name)
        if not os.path.isfile(path):
            errors.append(f"Missing required marker file: {name}")
    return errors


def check_dirs() -> list[str]:
    """Return a list of error messages for missing required directories."""
    errors: list[str] = []
    for name in REQUIRED_DIRS:
        path = os.path.join(REPO_ROOT, name)
        if not os.path.isdir(path):
            errors.append(f"Missing required directory: {name}")
    return errors


def check_index() -> list[str]:
    """Validate that index.html contains expected HTML markers."""
    errors: list[str] = []
    index_path = os.path.join(REPO_ROOT, "index.html")
    if not os.path.isfile(index_path):
        return ["index.html does not exist"]
    with open(index_path, encoding="utf-8") as f:
        content = f.read().lower()
    for marker in REQUIRED_INDEX_MARKERS:
        if marker not in content:
            errors.append(f"index.html missing expected marker: {marker}")
    return errors


def _has_files_with_ext(directory: str, ext: str) -> bool:
    """Check whether *directory* contains at least one file ending with *ext*."""
    try:
        return any(f.endswith(ext) for f in os.listdir(directory))
    except OSError:
        return False


def check_assets() -> list[str]:
    """Validate that CSS and JS assets exist."""
    errors: list[str] = []
    css_dir = os.path.join(REPO_ROOT, "assets", "css")
    js_dir = os.path.join(REPO_ROOT, "assets", "js")
    if os.path.isdir(css_dir) and not _has_files_with_ext(css_dir, ".css"):
        errors.append("No CSS files found in assets/css/")
    if os.path.isdir(js_dir) and not _has_files_with_ext(js_dir, ".js"):
        errors.append("No JS files found in assets/js/")
    return errors


def main() -> int:
    """Run all validation checks and report results."""
    print("Validating site structure...")
    all_errors: list[str] = []
    all_errors.extend(check_files())
    all_errors.extend(check_dirs())
    all_errors.extend(check_index())
    all_errors.extend(check_assets())

    if all_errors:
        print(f"\n✗ Validation failed with {len(all_errors)} error(s):\n")
        for err in all_errors:
            print(f"  - {err}")
        return 1

    print("✓ All required files and directories present")
    print("✓ index.html is well-formed")
    print("✓ Static assets (CSS/JS) found")
    print("\n✓ Site is ready for deployment")
    return 0


if __name__ == "__main__":
    sys.exit(main())
