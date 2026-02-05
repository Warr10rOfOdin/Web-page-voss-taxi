# Content Management Guide

This guide helps you update content on the Voss Taxi website without touching the code.

## How to Update Text Content

All text content is stored in translation files in the `messages/` folder:
- `messages/no.json` - Norwegian text
- `messages/en.json` - English text

### Example: Changing the Hero Title

**Current text:**
- Norwegian: "Du køyrer trygt, med oss frå Voss!"
- English: "Drive safe with us, from Voss!"

**To change:**

1. Open `messages/no.json`
2. Find the line:
   ```json
   "title": "Du køyrer trygt, med oss frå Voss!"
   ```
3. Change the text between the quotes
4. Save the file

5. Open `messages/en.json`
6. Find the same line and update it
7. Save the file

8. Commit and push changes - the site will auto-update

### Important Rules

- ✅ **DO**: Change text between quotes
- ❌ **DON'T**: Change the keys (text before the colon)
- ❌ **DON'T**: Remove commas at the end of lines
- ❌ **DON'T**: Add or remove quotes

**Good example:**
```json
"title": "New title here",
```

**Bad example (broken):**
```json
newtitle: "New title here"  ❌ Wrong key name
"title": "New title here"   ❌ Missing comma
"title": New title here,    ❌ Missing quotes
```

## Common Content Updates

### Update Phone Number

Find and replace `+47 56 51 13 40` in:
- `messages/no.json`
- `messages/en.json`
- `components/layout/Header.tsx`
- `components/layout/Footer.tsx`
- `app/[locale]/layout.tsx` (JSON-LD schema)

### Update Email Address

Find and replace `post@vosstaxi.no` in:
- `messages/no.json`
- `messages/en.json`
- `components/layout/Footer.tsx`
- `app/[locale]/layout.tsx` (JSON-LD schema)

### Update Address

Find and replace `Uttrågata 19, 5700 Voss` in:
- `messages/no.json`
- `messages/en.json`
- `components/layout/Footer.tsx`
- `app/[locale]/layout.tsx` (JSON-LD schema)

### Add/Update Service Descriptions

Edit the relevant section in both translation files:

```json
"services": {
  "yourService": {
    "title": "Service Title",
    "description": "Service description here"
  }
}
```

Then add the service to the page component in `app/[locale]/services/page.tsx`.

## Adding New Content Sections

### Adding a Testimonial

1. Take a customer quote
2. Decide where to show it (currently placeholder in homepage)
3. Add to translation files:

```json
"testimonials": {
  "customer1": {
    "name": "Customer Name",
    "text": "This is what they said",
    "rating": "5"
  }
}
```

4. Update the Testimonials component to display it

### Adding a New Tour/Destination

Edit `app/[locale]/tourist/page.tsx` and add to the `destinations` array:

```tsx
{
  name: 'New Destination',
  description: 'Description of the destination'
}
```

## Content Best Practices

### Writing Style
- **Norwegian**: Use Nynorsk as shown in current content
- **English**: Keep simple and clear for tourists
- **Tone**: Professional but friendly
- **Length**: Keep descriptions concise (1-2 sentences)

### SEO Keywords
Make sure to include these keywords naturally:
- Voss taxi
- taxi Voss
- flyplasstransport Voss
- Bergen Flesland taxi
- sightseeing Voss
- taxi services Voss

### Accessibility
- Write descriptive link text (avoid "click here")
- Use clear, simple language
- Provide both languages for all content

## Content Checklist Before Publishing

- [ ] All content is in both Norwegian and English
- [ ] Phone numbers are clickable (use `tel:` links)
- [ ] Email addresses are clickable (use `mailto:` links)
- [ ] No typos or grammatical errors
- [ ] Brand name is consistent: "Voss Taxi"
- [ ] All CTAs are clear and action-oriented
- [ ] Contact information is up to date
- [ ] SEO keywords are included naturally

## Getting Help

If you need to make content changes but aren't comfortable editing JSON files:
1. Write down the changes you want to make
2. Note which page/section needs updating
3. Contact your developer with the list

**Format your request like this:**
```
Page: Homepage
Section: Hero
Current text: "Du køyrer trygt, med oss frå Voss!"
New text: "Your new text here"
```

This makes it easy to implement your changes quickly and accurately.
