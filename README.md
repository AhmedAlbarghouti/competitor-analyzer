## Project Overview

**Competition Radar** is a web platform that empowers users to analyze competitor websites and gain actionable insights. The application streamlines the process of competitive intelligence by combining advanced web crawling with real-time brand and sentiment analysis.

### Key Features

- **User Authentication:** Secure login and signup to manage your analysis and results.
- **Competitor Analysis Workflow:**  
  Users can initiate an analysis for up to three competitor websites. Each analysis is split into two comprehensive phases:

  1. **Website Crawling & Content Analysis**

     - The platform creates an analysis record in the database for tracking.
     - Crawling is performed using **Tavily** to extract content from the target site, focusing on all relevant pages—especially news, latest products, compliance documents, and terms of service.
     - Content analysis is powered by **Gemini**, providing deep insights into:
       - What the company does
       - Its current direction and focus
       - Compliance posture and any notable legal or regulatory details
       - Other interesting or unique findings

  2. **Brand & Sentiment Analysis**
     - The platform gathers recent posts and discussions about the competitor from X (Twitter) and Reddit using **Bright Data** for post crawling.
     - Brand and sentiment analysis is conducted with **Gemini** to gauge public perception and surface trending opinions.

- **Results Dashboard:**  
  Once both phases are complete, the analysis record is updated from "pending" to "ready for review." Users can view detailed, compelling reports through an intuitive UI and revisit past analyses for ongoing comparisons.

- **Analysis Limits:**  
  Each user can analyze up to three competitor websites, ensuring focused, high-value insights.

**Competition Radar** provides a powerful, unified interface for discovering what your competitors are doing, how they’re perceived, and what you can learn from their strategies—all in one place.

---

### Technical Implementation

- **Website Crawling & Content Analysis:**
  - Crawling is performed using **Tavily**.
  - Content is analyzed using **Gemini**.
- **Brand Sentiment Post Crawling:**
  - Posts are crawled from X (Twitter) and Reddit using **Bright Data**.
  - Sentiment and brand analysis is performed using **Gemini**.
- **Database:**
  - All analysis records and user data are stored in **Supabase**.
- **Authentication:**
  - User authentication is handled via **Supabase Auth**.

### API Key Setup

To use the competitor analysis endpoint, you'll need to set up the following API keys in your `.env.local` file:

```
TAVILY_API_KEY=your_tavily_api_key
GEMINI_API_KEY=your_gemini_api_key
```

You can obtain these API keys from:
- Tavily API: [https://tavily.com/](https://tavily.com/)
- Gemini API: [https://ai.google.dev/](https://ai.google.dev/)
