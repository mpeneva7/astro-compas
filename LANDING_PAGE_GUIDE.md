# Dieila Landing Page - Publishing Guide

## 📋 What's Been Created

Your custom landing page has been created as `landing.html` with the following features:

### ✨ Design Features
- **Responsive Design**: Mobile-first approach, works on all screen sizes
- **Dark/Light Mode**: Theme toggle with localStorage persistence
- **Smooth Animations**: Fade-in effects, hover states, and scroll animations
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation
- **Tailwind CSS**: Using CDN for responsive utility classes
- **Modern Aesthetic**: Gradient backgrounds, clean typography, purple accent colors

### 📱 Page Sections
1. **Navigation Bar** - Fixed navbar with logo, nav links, and theme toggle
2. **Hero Section** - Compelling headline, subheadline, and 2 CTA buttons
3. **Features Grid** - 6 feature cards with icons and descriptions
4. **Testimonials** - 3 social proof cards with 5-star ratings
5. **Pricing Tiers** - 3 pricing options (Starter, Premium, Master)
6. **Final CTA** - Call-to-action section with visual emphasis
7. **Footer** - Contact info and dynamic product description

### 🛒 Gumroad Integration

The page includes 5 buy buttons strategically placed:
1. Hero section - "Get Started Now" button
2. Pricing Tier 1 - "Get Starter" button
3. Pricing Tier 2 - "Get Premium" button
4. Pricing Tier 3 - "Get Master" button
5. Final CTA section - "Start Your Journey Now" button

All buttons use `data-gumroad-action="buy"` for proper checkout integration.

### 📊 Dynamic Fields

The following fields pull live data from your Gumroad product:
- `data-gumroad-field="rating"` - Shows product rating
- `data-gumroad-field="review-count"` - Shows number of reviews
- `data-gumroad-field="description"` - Shows product description

## 📖 Publishing Instructions

### Step 1: Install Gumroad CLI

```bash
# Using Homebrew (macOS/Linux)
brew install antiwork/cli/gumroad

# OR using the install script
curl -fsSL https://gumroad.com/install-cli.sh | bash

# After installation, authenticate
gumroad auth login
```

### Step 2: Preview the Landing Page

Before publishing, preview and validate the page:

```bash
gumroad products page preview dieila ./landing.html --json --no-input --non-interactive
```

Check the output for:
- `.sanitization_report` - Should be empty or show only cosmetic changes
- `.warning` - Should NOT mention "page has no buy element"

If there are warnings about stripped elements, review the report and update the HTML if needed.

### Step 3: Publish the Landing Page

Once preview looks good, publish it:

```bash
gumroad products page publish dieila ./landing.html --json --no-input --non-interactive
```

### Step 4: Get Your Public URL

Find the live URL of your landing page:

```bash
gumroad products page url dieila --json --jq '.product.landing_url' --no-input --non-interactive
```

This URL is your custom product page that replaces the default Gumroad page.

### Step 5: Test the Buy Flow

1. Open your landing page URL in a browser
2. Click one of the buy buttons
3. Verify that the Gumroad checkout modal opens
4. Complete a test purchase (or cancel to just test the flow)

## 🎨 Customization Tips

### Colors
The page uses a purple/violet accent color. To change it, update these CSS variables in the `<style>` section:
```css
--accent-light: #7c3aed;  /* Light mode accent */
--accent-dark: #a78bfa;   /* Dark mode accent */
```

### Content
All text content can be edited directly in the HTML:
- Headlines, descriptions, features
- Testimonials and pricing information
- Button labels and CTA text

### Features to Modify
Edit the feature cards section to showcase your specific product benefits:
```html
<div class="feature-card">
    <div class="feature-icon">🌙</div>
    <h3>Feature Name</h3>
    <p>Feature description</p>
</div>
```

## ⚠️ Important Notes

1. **Do NOT modify** the `data-gumroad-*` attributes - these are required for checkout
2. **Keep the `<script>` tag** that contains the Gumroad integration logic
3. **Self-contained**: The page includes all CSS/JS inline - no external files needed
4. **Tailwind CDN**: Uses CDN for responsive classes - requires internet access

## 🔄 Updating the Page

To update your landing page after publishing:

1. Make changes to `landing.html`
2. Run preview again to validate changes
3. Publish with the same command - it will update the existing page
4. Gumroad typically caches pages, so may take a few minutes to see changes

## ❌ Removing the Custom Page

If you want to restore the default Gumroad product page:

```bash
gumroad products page clear dieila --yes --json --no-input --non-interactive
```

This will remove your custom landing page and restore the native Gumroad page.

## 🚀 Next Steps

1. ✅ Review the landing page design locally
2. ✅ Install Gumroad CLI on your machine
3. ✅ Run the preview command to validate
4. ✅ Publish with the publish command
5. ✅ Test the buy flow end-to-end
6. ✅ Share your custom landing URL with your audience

## 📧 Need Help?

If you encounter any issues:
- Check the `.sanitization_report` from the preview command
- Ensure all buy buttons have `data-gumroad-action="buy"`
- Make sure the HTML is properly formatted and closed
- Review Gumroad's documentation at gumroad.com/cli

Good luck with your custom landing page! 🚀✨
