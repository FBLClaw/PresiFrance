import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { VercelAnalytics } from "@/components/VercelAnalytics";
import Index from "./pages/Index";
import CommunePage from "./pages/CommunePage";
import ExplorationPage from "./pages/ExplorationPage";
import DepartmentExplorationPage from "./pages/DepartmentExplorationPage";
import ResultatsPresidentiellePage from "./pages/ResultatsPresidentiellePage";
import ResultatsParCommunePage from "./pages/ResultatsParCommunePage";
import CartePresidentiellePage from "./pages/CartePresidentiellePage";
import ParticipationPresidentiellePage from "./pages/ParticipationPresidentiellePage";
import AbstentionPresidentiellePage from "./pages/AbstentionPresidentiellePage";
import PresidentialYearPage from "./pages/PresidentialYearPage";
import ParrainagesPage from "./pages/ParrainagesPage";
import ComparerPage from "./pages/ComparerPage";
import AnalysePage from "./pages/AnalysePage";
import PromessesBilanPage from "./pages/PromessesBilanPage";
import MentionsLegales from "./pages/MentionsLegales";
import PolitiqueConfidentialite from "./pages/PolitiqueConfidentialite";
import NotFound from "./pages/NotFound";
import { PRESIDENTIAL_YEAR_SUMMARIES } from "@/lib/presidentialSeo";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <VercelAnalytics />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/resultats-presidentielle" element={<ResultatsPresidentiellePage />} />
          <Route path="/resultats-presidentielle-par-commune" element={<ResultatsParCommunePage />} />
          <Route path="/carte-presidentielle" element={<CartePresidentiellePage />} />
          <Route path="/participation-presidentielle" element={<ParticipationPresidentiellePage />} />
          <Route path="/abstention-presidentielle" element={<AbstentionPresidentiellePage />} />
          {PRESIDENTIAL_YEAR_SUMMARIES.map(({ year }) => (
            <Route key={year} path={`/presidentielle-${year}`} element={<PresidentialYearPage />} />
          ))}
          <Route path="/commune/:code" element={<CommunePage />} />
          <Route path="/explorer" element={<ExplorationPage />} />
          <Route path="/explorer/:depCode" element={<DepartmentExplorationPage />} />
          <Route path="/parrainages" element={<ParrainagesPage />} />
          <Route path="/comparer" element={<ComparerPage />} />
          <Route path="/analyse" element={<AnalysePage />} />
          <Route path="/promesses-bilan" element={<PromessesBilanPage />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/politique-de-confidentialite" element={<PolitiqueConfidentialite />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
