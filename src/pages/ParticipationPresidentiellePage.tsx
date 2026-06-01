import { BarChart3, MapPin, Search } from "lucide-react";

import SeoConnectorPage from "./SeoConnectorPage";

export default function ParticipationPresidentiellePage() {
  return (
    <SeoConnectorPage
      path="/participation-presidentielle"
      eyebrow="Mobilisation électorale"
      title="Participation présidentielle"
      description="Analysez la participation à l'élection présidentielle par commune et département : niveaux de mobilisation, comparaison locale et données officielles."
      intro="La participation présidentielle mesure la part des électeurs inscrits qui se déplacent pour voter. Elle donne une lecture essentielle de la mobilisation politique, au niveau national comme dans chaque commune."
      answerTitle="Qu'est-ce que la participation à la présidentielle ?"
      answer="La participation correspond au rapport entre le nombre de votants et le nombre d'inscrits. Elle permet de comparer la mobilisation entre communes, départements, tours et années électorales."
      cards={[
        { title: "Mobilisation locale", text: "Identifier les communes où les électeurs se déplacent davantage ou moins qu'ailleurs.", Icon: MapPin },
        { title: "Comparaison utile", text: "Comparer deux territoires sur la participation et les scores des candidats.", Icon: BarChart3 },
        { title: "Lecture par année", text: "Observer les variations de mobilisation d'un scrutin présidentiel à l'autre.", Icon: Search },
      ]}
      stepsTitle="Comment analyser la participation ?"
      steps={[
        "Ouvrez une fiche commune pour consulter les inscrits, votants et pourcentages.",
        "Comparez cette commune à un autre territoire ou à son département.",
        "Changez d'année pour observer les évolutions de mobilisation.",
      ]}
      faq={[
        { question: "Participation et abstention sont-elles liées ?", answer: "Oui. L'abstention est la lecture inverse de la participation parmi les inscrits." },
        { question: "Pourquoi comparer par commune ?", answer: "Parce que la mobilisation peut varier fortement entre deux territoires proches." },
      ]}
    />
  );
}
