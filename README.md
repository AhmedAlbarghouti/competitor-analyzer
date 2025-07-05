## Project Overview

**Product Radar** is a web platform that empowers users to analyze competitor websites and gain actionable insights. The application streamlines the process of competitive intelligence by combining advanced web crawling with real-time brand and sentiment analysis.

### Key Features

- **User Authentication:** Secure login and signup to manage your analyses and results.
- **Competitor Analysis Workflow:**  
  Users can initiate an analysis for up to three competitor websites. Each analysis is split into two comprehensive phases:

  1. **Website Crawling & Content Analysis**

     - The platform creates an analysis record in the database for tracking.
     - Using Tavily, it crawls the target site, focusing on all pages—especially news, latest products, compliance documents, and terms of service.
     - The system analyzes the content to determine:
       - What the company does
       - Its current direction and focus
       - Compliance posture and any notable legal or regulatory details
       - Other interesting or unique findings

  2. **Brand & Sentiment Analysis**
     - The platform gathers recent posts and discussions about the competitor from X (Twitter) and Reddit, using Bright Data.
     - It performs brand and sentiment analysis to gauge public perception and surface trending opinions.

- **Results Dashboard:**  
  Once both phases are complete, the analysis record is updated from "pending" to "ready for review." Users can view detailed, compelling reports through an intuitive UI and revisit past analyses for ongoing comparisons.

- **Analysis Limits:**  
  Each user can analyze up to three competitor websites, ensuring focused, high-value insights.

**Product Radar** provides a powerful, unified interface for discovering what your competitors are doing, how they’re perceived, and what you can learn from their strategies—all in one place.
