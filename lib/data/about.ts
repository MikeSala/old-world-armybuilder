import type { Locale } from "@/lib/i18n/dictionaries";

export const ABOUT_SLUG = "about";

type LocalizedParagraphs = Partial<Record<Locale, string[]>> & { pl: string[] };

const ABOUT_CONTENT: LocalizedParagraphs = {
  pl: [
    "Jestem graczem — tak jak Ty, wędrowcze, który trafił na tę stronę.",
    "Moja historia z Warhammerem to opowieść z długą przerwą pośrodku. Lata mijały, życie toczyło się swoim tempem, a figurki czekały cierpliwie. Aż pewnego dnia, zupełnie przypadkiem, kupiłem Arbaala Niepokonanego. I wtedy coś drgnęło. Stary Świat, który zdawał się odległym wspomnieniem, nagle ożył na nowo — z całą swoją mroczną chwałą, zapachem farby i szumem kości toczonych po stole.",
    "Dziś kompletuję armię Wojowników Chaosu i z rosnącym zainteresowaniem przyglądam się kolejnym frakcjom. A ponieważ jestem nie tylko graczem, ale i programistą, naturalnym krokiem było połączenie obu pasji.",
    "Testowałem różne narzędzia do tworzenia roster. Niektóre były zbyt rozbudowane, inne zbyt toporne, jeszcze inne — porzucone przez twórców. Postanowiłem więc zbudować coś dla siebie: prosty, przejrzysty kreator armii, który robi dokładnie to, czego potrzebuję, i nic więcej. Gdy zaczął działać tak, jak sobie wymarzyłem, doszedłem do wniosku, że szkoda trzymać go tylko dla siebie.",
    "Tak powstał Army Builder — darmowe narzędzie do tworzenia list armii dla Warhammer: The Old World. Możesz w nim szybko skomponować roster, sprawdzić limity punktowe i wyeksportować gotową listę do PDF, JSON lub CSV. Dodałem również wyszukiwarkę statystyk jednostek — bo nawet mając wszystkie podręczniki, czasem po prostu chcesz w kilka sekund sprawdzić profil konkretnego modelu bez wertowania stron.",
    "Jedno jest dla mnie ważne: ta strona to uzupełnienie, nie zamiennik. Zachęcam do wspierania Games Workshop i kupowania oficjalnych materiałów. Army Builder ma być pomocnikiem — narzędziem, które sprawia, że planowanie armii i sprawdzanie zasad staje się odrobinę prostsze.",
    "Miłej zabawy przy stole, wędrowcze.",
  ],
  en: [
    "I'm a gamer — just like you, wanderer, who found your way to this page.",
    "My story with Warhammer is one with a long pause in the middle. Years went by, life moved at its own pace, and the miniatures waited patiently. Then one day, completely by chance, I bought Arbaal the Undefeated. And something stirred. The Old World, which had seemed like a distant memory, suddenly came alive again — with all its dark glory, the smell of paint, and the rattle of dice rolled across the table.",
    "Today I'm building my Warriors of Chaos army and looking with growing interest at other factions. And since I'm not only a gamer but also a developer, combining both passions was a natural step.",
    "I tested various roster-building tools. Some were too bloated, others too clunky, and some had been abandoned by their creators. So I decided to build something for myself: a simple, clean army builder that does exactly what I need and nothing more. When it started working just as I had envisioned, I realised it would be a shame to keep it to myself.",
    "That's how Army Builder was born — a free tool for creating army lists for Warhammer: The Old World. You can quickly compose a roster, check point limits, and export your finished list to PDF, JSON, or CSV. I also added a unit stats search — because even with all the rulebooks at hand, sometimes you just want to check a specific model's profile in seconds without flipping through pages.",
    "One thing matters to me: this site is a supplement, not a replacement. I encourage you to support Games Workshop and purchase official materials. Army Builder is meant to be a helper — a tool that makes army planning and rules checking just a bit easier.",
    "Enjoy your time at the table, wanderer.",
  ],
  fr: [
    "Je suis un joueur — tout comme toi, voyageur, qui as trouvé le chemin vers cette page.",
    "Mon histoire avec Warhammer est un récit avec une longue pause au milieu. Les années passaient, la vie suivait son cours, et les figurines attendaient patiemment. Puis un jour, tout à fait par hasard, j'ai acheté Arbaal l'Invaincu. Et quelque chose a bougé. Le Vieux Monde, qui semblait n'être qu'un souvenir lointain, a soudain repris vie — avec toute sa sombre gloire, l'odeur de la peinture et le cliquetis des dés roulant sur la table.",
    "Aujourd'hui, je complète mon armée des Guerriers du Chaos et je m'intéresse de plus en plus aux autres factions. Et comme je ne suis pas seulement un joueur mais aussi un développeur, combiner ces deux passions était une étape naturelle.",
    "J'ai testé divers outils de création de roster. Certains étaient trop complexes, d'autres trop lourds, d'autres encore abandonnés par leurs créateurs. J'ai donc décidé de construire quelque chose pour moi-même : un créateur d'armée simple et clair qui fait exactement ce dont j'ai besoin, rien de plus. Quand il a commencé à fonctionner comme je l'avais imaginé, j'ai réalisé qu'il serait dommage de le garder pour moi seul.",
    "C'est ainsi qu'est né Army Builder — un outil gratuit pour créer des listes d'armée pour Warhammer: The Old World. Tu peux rapidement composer un roster, vérifier les limites de points et exporter ta liste en PDF, JSON ou CSV. J'ai également ajouté un moteur de recherche de statistiques d'unités — car même avec tous les livres de règles sous la main, parfois tu veux simplement vérifier le profil d'un modèle spécifique en quelques secondes sans feuilleter des pages.",
    "Une chose compte pour moi : ce site est un complément, pas un substitut. Je t'encourage à soutenir Games Workshop et à acheter les matériaux officiels. Army Builder se veut un assistant — un outil qui rend la planification d'armée et la consultation des règles un peu plus simple.",
    "Amuse-toi bien à la table, voyageur.",
  ],
  de: [
    "Ich bin ein Spieler — genau wie du, Wanderer, der auf diese Seite gefunden hat.",
    "Meine Geschichte mit Warhammer ist eine Erzählung mit einer langen Pause in der Mitte. Jahre vergingen, das Leben nahm seinen Lauf, und die Miniaturen warteten geduldig. Dann, eines Tages, kaufte ich völlig zufällig Arbaal den Unbezwungenen. Und etwas regte sich. Die Alte Welt, die wie eine ferne Erinnerung erschienen war, erwachte plötzlich wieder zum Leben — mit all ihrer dunklen Pracht, dem Geruch von Farbe und dem Klappern der Würfel, die über den Tisch rollen.",
    "Heute vervollständige ich meine Armee der Krieger des Chaos und blicke mit wachsendem Interesse auf andere Fraktionen. Und da ich nicht nur Spieler, sondern auch Entwickler bin, war es ein natürlicher Schritt, beide Leidenschaften zu verbinden.",
    "Ich habe verschiedene Tools zur Roster-Erstellung getestet. Manche waren zu überladen, andere zu umständlich, wieder andere von ihren Entwicklern aufgegeben. Also beschloss ich, etwas für mich selbst zu bauen: einen einfachen, übersichtlichen Armeeplaner, der genau das tut, was ich brauche, und nichts mehr. Als er begann, so zu funktionieren, wie ich es mir vorgestellt hatte, wurde mir klar, dass es schade wäre, ihn nur für mich zu behalten.",
    "So entstand Army Builder — ein kostenloses Tool zur Erstellung von Armeelisten für Warhammer: The Old World. Du kannst schnell einen Roster zusammenstellen, Punktelimits überprüfen und deine fertige Liste als PDF, JSON oder CSV exportieren. Ich habe auch eine Einheitenstatistik-Suche hinzugefügt — denn selbst mit allen Regelbüchern zur Hand möchtest du manchmal einfach in Sekunden das Profil eines bestimmten Modells nachschlagen, ohne Seiten durchzublättern.",
    "Eines ist mir wichtig: Diese Seite ist eine Ergänzung, kein Ersatz. Ich ermutige dich, Games Workshop zu unterstützen und offizielle Materialien zu kaufen. Army Builder soll ein Helfer sein — ein Werkzeug, das die Armeeplanung und das Nachschlagen von Regeln ein wenig einfacher macht.",
    "Viel Spaß am Spieltisch, Wanderer.",
  ],
  es: [
    "Soy un jugador — igual que tú, viajero, que has encontrado el camino hasta esta página.",
    "Mi historia con Warhammer es un relato con una larga pausa en el medio. Los años pasaban, la vida seguía su curso, y las miniaturas esperaban pacientemente. Entonces, un día, completamente por casualidad, compré a Arbaal el Invicto. Y algo se despertó. El Viejo Mundo, que parecía un recuerdo lejano, de repente volvió a cobrar vida — con toda su oscura gloria, el olor a pintura y el repiqueteo de los dados rodando sobre la mesa.",
    "Hoy estoy completando mi ejército de Guerreros del Caos y miro con creciente interés hacia otras facciones. Y como no soy solo un jugador sino también desarrollador, combinar ambas pasiones fue un paso natural.",
    "Probé varias herramientas para crear roster. Algunas eran demasiado complejas, otras demasiado torpes, y otras habían sido abandonadas por sus creadores. Así que decidí construir algo para mí mismo: un creador de ejércitos simple y claro que hace exactamente lo que necesito, nada más. Cuando empezó a funcionar tal como lo había imaginado, me di cuenta de que sería una lástima guardarlo solo para mí.",
    "Así nació Army Builder — una herramienta gratuita para crear listas de ejército para Warhammer: The Old World. Puedes componer rápidamente un roster, verificar los límites de puntos y exportar tu lista a PDF, JSON o CSV. También añadí un buscador de estadísticas de unidades — porque incluso teniendo todos los manuales a mano, a veces simplemente quieres consultar el perfil de un modelo específico en segundos sin hojear páginas.",
    "Una cosa es importante para mí: este sitio es un complemento, no un sustituto. Te animo a apoyar a Games Workshop y comprar los materiales oficiales. Army Builder pretende ser un ayudante — una herramienta que hace que la planificación de ejércitos y la consulta de reglas sea un poco más sencilla.",
    "Que disfrutes en la mesa, viajero.",
  ],
};

export const getAboutContent = (locale: Locale): string[] =>
  ABOUT_CONTENT[locale] ?? ABOUT_CONTENT.pl;
