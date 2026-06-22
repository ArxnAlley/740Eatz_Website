# Nulo Studio Code Style Guide

This document defines the coding standards used throughout all projects.

The goal is readability, consistency, maintainability, and craftsmanship.

Code should feel hand-built and immediately recognizable.

---

# Philosophy

Favor readability over brevity.

Allow generous whitespace.

Avoid compressed code.

Avoid dense AI-style markup.

Code should read like a document, not a minified output.

Every file should feel like it was written by the same developer.

When in doubt, favor clarity over cleverness.

The codebase should communicate craftsmanship.

---

# HTML Standards

## Section Banners

Major sections begin with large comment banners.

Example:

```html
<!-- ============================================================
     HERO SECTION
============================================================ -->
```

Use banners for:

- Header
- Navigation
- Hero
- About
- Services
- Gallery
- Contact
- Footer
- Etc.

---

## Element Spacing

Use generous whitespace.

Correct:

```html
<section class="heroSection">

    <div class="heroContainer">

        <h1>
            Emily & Cam
        </h1>

        <p>
            A Decade of Memories, A Lifetime To Go
        </p>

    </div>

</section>
```

Avoid dense markup.

---

## Attribute Formatting

Short elements may remain on one line.

Long elements should stack attributes vertically.

Correct:

```html
<img
    class="heroImage"
    src="images/heroImage.jpg"
    alt="Emily and Cam"
>
```

---

## Blank Lines

Insert blank lines between nested elements.

Allow code to breathe.

Favor readability over compression.

---

# CSS Standards

## Opening Braces

Opening braces always live on their own line.

Correct:

```css
.heroSection
{

}
```

Incorrect:

```css
.heroSection {

}
```

---

## Property Spacing

Insert blank lines between nearly every property.

Correct:

```css
.heroSection
{

    position: relative;

    width: 100%;

    height: 100vh;

    overflow: hidden;

    background-color: var(--colorBg);

}
```

Incorrect:

```css
.heroSection
{
    position: relative;
    width: 100%;
    height: 100vh;
}
```

Avoid compressed blocks.

---

## Single-Line Rules

Never write CSS selectors on a single line.

Incorrect:

```css
.button { color: white; }
```

Incorrect:

```css
.card:hover { opacity: .8; }
```

Correct:

```css
.button
{

    color: white;

}
```

Correct:

```css
.card:hover
{

    opacity: .8;

}
```

---

## Multi-Selector Groups

Allow selector groups to breathe.

Correct:

```css
.one,
.two,
.three
{

    property: value;

}
```

Avoid dense formatting.

---

## Major Section Banners

Use:

```css
/* ============================================================
   HERO SECTION
============================================================ */
```

Examples:

- Variables
- Reset
- Typography
- Header
- Navigation
- Hero
- Sections
- Footer
- Animations
- Media Queries

---

## Subsection Comments

Use:

```css
/* ── Typography ── */

/* ── Desktop Layout ── */

/* ── Buttons ── */
```

---

## Media Queries

Expand all media queries.

Correct:

```css
@media (min-width: 768px)
{

    .heroSection
    {

        padding: 4rem;

    }

}
```

Never compress media queries.

---

## Keyframes

Never compress keyframes.

Incorrect:

```css
@keyframes fadeUp
{
    from { opacity: 0; }

    to { opacity: 1; }
}
```

Correct:

```css
@keyframes fadeUp
{

    from
    {

        opacity: 0;

    }

    to
    {

        opacity: 1;

    }

}
```

---

## Selector Organization

One selector block at a time.

Group related selectors together.

Maintain generous whitespace.

Avoid dense walls of code.

---

# Naming Conventions

## Classes and IDs

Always use camelCase.

Correct:

```css
.heroSection

.heroContent

.mobileMenu

.contactForm
```

Incorrect:

```css
.hero-section

.hero_section

HeroSection
```

---

# File Structure

HTML:

```text
index.html
about.html
services.html
contact.html
```

CSS:

```text
css/styleIndex.css
css/stylePages.css
```

JavaScript:

```text
js/indexJS.js
js/siteJS.js
```

Assets:

```text
images/
logos/
```

Documentation:

```text
docs/
```

---

# General Rules

- Do not rename existing classes unnecessarily.
- Rewrite complete blocks when making changes.
- Preserve consistency across files.
- Favor maintainability over cleverness.
- Prefer reusable systems over one-off solutions.
- Do not generate compressed code.
- Code should feel handcrafted.
- Every file should immediately communicate craftsmanship.

---

# Density Test

Before completing a file, visually inspect it.

Ask:

- Does this feel compressed?
- Does it resemble stylePages.css?
- Does it feel handcrafted?
- Does it look pleasant to scroll through?

If not, increase spacing.

Code should read more like a document than source code.

---

# Reference Standard

stylePages.css is the gold standard.

Whenever uncertainty exists, mirror the formatting, spacing, rhythm, and craftsmanship found inside stylePages.css.

Every file should look like it was written by the same developer.

The codebase should immediately communicate quality and consistency rather than AI-generated output.