# 💸 RealCost — True Cost of Your Habits

A sleek dark-mode finance app that reveals the **real money cost** of your daily habits. Track, analyze, and get AI-powered insights on where your money is actually going.

🔗 **Live Demo → [realcost-sigma.vercel.app](https://real-cost-gules.vercel.app/)**

## ✨ Features

- **📊 Dashboard** — Monthly Cost and Yearly Cost cards at a glance
- **➕ Add / Edit / Delete habits** — emoji picker, cost per instance, frequency slider, live cost preview
- **📈 Two charts** — interactive pie chart (cost breakdown) + bar chart (spend by habit)
- **💚 Savings cards** — see exactly how much you'd save per year if you quit each habit
- **🤖 AI Insights** — AI analyzes your habits and tells you which ones to cut with rupee savings
- **📤 Export JSON** — download all your data anytime
- **📱 Fully responsive** — works on mobile, tablet, and desktop
- **🌑 Dark mode only** — premium fintech aesthetic

## 🚀 Quick Start

### 1. Clone the repo

```bash
git clone https://github.com/Yog-esh06/RealCost.git
cd RealCost/realcost
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up your API key

```bash
cp .env.local.example .env.local
```

Open `.env.local` and add your Gemini API key:

```env
GEMINI_API_KEY=your-key-here
```

Get a free key at [aistudio.google.com](https://aistudio.google.com).

> The app works fully without the API key — AI Insights just won't be available.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
realcost/
├── app/
│   ├── api/ai-insights/route.ts   # AI endpoint
│   ├── globals.css                 # Dark theme + animations
│   ├── layout.tsx
│   └── page.tsx                    # Main dashboard
├── components/
│   ├── ai/ai-insights-panel.tsx    # AI advisor with waste score ring
│   ├── charts/
│   │   ├── cost-pie-chart.tsx      # Interactive pie chart
│   │   └── time-bar-chart.tsx      # Bar chart
│   ├── dashboard/
│   │   ├── header.tsx
│   │   ├── stat-card.tsx           # Glowing stat cards
│   │   └── totals-bar.tsx          # Monthly + Yearly cost cards
│   ├── habits/
│   │   ├── habit-card.tsx          # Card with yearly savings
│   │   ├── habit-form.tsx          # Add/Edit dialog
│   │   └── habits-list.tsx
│   └── ui/                         # shadcn/ui components
├── lib/
│   ├── calculations.ts             # Weekly / monthly / yearly math
│   ├── storage.ts                  # localStorage + JSON export
│   └── utils.ts
├── store/habits-store.ts           # Zustand global state
├── types/index.ts                  # TypeScript interfaces
└── .env.local.example
```

## 🧮 How Costs Are Calculated

| Period  | Formula                              |
|---------|--------------------------------------|
| Weekly  | `cost per instance × times per week` |
| Monthly | `weekly cost × 4.345`                |
| Yearly  | `monthly cost × 12`                  |

## 🤖 AI Insights

Click **Analyze Habits** on the dashboard to get:

- A **Waste Score** (0–100)
- Top habits to cut with exact yearly savings in ₹
- Practical alternatives for each habit
- A motivational closing note

## 🛠️ Tech Stack

| Layer      | Tech                      |
|------------|---------------------------|
| Framework  | Next.js 15 (App Router)   |
| Language   | TypeScript                |
| Styling    | Tailwind CSS              |
| Components | shadcn/ui (Radix UI)      |
| Charts     | Recharts                  |
| State      | Zustand                   |
| Storage    | localStorage              |
| AI         | Google Gemini             |
| Deploy     | Vercel                    |

## 📄 License

MIT — free to use and build on.

---

Built with ♥ by [Yogesh R Mehta](https://github.com/Yog-esh06)
```
