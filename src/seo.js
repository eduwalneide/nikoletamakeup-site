/* SEO map for the multi-page build: URL slugs, titles and descriptions per language and page. */
module.exports = {
  SITE_URL: 'https://nikoletamakeup.com',
  LANGS: ['en', 'es', 'ca', 'fr', 'de', 'it', 'pt', 'lt', 'ru'],
  DEFAULT_LANG: 'en',
  PAGES: ['home', 'services', 'portfolio', 'destinations', 'indian', 'reviews', 'contact'],

  /* which template sections (by id / selector) each page shows, in order */
  SECTIONS: {
    home: ['#top', '.credits', '#team', '#instagram'],
    services: ['#services', '#process'],
    portfolio: ['#portfolio', '#before-after'],
    destinations: ['#destinations'],
    indian: ['#indian-weddings'],
    reviews: ['#testimonials'],
    contact: ['#contact']
  },

  /* in-page anchors → the page that contains them */
  ANCHOR_PAGE: {
    top: 'home', team: 'home', instagram: 'home',
    portfolio: 'portfolio', 'portfolio-makeup': 'portfolio', 'portfolio-hair': 'portfolio', 'before-after': 'portfolio',
    services: 'services', rows: 'services', process: 'services',
    destinations: 'destinations',
    'indian-weddings': 'indian',
    testimonials: 'reviews',
    contact: 'contact'
  },
  /* the anchor that IS the page (no #hash needed when linking to it) */
  PAGE_MAIN_ANCHOR: { home: 'top', services: 'services', portfolio: 'portfolio', destinations: 'destinations', indian: 'indian-weddings', reviews: 'testimonials', contact: 'contact' },

  /* nav link (by data-i18n key) → page */
  NAV_PAGE: { v5_nav_about: 'home', nav_port: 'portfolio', v5_nav_ba: 'portfolio', v4_nav_services: 'services', v5_nav_how: 'services', v5_nav_dest: 'destinations', nav_ind: 'indian', v5_nav_reviews: 'reviews', v4_nav_contact: 'contact' },

  SLUGS: {
    en: { services: 'services', portfolio: 'portfolio', destinations: 'destination-weddings', indian: 'indian-weddings', reviews: 'reviews', contact: 'contact' },
    es: { services: 'servicios', portfolio: 'portfolio', destinations: 'bodas-destino', indian: 'bodas-indias', reviews: 'opiniones', contact: 'contacto' },
    ca: { services: 'serveis', portfolio: 'portfolio', destinations: 'casaments-desti', indian: 'casaments-indis', reviews: 'opinions', contact: 'contacte' },
    fr: { services: 'prestations', portfolio: 'portfolio', destinations: 'mariages-destination', indian: 'mariages-indiens', reviews: 'temoignages', contact: 'contact' },
    de: { services: 'leistungen', portfolio: 'portfolio', destinations: 'destination-hochzeiten', indian: 'indische-hochzeiten', reviews: 'stimmen', contact: 'kontakt' },
    it: { services: 'servizi', portfolio: 'portfolio', destinations: 'matrimoni-destination', indian: 'matrimoni-indiani', reviews: 'testimonianze', contact: 'contatti' },
    pt: { services: 'servicos', portfolio: 'portfolio', destinations: 'casamentos-destino', indian: 'casamentos-indianos', reviews: 'depoimentos', contact: 'contacto' },
    lt: { services: 'paslaugos', portfolio: 'portfolio', destinations: 'vestuves-uzsienyje', indian: 'indiskos-vestuves', reviews: 'atsiliepimai', contact: 'kontaktai' },
    ru: { services: 'uslugi', portfolio: 'portfolio', destinations: 'svadby-za-granitsej', indian: 'indijskie-svadby', reviews: 'otzyvy', contact: 'kontakty' }
  },

  /* breadcrumb / short page names */
  NAMES: {
    en: { home: 'Home', services: 'Services & prices', portfolio: 'Portfolio', destinations: 'Destination weddings', indian: 'Indian weddings', reviews: 'Reviews', contact: 'Contact' },
    es: { home: 'Inicio', services: 'Servicios y precios', portfolio: 'Portfolio', destinations: 'Bodas destino', indian: 'Bodas indias', reviews: 'Opiniones', contact: 'Contacto' },
    ca: { home: 'Inici', services: 'Serveis i preus', portfolio: 'Portfolio', destinations: 'Casaments destí', indian: 'Casaments indis', reviews: 'Opinions', contact: 'Contacte' },
    fr: { home: 'Accueil', services: 'Prestations & tarifs', portfolio: 'Portfolio', destinations: 'Mariages destination', indian: 'Mariages indiens', reviews: 'Témoignages', contact: 'Contact' },
    de: { home: 'Start', services: 'Leistungen & Preise', portfolio: 'Portfolio', destinations: 'Destination-Hochzeiten', indian: 'Indische Hochzeiten', reviews: 'Stimmen', contact: 'Kontakt' },
    it: { home: 'Home', services: 'Servizi e prezzi', portfolio: 'Portfolio', destinations: 'Matrimoni destination', indian: 'Matrimoni indiani', reviews: 'Testimonianze', contact: 'Contatti' },
    pt: { home: 'Início', services: 'Serviços e preços', portfolio: 'Portfólio', destinations: 'Casamentos destino', indian: 'Casamentos indianos', reviews: 'Depoimentos', contact: 'Contacto' },
    lt: { home: 'Pradžia', services: 'Paslaugos ir kainos', portfolio: 'Portfolio', destinations: 'Vestuvės užsienyje', indian: 'Indiškos vestuvės', reviews: 'Atsiliepimai', contact: 'Kontaktai' },
    ru: { home: 'Главная', services: 'Услуги и цены', portfolio: 'Портфолио', destinations: 'Свадьбы за границей', indian: 'Индийские свадьбы', reviews: 'Отзывы', contact: 'Контакты' }
  },

  META: {
    en: {
      home: ['Bridal Hair & Makeup in Barcelona | Nikoleta Makeup & Team', 'Award-winning bridal hair and makeup in Barcelona and destination weddings across Europe. One trusted team from the trial to the wedding morning, since 2008.'],
      services: ['Bridal Makeup & Hair Prices 2027 · Barcelona | Nikoleta Makeup & Team', 'Wedding hair and makeup packages and prices for 2027: bridal styling, trial, full package, bridal party, guests, beauty corner, groom. Transparent from the first email.'],
      portfolio: ['Bridal Makeup & Hair Portfolio | Nikoleta Makeup & Team', 'Real brides, real wedding mornings: soft glam, Hollywood waves, chignons and radiant natural skin by Nikoleta Makeup & Team, Barcelona.'],
      destinations: ['Destination Wedding Hair & Makeup in Europe | Nikoleta Makeup & Team', 'A hair and makeup team travelling from Barcelona to Costa Brava, Mallorca, Ibiza, Lake Como, Amalfi, Paris, the French Riviera, London, Portugal, Greece and Dubai.'],
      indian: ['Indian Wedding Makeup Artist in Barcelona | Nikoleta Makeup & Team', 'Hair and makeup for multi-day Indian weddings in Spain and Europe: Sangeet, Mehndi, Haldi, Pheras, Sikh ceremony and reception. Up to two artists dedicated to the bride.'],
      reviews: ['Bride Reviews & Kind Words | Nikoleta Makeup & Team', 'What brides, mothers, guests and planners say about Nikoleta Makeup & Team, 2019 – 2026. Transcribed from Instagram, WhatsApp, email and handwritten cards.'],
      contact: ['Check Your Wedding Date | Nikoleta Makeup & Team, Barcelona', 'Send your date, venue and party size and Nikoleta replies personally with availability and a proposed timeline. Barcelona, Spain and destination weddings.']
    },
    es: {
      home: ['Maquillaje y peluquería de novia en Barcelona | Nikoleta Makeup & Team', 'Maquillaje y peluquería de novia premiados en Barcelona y bodas destino en toda Europa. Un solo equipo de confianza, de la prueba a la mañana de la boda, desde 2008.'],
      services: ['Precios maquillaje y peluquería de novia 2027 · Barcelona | Nikoleta Makeup & Team', 'Paquetes y precios 2027 de maquillaje y peluquería para bodas: novia, prueba, paquete completo, cortejo, invitadas, beauty corner, novio. Transparentes desde el primer email.'],
      portfolio: ['Portfolio de maquillaje y peinados de novia | Nikoleta Makeup & Team', 'Novias reales, mañanas de boda reales: soft glam, ondas Hollywood, recogidos y piel luminosa y natural por Nikoleta Makeup & Team, Barcelona.'],
      destinations: ['Maquillaje y peluquería para bodas destino en Europa | Nikoleta Makeup & Team', 'Equipo de maquillaje y peluquería que viaja desde Barcelona a Costa Brava, Mallorca, Ibiza, Lago de Como, Amalfi, París, Costa Azul, Londres, Portugal, Grecia y Dubái.'],
      indian: ['Maquilladora para bodas indias en Barcelona | Nikoleta Makeup & Team', 'Maquillaje y peluquería para bodas indias de varios días en España y Europa: Sangeet, Mehndi, Haldi, Pheras, ceremonia sij y recepción. Hasta dos artistas dedicadas a la novia.'],
      reviews: ['Opiniones de novias | Nikoleta Makeup & Team', 'Lo que dicen novias, madres, invitadas y planners sobre Nikoleta Makeup & Team, 2019 – 2026. Transcrito de Instagram, WhatsApp, email y tarjetas escritas a mano.'],
      contact: ['Consulta tu fecha de boda | Nikoleta Makeup & Team, Barcelona', 'Envía tu fecha, lugar y número de personas y Nikoleta te responde personalmente con disponibilidad y una propuesta de horario. Barcelona, España y bodas destino.']
    },
    ca: {
      home: ['Maquillatge i pentinat de núvia a Barcelona | Nikoleta Makeup & Team', 'Maquillatge i pentinat de núvia premiats a Barcelona i casaments destí a tot Europa. Un sol equip de confiança, de la prova al matí del casament, des del 2008.'],
      services: ['Preus maquillatge i pentinat de núvia 2027 · Barcelona | Nikoleta Makeup & Team', 'Paquets i preus 2027 de maquillatge i pentinat per a casaments: núvia, prova, paquet complet, seguici, convidades, beauty corner, nuvi. Transparents des del primer correu.'],
      portfolio: ['Portfolio de maquillatge i pentinats de núvia | Nikoleta Makeup & Team', 'Núvies reals, matins de casament reals: soft glam, ones Hollywood, recollits i pell lluminosa i natural per Nikoleta Makeup & Team, Barcelona.'],
      destinations: ['Maquillatge i pentinat per a casaments destí a Europa | Nikoleta Makeup & Team', 'Equip de maquillatge i pentinat que viatja des de Barcelona a la Costa Brava, Mallorca, Eivissa, Llac de Como, Amalfi, París, Costa Blava, Londres, Portugal, Grècia i Dubai.'],
      indian: ['Maquilladora per a casaments indis a Barcelona | Nikoleta Makeup & Team', 'Maquillatge i pentinat per a casaments indis de diversos dies a Espanya i Europa: Sangeet, Mehndi, Haldi, Pheras, cerimònia sikh i recepció. Fins a dues artistes dedicades a la núvia.'],
      reviews: ['Opinions de núvies | Nikoleta Makeup & Team', 'El que diuen núvies, mares, convidades i planners sobre Nikoleta Makeup & Team, 2019 – 2026. Transcrit d\'Instagram, WhatsApp, correu i targetes escrites a mà.'],
      contact: ['Consulta la teva data de casament | Nikoleta Makeup & Team, Barcelona', 'Envia la teva data, lloc i nombre de persones i la Nikoleta et respon personalment amb disponibilitat i una proposta d\'horari. Barcelona, Espanya i casaments destí.']
    },
    fr: {
      home: ['Coiffure & maquillage de mariée à Barcelone | Nikoleta Makeup & Team', 'Coiffure et maquillage de mariée primés à Barcelone et mariages destination dans toute l\'Europe. Une seule équipe de confiance, de l\'essai au matin du mariage, depuis 2008.'],
      services: ['Tarifs maquillage & coiffure de mariée 2027 · Barcelone | Nikoleta Makeup & Team', 'Forfaits et tarifs 2027 de coiffure et maquillage de mariage : mariée, essai, forfait complet, cortège, invitées, beauty corner, marié. Transparents dès le premier e-mail.'],
      portfolio: ['Portfolio maquillage & coiffure de mariée | Nikoleta Makeup & Team', 'De vraies mariées, de vrais matins de mariage : soft glam, ondulations Hollywood, chignons et peau lumineuse et naturelle par Nikoleta Makeup & Team, Barcelone.'],
      destinations: ['Coiffure & maquillage pour mariages destination en Europe | Nikoleta Makeup & Team', 'Une équipe coiffure et maquillage qui se déplace de Barcelone vers la Costa Brava, Majorque, Ibiza, le lac de Côme, Amalfi, Paris, la Côte d\'Azur, Londres, le Portugal, la Grèce et Dubaï.'],
      indian: ['Maquilleuse pour mariages indiens à Barcelone | Nikoleta Makeup & Team', 'Coiffure et maquillage pour mariages indiens sur plusieurs jours en Espagne et en Europe : Sangeet, Mehndi, Haldi, Pheras, cérémonie sikhe et réception. Jusqu\'à deux artistes dédiées à la mariée.'],
      reviews: ['Témoignages de mariées | Nikoleta Makeup & Team', 'Ce que disent mariées, mères, invitées et wedding planners de Nikoleta Makeup & Team, 2019 – 2026. Transcrit d\'Instagram, WhatsApp, e-mails et cartes manuscrites.'],
      contact: ['Vérifiez votre date de mariage | Nikoleta Makeup & Team, Barcelone', 'Envoyez votre date, votre lieu et le nombre de personnes : Nikoleta vous répond personnellement avec ses disponibilités et une proposition de planning. Barcelone, Espagne et mariages destination.']
    },
    de: {
      home: ['Braut-Make-up & Brautfrisur in Barcelona | Nikoleta Makeup & Team', 'Preisgekröntes Braut-Make-up und Brautfrisuren in Barcelona sowie Destination-Hochzeiten in ganz Europa. Ein vertrautes Team vom Probestyling bis zum Hochzeitsmorgen, seit 2008.'],
      services: ['Preise Braut-Make-up & Frisur 2027 · Barcelona | Nikoleta Makeup & Team', 'Pakete und Preise 2027 für Hochzeits-Make-up und Frisuren: Braut, Probestyling, Komplettpaket, Brautjungfern, Gäste, Beauty Corner, Bräutigam. Transparent ab der ersten E-Mail.'],
      portfolio: ['Portfolio Braut-Make-up & Frisuren | Nikoleta Makeup & Team', 'Echte Bräute, echte Hochzeitsmorgen: Soft Glam, Hollywood-Wellen, Chignons und strahlende natürliche Haut von Nikoleta Makeup & Team, Barcelona.'],
      destinations: ['Haar & Make-up für Destination-Hochzeiten in Europa | Nikoleta Makeup & Team', 'Ein Haar- und Make-up-Team, das von Barcelona an die Costa Brava, nach Mallorca, Ibiza, an den Comer See, nach Amalfi, Paris, an die Côte d\'Azur, nach London, Portugal, Griechenland und Dubai reist.'],
      indian: ['Make-up-Artist für indische Hochzeiten in Barcelona | Nikoleta Makeup & Team', 'Haar und Make-up für mehrtägige indische Hochzeiten in Spanien und Europa: Sangeet, Mehndi, Haldi, Pheras, Sikh-Zeremonie und Empfang. Bis zu zwei Artists nur für die Braut.'],
      reviews: ['Stimmen unserer Bräute | Nikoleta Makeup & Team', 'Was Bräute, Mütter, Gäste und Planner über Nikoleta Makeup & Team sagen, 2019 – 2026. Übertragen aus Instagram, WhatsApp, E-Mails und handgeschriebenen Karten.'],
      contact: ['Hochzeitstermin anfragen | Nikoleta Makeup & Team, Barcelona', 'Senden Sie Datum, Location und Personenzahl – Nikoleta antwortet persönlich mit Verfügbarkeit und einem Zeitplanvorschlag. Barcelona, Spanien und Destination-Hochzeiten.']
    },
    it: {
      home: ['Trucco e acconciatura sposa a Barcellona | Nikoleta Makeup & Team', 'Trucco e acconciatura sposa premiati a Barcellona e matrimoni destination in tutta Europa. Un unico team di fiducia, dalla prova alla mattina del matrimonio, dal 2008.'],
      services: ['Prezzi trucco e acconciatura sposa 2027 · Barcellona | Nikoleta Makeup & Team', 'Pacchetti e prezzi 2027 per trucco e capelli da matrimonio: sposa, prova, pacchetto completo, damigelle, invitate, beauty corner, sposo. Trasparenti dalla prima e-mail.'],
      portfolio: ['Portfolio trucco e acconciature sposa | Nikoleta Makeup & Team', 'Spose vere, mattine di matrimonio vere: soft glam, onde Hollywood, chignon e pelle luminosa e naturale di Nikoleta Makeup & Team, Barcellona.'],
      destinations: ['Trucco e capelli per matrimoni destination in Europa | Nikoleta Makeup & Team', 'Un team trucco e capelli che viaggia da Barcellona verso Costa Brava, Maiorca, Ibiza, Lago di Como, Amalfi, Parigi, Costa Azzurra, Londra, Portogallo, Grecia e Dubai.'],
      indian: ['Make-up artist per matrimoni indiani a Barcellona | Nikoleta Makeup & Team', 'Trucco e capelli per matrimoni indiani di più giorni in Spagna e in Europa: Sangeet, Mehndi, Haldi, Pheras, cerimonia sikh e ricevimento. Fino a due artist dedicate alla sposa.'],
      reviews: ['Testimonianze delle spose | Nikoleta Makeup & Team', 'Cosa dicono spose, mamme, invitate e planner di Nikoleta Makeup & Team, 2019 – 2026. Trascritto da Instagram, WhatsApp, e-mail e biglietti scritti a mano.'],
      contact: ['Verifica la tua data di nozze | Nikoleta Makeup & Team, Barcellona', 'Invia data, location e numero di persone: Nikoleta risponde personalmente con disponibilità e una proposta di timeline. Barcellona, Spagna e matrimoni destination.']
    },
    pt: {
      home: ['Maquilhagem e cabelo de noiva em Barcelona | Nikoleta Makeup & Team', 'Maquilhagem e penteados de noiva premiados em Barcelona e casamentos destino por toda a Europa. Uma só equipa de confiança, da prova à manhã do casamento, desde 2008.'],
      services: ['Preços maquilhagem e cabelo de noiva 2027 · Barcelona | Nikoleta Makeup & Team', 'Pacotes e preços 2027 de maquilhagem e cabelo para casamentos: noiva, prova, pacote completo, damas, convidadas, beauty corner, noivo. Transparentes desde o primeiro e-mail.'],
      portfolio: ['Portfólio de maquilhagem e penteados de noiva | Nikoleta Makeup & Team', 'Noivas reais, manhãs de casamento reais: soft glam, ondas Hollywood, coques e pele luminosa e natural por Nikoleta Makeup & Team, Barcelona.'],
      destinations: ['Maquilhagem e cabelo para casamentos destino na Europa | Nikoleta Makeup & Team', 'Uma equipa de maquilhagem e cabelo que viaja de Barcelona para a Costa Brava, Maiorca, Ibiza, Lago de Como, Amalfi, Paris, Riviera Francesa, Londres, Portugal, Grécia e Dubai.'],
      indian: ['Maquilhadora para casamentos indianos em Barcelona | Nikoleta Makeup & Team', 'Maquilhagem e cabelo para casamentos indianos de vários dias em Espanha e na Europa: Sangeet, Mehndi, Haldi, Pheras, cerimónia sikh e receção. Até duas artistas dedicadas à noiva.'],
      reviews: ['Depoimentos de noivas | Nikoleta Makeup & Team', 'O que dizem noivas, mães, convidadas e planners sobre a Nikoleta Makeup & Team, 2019 – 2026. Transcrito do Instagram, WhatsApp, e-mail e cartões escritos à mão.'],
      contact: ['Consulte a sua data de casamento | Nikoleta Makeup & Team, Barcelona', 'Envie a data, o local e o número de pessoas e a Nikoleta responde pessoalmente com disponibilidade e uma proposta de horário. Barcelona, Espanha e casamentos destino.']
    },
    lt: {
      home: ['Nuotakos makiažas ir šukuosena Barselonoje | Nikoleta Makeup & Team', 'Apdovanojimų pelnęs nuotakų makiažas ir šukuosenos Barselonoje bei vestuvės užsienyje visoje Europoje. Viena patikima komanda nuo bandomojo įvaizdžio iki vestuvių ryto, nuo 2008 m.'],
      services: ['Nuotakos makiažo ir šukuosenos kainos 2027 · Barselona | Nikoleta Makeup & Team', '2027 m. vestuvių makiažo ir šukuosenų paketai ir kainos: nuotaka, bandomasis įvaizdis, pilnas paketas, pamergės, viešnios, beauty corner, jaunikis. Skaidru nuo pirmo laiško.'],
      portfolio: ['Nuotakų makiažo ir šukuosenų portfolio | Nikoleta Makeup & Team', 'Tikros nuotakos, tikri vestuvių rytai: soft glam, Holivudo bangos, kuodai ir švytinti natūrali oda – Nikoleta Makeup & Team, Barselona.'],
      destinations: ['Šukuosenos ir makiažas vestuvėms užsienyje Europoje | Nikoleta Makeup & Team', 'Šukuosenų ir makiažo komanda, keliaujanti iš Barselonos į Costa Brava, Maljorką, Ibizą, Komo ežerą, Amalfį, Paryžių, Žydrąjį Krantą, Londoną, Portugaliją, Graikiją ir Dubajų.'],
      indian: ['Indiškų vestuvių makiažo meistrė Barselonoje | Nikoleta Makeup & Team', 'Šukuosenos ir makiažas kelių dienų indiškoms vestuvėms Ispanijoje ir Europoje: Sangeet, Mehndi, Haldi, Pheras, sikhų ceremonija ir priėmimas. Iki dviejų meistrių, skirtų tik nuotakai.'],
      reviews: ['Nuotakų atsiliepimai | Nikoleta Makeup & Team', 'Ką apie Nikoleta Makeup & Team sako nuotakos, mamos, viešnios ir planuotojai, 2019 – 2026. Perrašyta iš Instagram, WhatsApp, el. laiškų ir ranka rašytų atvirukų.'],
      contact: ['Pasitikrinkite savo vestuvių datą | Nikoleta Makeup & Team, Barselona', 'Atsiųskite datą, vietą ir žmonių skaičių – Nikoleta atsakys asmeniškai apie užimtumą ir pasiūlys tvarkaraštį. Barselona, Ispanija ir vestuvės užsienyje.']
    },
    ru: {
      home: ['Свадебный макияж и причёска в Барселоне | Nikoleta Makeup & Team', 'Отмеченные наградами свадебный макияж и причёски в Барселоне и выездные свадьбы по всей Европе. Одна надёжная команда от пробного образа до утра свадьбы, с 2008 года.'],
      services: ['Цены на свадебный макияж и причёску 2027 · Барселона | Nikoleta Makeup & Team', 'Пакеты и цены 2027 на свадебный макияж и причёски: невеста, пробный образ, полный пакет, подружки, гости, beauty corner, жених. Прозрачно с первого письма.'],
      portfolio: ['Портфолио свадебного макияжа и причёсок | Nikoleta Makeup & Team', 'Настоящие невесты, настоящие свадебные утра: soft glam, голливудские волны, пучки и сияющая естественная кожа от Nikoleta Makeup & Team, Барселона.'],
      destinations: ['Причёска и макияж для выездных свадеб в Европе | Nikoleta Makeup & Team', 'Команда по причёскам и макияжу, выезжающая из Барселоны на Коста-Браву, Майорку, Ибицу, озеро Комо, Амальфи, в Париж, на Лазурный берег, в Лондон, Португалию, Грецию и Дубай.'],
      indian: ['Визажист для индийских свадеб в Барселоне | Nikoleta Makeup & Team', 'Причёски и макияж для многодневных индийских свадеб в Испании и Европе: Sangeet, Mehndi, Haldi, Pheras, сикхская церемония и приём. До двух мастеров только для невесты.'],
      reviews: ['Отзывы невест | Nikoleta Makeup & Team', 'Что говорят невесты, мамы, гости и организаторы о Nikoleta Makeup & Team, 2019 – 2026. Перенесено из Instagram, WhatsApp, писем и открыток, написанных от руки.'],
      contact: ['Проверьте дату своей свадьбы | Nikoleta Makeup & Team, Барселона', 'Отправьте дату, место и количество человек — Николета ответит лично о доступности и предложит тайминг. Барселона, Испания и выездные свадьбы.']
    }
  }
};
