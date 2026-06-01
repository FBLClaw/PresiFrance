import { BarChart3, Database, MapPin } from "lucide-react";

import SeoConnectorPage from "./SeoConnectorPage";


export default function AbstentionPresidentiellePage() {
  return (
    <SeoConnectorPage
      path="/abstention-presidentielle"
      eyebrow="Non-vote et territoires"
      title="Abstention présidentielle"
      description="Consultez l'abstention à l'élection présidentielle par commune et département : écarts locaux, participation inverse et données officielles."
      intro="L'abstention présidentielle indique la part des électeurs inscrits qui ne votent pas. Elle est indispensable pour comprendre la mobilisation réelle derrière les scores des candidats."
      answerTitle="Comment lire l'abstention présidentielle ?"
      answer="L'abstention se calcule à partir des inscrits qui ne figurent pas parmi les votants. La comparer par commune aide à repérer les écarts de mobilisation, les ruptures locales et les évolutions entre deux élections."
      cards={[
        { title: "Signal démocratique", text: "L'abstention nuance les scores des candidats en montrant le niveau réel de mobilisation.", Icon: BarChart3 },
        { title: "Écarts locaux", text: "Deux communes voisines peuvent afficher des niveaux d'abstention très différents.", Icon: MapPin },
        { title: "Données vérifiables", text: "Les fiches locales s'appuient sur les résultats publics disponibles.", Icon: Database },
      ]}
      stepsTitle="Comment comparer l'abstention ?"
      steps={[
        "Sélectionnez une commune pour consulter participation et abstention.",
        "Comparez avec une autre commune pour mesurer les écarts locaux.",
        "Revenez aux pages année pour replacer le scrutin dans son contexte.",
      ]}
      faq={[
        { question: "L'abstention change-t-elle l'interprétation des scores ?", answer: "Oui. Un score élevé n'a pas la même portée selon le niveau de participation." },
        { question: "Peut-on suivre l'abstention dans le temps ?", answer: "Oui, les fiches communes permettent de comparer les scrutins disponibles." },
      ]}
    />
  );
}
