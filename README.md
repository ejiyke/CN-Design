# Connect Nigeria (CN) Design System

> An enterprise-grade marketplace design system and interactive portal inspired by **[Material Design 3 (m3.material.io)](https://m3.material.io/)**, built for **Connect Nigeria** and **Urgent.ng**.

---

## 🎨 Overview & Brand Identity

- **Figma Source:** [CN Design System (Figma)](https://www.figma.com/design/1GkPo4rYklRXsakNrZv2Ws/CN-Design-System?node-id=33-3759)
- **Primary Brand Signature:** `#93c700` / `#a6d445` (CN Green 500)
- **Neutral Foundation:** `#1b2330` (CN Blue / Slate 700)
- **Promotional & Alerts:** `#e28a2a` (CN Amber / Yellow)
- **Target Typography:** `Archivo` (Google Fonts)
- **Spatial Grid:** Modular incremental 4px baseline

---

## 🚀 Key Portal Features

1. **Material Design 3 Architecture**:
   - Translucent top app bar with blur effect (`backdrop-filter: blur(16px)`).
   - Sticky navigation sidebar with categorized sections and active scrollspy.
   - Global Command Palette (`Ctrl + K` or `Cmd + K`) for instant token and component discovery.
   - Real-time **Dark Mode & Light Mode** toggle with persisted preferences.

2. **Foundations (Page 1)**:
   - **Color Palettes**: CN Green (50–900), CN Yellow/Amber, CN Slate/Blue, and WCAG AA/AAA-calibrated Semantic tokens. Click any swatch to copy Hex codes with toast feedback.
   - **Typography Scale**: Complete Archivo typographic scale with an **Interactive Live Type Tester** (sliders for font size and font weight).
   - **Elevation Visualizer**: Standardized shadow depths from `--elevation-none` to `--elevation-xl`.
   - **Spacing & Radius**: Visual scale representation from `4px` to `80px`.
   - **Responsive Breakpoints**: Grid definitions for 1440px Desktop, 1280px Narrow, 768px Tablet, and 390px Mobile.

3. **Core Components (Page 2 & 3)**:
   - **Buttons**: 6 Hierarchies (Primary Accent, Secondary Slate, Outline, Ghost, Dark, Destructive) in 3 standard sizes (`sm`, `md`, `lg`) with preview & copyable HTML snippets.
   - **Badges & Chips**: Verified status badges with pulsing indicator dots, alongside filter chips with dismiss handles.
   - **Form Controls**: Text fields with prefix icons and error states, select dropdowns, custom checkboxes, radio buttons, and animated toggle switches.
   - **Nigerian Naira (₦) Price Slider**: Dual-range pricing slider with live updates.

4. **Marketplace Patterns (Page 4)**:
   - **Product Listing Card (Grid View - 300px × 416px)**: High-utility card featuring Naira pricing (`₦1,850,000`), favorite heart toggle, verified badge, location metadata, and ratings.
   - **Product Listing Card (List View)**: Horizontal card layout for search feeds.
   - **Verified Merchant Trust Card**: Seller profile highlighting trust metrics, response time, and contact actions.
   - **Faceted Filter Sidebar**: Faceted filters for state, condition, ratings, and active chips.

5. **Overlays, Messaging & Feedback (Page 5)**:
   - **In-App Messaging Thread**: Transaction messaging with green-tinted outgoing bubbles (`--cn-green-200`), white incoming bubbles, quick-reply pills, and simulated auto-replies.
   - **Drag & Drop Media Uploader**: Dashed green boundary dropzone with animated upload progress bars.
   - **Toast Notifications**: Interactive triggers for Success, Error, Warning, and Info alerts.
   - **Modal Dialogs**: Backdrop-blurred modal dialogs.

6. **Developer Tools**:
   - Raw CSS custom properties viewer (`tokens.css`).
   - Implementation checklist for frontend engineering handoff.

---

## 💻 Getting Started Locally

No complex dependencies or node setup required! Simply open `index.html` in any modern browser:

```bash
# Clone the repository
git clone https://github.com/ejiyke/CN-Design.git

# Navigate into the project directory
cd CN-Design

# Start a local static server (optional)
python -m http.server 3000
```

Open `http://localhost:3000` in your browser.
