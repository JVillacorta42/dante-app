'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

const CIRCLES: { id: string; name: string; slug: string; cover: string; color: string; description: string; objectPosition: string; aspectRatio?: string }[] = [
  {
    id: 'I',
    name: 'LIMBO',
    slug: 'limbo',
    cover: '/images/limbo-cover.png',
    color: '#c9a84c',
    description: 'Los grandes de la antigüedad que vivieron sin conocer la fe cristiana',
    objectPosition: 'center',
  },
  {
    id: 'II',
    name: 'LUJURIA',
    slug: 'lujuria',
    cover: '/images/lujuria-cover.png',
    color: '#d4556a',
    description: 'Aquellos arrastrados eternamente por vientos tempestuosos por sus pasiones',
    objectPosition: 'center',
  },
  {
    id: 'III',
    name: 'GULA',
    slug: 'gula',
    cover: '/images/gula-cover.png',
    color: '#8b9650',
    description: 'Los glotones, hundidos en el lodo bajo lluvia eterna y granizo',
    objectPosition: '15% center',
  },
  {
    id: 'IV',
    name: 'AVARICIA',
    slug: 'avaricia',
    cover: '/images/avaricia-cover.png',
    color: '#c47c3a',
    description: 'Las almas condenadas por el mal uso de las riquezas, rodando pesos eternamente',
    objectPosition: 'center',
  },
  {
    id: 'V',
    name: 'IRA',
    slug: 'ira',
    cover: '/images/ira-cover.png',
    color: '#8b2a2a',
    description: 'Los iracundos, hundidos en el fango del río Estigia, luchando eternamente',
    objectPosition: 'center',
  },
  {
    id: 'VI',
    name: 'HEREJIA',
    slug: 'herejia',
    cover: '/images/herejia-cover.png',
    color: '#5a3a7a',
    description: 'Los herejes encerrados en sepulcros ardientes en la ciudad de Dite',
    objectPosition: 'center',
  },
  {
    id: 'VII',
    name: 'VIOLENCIA',
    slug: 'violencia',
    cover: '/images/violencia-cover.png',
    color: '#7a2a2a',
    description: 'Los violentos, sumergidos en el río de sangre hirviente del Flegetonte',
    objectPosition: 'center',
  },
  {
    id: 'VIII',
    name: 'FRAUDE',
    slug: 'fraude',
    cover: '/images/fraude-cover.png',
    color: '#4a6a5a',
    description: 'Los fraudulentos, castigados en las diez bolgias del Malebolge',
    objectPosition: 'center',
  },
  {
    id: 'IX',
    name: 'TRAICION',
    slug: 'traicion',
    cover: '/images/traicion-cover.png',
    color: '#1a2a4a',
    description: 'Los traidores, eternamente atrapados en el lago de hielo de Cocito',
    objectPosition: 'center',
  },
]

interface QuotePair { it: string; es: string; canto: number }

const CIRCLE_QUOTES: Record<string, QuotePair[]> = {
  limbo: [
    {
      it: '«Nel mezzo del cammin di nostra vita\nmi ritrovai per una selva oscura,\nché la diritta via era smarrita.»',
      es: '«En medio del camino de nuestra vida\nme encontré en una selva oscura,\nporque la recta vía había perdido.»',
      canto: 1,
    },
    {
      it: '«Sospiri, pianti e alti guai\nrisonavan per l\'aere sanza stelle.»',
      es: '«Suspiros, llantos y altos ayes\nresonaban por el aire sin estrellas.»',
      canto: 3,
    },
    {
      it: '«Non avea pianto, ma\' che di sospiri,\nche l\'aura etterna facevan tremare.»',
      es: '«No había llanto, sino tan solo suspiros\nque hacían temblar el aire eterno.»',
      canto: 4,
    },
    {
      it: '«Genti v\'eran con occhi tardi e gravi,\ndi grande autorità ne\' lor sembianti.»',
      es: '«Había gentes de ojos serenos y graves,\nde gran autoridad en su semblante.»',
      canto: 4,
    },
    {
      it: '«Onorate l\'altissimo poeta;\nl\'ombra sua torna, ch\'era dipartita.»',
      es: '«Honrad al altísimo poeta;\nsu sombra regresa, que se había alejado.»',
      canto: 4,
    },
    {
      it: '«Io era tra color che son sospesi,\ne un maestro di color che sanno.»',
      es: '«Yo estaba entre los que están en suspenso,\ny un maestro de los que saben.»',
      canto: 4,
    },
    {
      it: '«Così andammo infino a la lumera,\nparlando cose che \u2018l tacere è bello.»',
      es: '«Así avanzamos hasta la luz,\nhablando cosas que el silencio favorece.»',
      canto: 4,
    },
  ],
  lujuria: [
    {
      it: '«Amor, ch\'a nullo amato amar perdona,\nmi prese del costui piacer sì forte\nche, come vedi, ancor non m\'abbandona.»',
      es: '«Amor, que a ningún amado perdonar el amar,\nme prendió del placer de este con tanta fuerza\nque, como ves, aún no me abandona.»',
      canto: 5,
    },
    {
      it: '«La bufera infernal, che mai non resta,\nmena li spirti con la sua rapina.»',
      es: '«La tormenta infernal, que nunca cesa,\narrastra a los espíritus con su violencia.»',
      canto: 5,
    },
    {
      it: '«Quali colombe dal disio chiamate,\ncon l\'ali alzate e ferme al dolce nido.»',
      es: '«Como palomas llamadas por el deseo,\ncon las alas alzadas hacia el dulce nido.»',
      canto: 5,
    },
    {
      it: '«Nessun maggior dolore\nche ricordarsi del tempo felice\nnella miseria.»',
      es: '«No hay mayor dolor\nque recordar el tiempo feliz\nen la miseria.»',
      canto: 5,
    },
    {
      it: '«Amor condusse noi ad una morte.»',
      es: '«El amor nos condujo a una sola muerte.»',
      canto: 5,
    },
    {
      it: '«Stavvi Minòs orribilmente, e ringhia:\nessamina le colpe ne l\'intrata.»',
      es: '«Allí está Minos, horriblemente, y gruñe:\nexamina las culpas a la entrada.»',
      canto: 5,
    },
    {
      it: '«Intesi ch\'a così fatto tormento\nenno dannati i peccator carnali,\nche la ragion sommettono al talento.»',
      es: '«Comprendí que a tan terrible tormento\nestán condenados los pecadores carnales,\nque someten la razón al deseo.»',
      canto: 5,
    },
  ],
  gula: [
    {
      it: '«Io son al terzo cerchio, de la piova\netterna, maledetta, fredda e greve.»',
      es: '«Estoy en el tercer círculo, de la lluvia\neterna, maldita, fría y pesada.»',
      canto: 6,
    },
    {
      it: '«Grandine grossa, acqua tinta e neve\nper l\'aere tenebroso si riversa.»',
      es: '«Granizo grueso, agua turbia y nieve\nse vierte por el aire tenebroso.»',
      canto: 6,
    },
    {
      it: '«Cerbero, fiera crudele e diversa,\ncon tre gole caninamente latra\nsovra la gente che quivi è sommersa.»',
      es: '«Cerbero, fiera cruel y extraña,\ncon tres gargantas ladra como un perro\nsobre la gente que allí está sumergida.»',
      canto: 6,
    },
    {
      it: '«Li occhi hanno scarlatti, e la barba unta\ned atra, e \u2018l ventre largo,\ne unghiate le mani.»',
      es: '«Los ojos tiene rojos, la barba grasienta\ny negra, el vientre ancho,\ny uñadas las manos.»',
      canto: 6,
    },
    {
      it: '«Voi cittadini mi chiamaste Ciacco:\nper la dannosa colpa de la gola,\ncome tu vedi, a la pioggia mi fiacco.»',
      es: '«Vosotros me llamasteis Ciacco:\npor la dañina culpa de la gula,\ncomo ves, bajo la lluvia me abato.»',
      canto: 6,
    },
    {
      it: '«La tua città, ch\'è piena\nd\'invidia sì che già trabocca il sacco,\nmi tenne in vita serena.»',
      es: '«Tu ciudad, que está tan llena\nde envidia que el saco ya desborda,\nme tuvo en vida serena.»',
      canto: 6,
    },
    {
      it: '«Volsemi Virgilio, e disse: "Questi è Pluto,\nlo gran nemico."»',
      es: '«Virgilio se volvió y me dijo: "Este es Pluto,\nel gran enemigo."»',
      canto: 6,
    },
  ],
  ira: [
    {
      it: '«Io dico, seguitando, ch\'assai prima\nche noi fossimo al piè de l\'alta torre,\nli occhi nostri n\'andar suso a la cima.»',
      es: '«Digo, continuando, que mucho antes\nde que llegáramos al pie de la alta torre,\nnuestros ojos se alzaron hasta su cima.»',
      canto: 8,
    },
    {
      it: '«E io a lui: "Se tu vai, maestro, mio,\ncomanda che noi stiamo; ch\'i\' mi scuso\nse tu vai sol, sanza che io ti segno."»',
      es: '«Y yo a él: "Si tú vas, maestro mío,\nmanda que nos quedemos; pues me excuso\nsi vas solo, sin que yo te acompañe."»',
      canto: 8,
    },
    {
      it: '«Filippo Argenti! —e \u2018l fiorentino spirito\nbizzarro in sé medesmo si volvea.»',
      es: '«¡Filippo Argenti! —y el florentino espíritu\ncolérico sobre sí mismo se revolvía.»',
      canto: 8,
    },
    {
      it: '«Quanti si tegnon ora là sù, grandi re,\nche qui staranno come porci in brago,\ndi sé lasciando orribili dispregi!»',
      es: '«¡Cuántos se tienen allá arriba por grandes reyes,\nque aquí quedarán como cerdos en el barro,\ndejando de sí horribles desprecios!»',
      canto: 8,
    },
    {
      it: '«Vedi Flegïàs, Flegïàs:\ntu gridi a vòto», disse lo mio segnore,\n«a questa volta più non ci avrai.»',
      es: '«Mira a Flegiás, Flegiás:\nen vano gritas», dijo mi señor,\n«esta vez no nos tendrás más.»',
      canto: 8,
    },
    {
      it: '«La città ch\'è appelata Dite,\ncoi cittadini gravi, col grande stuolo.»',
      es: '«La ciudad que se llama Dite,\ncon sus graves ciudadanos, con la gran muchedumbre.»',
      canto: 8,
    },
    {
      it: '«Maestro, già le sue meschite\nlà entro certe ne la valle cerno,\nvermiglie come se di foco uscite\nfossero.»',
      es: '«Maestro, ya sus mezquitas\nallá dentro en el valle distingo,\nrojas como si del fuego hubieran\nsalido.»',
      canto: 8,
    },
  ],
  avaricia: [
    {
      it: '«Pape Satàn, pape Satàn aleppe!\ncominciò Pluto con la voce chioccia.»',
      es: '«¡Pape Satán, pape Satán aleppe!\ncomenzó Pluto con voz ronca.»',
      canto: 7,
    },
    {
      it: '«Qui vegg\'io gente più ch\'altrove troppa,\ne d\'una parte e d\'altra, con grand\'urli,\nvolgendo pesi per forza di poppa.»',
      es: '«Aquí veo más gente que en ningún otro lugar,\ny de una y otra parte, con grandes gritos,\nempujando pesos con fuerza de pecho.»',
      canto: 7,
    },
    {
      it: '«Perché tieni? e perché burli?\nsi rispondien l\'un l\'altro in quel pageante.»',
      es: '«¿Por qué retienes? ¿Por qué derrochas?\nse respondían unos a otros en aquel cortejo.»',
      canto: 7,
    },
    {
      it: '«Mal dare e mal tener lo mondo pulcro\nha tolto loro, e posti a questa zuffa.»',
      es: '«El dar mal y el guardar mal les ha quitado\nel mundo hermoso y los ha puesto en esta riña.»',
      canto: 7,
    },
    {
      it: '«Or puoi, figliuol, veder la corta buffa\nde\' ben che son commessi a la fortuna.»',
      es: '«Ahora puedes, hijo, ver la corta burla\nde los bienes que están en manos de la fortuna.»',
      canto: 7,
    },
    {
      it: '«Questo è colui che \u2018l mondo ha sì a schifo:\nPluto, lo gran nemico.»',
      es: '«Este es el que el mundo tiene en tanto desprecio:\nPluto, el gran enemigo.»',
      canto: 7,
    },
    {
      it: '«Vedi la gente che si lamenta\nch\'attese il tempo, e ora il tempo perde.»',
      es: '«Ve a la gente que se lamenta,\nque esperó el tiempo, y ahora pierde el tiempo.»',
      canto: 7,
    },
  ],
  herejia: [
    {
      it: '«Or drizza il naso in sù, e guarda:\nvedi colui che là vien, lo meschin.»',
      es: '«Ahora alza la nariz y mira:\nve a aquel que allá viene, el mezquino.»',
      canto: 10,
    },
    {
      it: '«Farinata degli Uberti:\n"Chi fur li maggior tui?"»',
      es: '«Farinata degli Uberti:\n"¿Quiénes fueron tus mayores?"»',
      canto: 10,
    },
    {
      it: '«Noi avem, come quei ch\'ha mala luce,\nle cose che ne son lontane: cotanto\nancor ne splende il sommo duce.»',
      es: '«Nosotros vemos, como quien tiene mala luz,\nlas cosas que están lejos; tanto\naún nos ilumina el supremo guía.»',
      canto: 10,
    },
    {
      it: '«Suo nato, e \u2018l dolor de le sepolture;\nsapeva ogne cosa: solo i morti\nnon sapeva quando venien.»',
      es: '«Su hijo, y el dolor de los sepulcros;\nlo sabía todo: solo a los muertos\nno sabía cuándo vendrían.»',
      canto: 10,
    },
    {
      it: '«Ma i tuo\' non seppero quell\'arte»;\ne poi pianse, e tacque.»',
      es: '«Pero los tuyos no supieron ese arte»;\ny luego lloró, y calló.»',
      canto: 10,
    },
    {
      it: '«Qui son con Epicuro tutti suoi seguaci,\nche l\'anima col corpo morta fanno.»',
      es: '«Aquí están con Epicuro todos sus seguidores,\nque hacen morir el alma con el cuerpo.»',
      canto: 10,
    },
    {
      it: '«O Tosco che per la città del foco\nvivo ten vai così parlando onesto.»',
      es: '«Oh toscano que por la ciudad del fuego\nvivo vas hablando con tanta honestidad.»',
      canto: 10,
    },
  ],
  violencia: [
    {
      it: '«Vedi la bestia per cu\u2019 io mi volsi;\naiutami da lei, famoso saggio,\nch\'ella mi fa tremar le vene e i polsi.»',
      es: '«Ve la bestia por la que me volví;\nayúdame contra ella, famoso sabio,\nque me hace temblar venas y pulsos.»',
      canto: 1,
    },
    {
      it: '«Lo Minotauro fece come quei\nche dalla rabbia è vinto.»',
      es: '«El Minotauro hizo como aquel\nque es vencido por la rabia.»',
      canto: 12,
    },
    {
      it: '«Vedi \u2018l gran Flegëton,\nche \u2018n sua bulicame\nnon ha riposo mai.»',
      es: '«Ve el gran Flegetonte,\nque en su bullicio\nnunca tiene reposo.»',
      canto: 14,
    },
    {
      it: '«Questi è Chirón, il gran Centauro,\nche nodrì Achille; quell\'altro è Folo,\nche fu sì pien di rabbia.»',
      es: '«Este es Quirón, el gran Centauro,\nque crió a Aquiles; aquel otro es Folo,\nque estuvo tan lleno de rabia.»',
      canto: 12,
    },
    {
      it: '«Non è l\'uom che a te non è noto;\nma io son Brünetto, e domando\nte se t\'aggrada restal un poco meco.»',
      es: '«No soy hombre que no te sea conocido;\nsoy Brunetto, y te pido\nque si te place te quedes un poco conmigo.»',
      canto: 15,
    },
    {
      it: '«In su la cima de la ripa dura\nvenne a mostrarsi una figura nova,\ndi cui nessun si torse da la sura.»',
      es: '«En lo alto de la roca dura\naparecióse una figura nueva,\nde la que ninguno apartó la vista.»',
      canto: 16,
    },
    {
      it: '«Ecco la fiera con la coda aguzza,\nche passa i monti, e rompe i muri e l\'armi;\necco colei che tutto il mondo appuzza!»',
      es: '«He aquí la fiera de la cola aguda,\nque atraviesa montañas y rompe muros y armas;\nhe aquí la que infesta a todo el mundo!»',
      canto: 17,
    },
  ],
  fraude: [
    {
      it: '«Luogo è in inferno detto Malebolge,\ntutto di pietra di color ferrigno,\ncome la cerchia che dintorno il volge.»',
      es: '«Hay un lugar en el infierno llamado Malebolge,\ntodo de piedra de color ferroso,\ncomo la muralla que en torno lo rodea.»',
      canto: 18,
    },
    {
      it: '«Fatti non foste a viver come bruti,\nma per seguir virtute e canoscenza.»',
      es: '«No fuisteis hechos para vivir como bestias,\nsino para seguir virtud y conocimiento.»',
      canto: 26,
    },
    {
      it: '«Com\u2019 io arsi nel mondo, così ardo\nanche qui: lo consiglio fraudolento\nch\u2019i\u2019 diedi ancor mi cruccia.»',
      es: '«Como ardí en el mundo, así ardo\ntambién aquí: el consejo fraudulento\nque di aún me atormenta.»',
      canto: 27,
    },
    {
      it: '«Io fui de\u2019 Malebranche un de\u2019 cherci;\nla mia bellezza mi fe\u2019 tal superba\nche io non pensai ch\u2019ogni uom fosse un mio lerci.»',
      es: '«Fui uno de los clérigos de los Malebranche;\nmi belleza me hizo tan soberbia\nque no pensé que todo hombre fuera mi igual.»',
      canto: 22,
    },
    {
      it: '«Considerate la vostra semenza:\nfatti non foste a viver come bruti.»',
      es: '«Considerad vuestra simiente:\nno fuisteis hechos para vivir como bestias.»',
      canto: 26,
    },
    {
      it: '«Io vidi un, fatto a guisa di leuto,\npur ch\u2019elli avesse avuta l\u2019anguinaia\ntronca da l\u2019esso del suo busto.»',
      es: '«Vi a uno hecho a modo de laúd,\nsi es que hubiese tenido la ingle\ncortada del tronco de su cuerpo.»',
      canto: 28,
    },
    {
      it: '«Non mi tener: tu vedi ch\u2019i\u2019 son uno\nche piango sempre e ognor mi lamento;\nma \u2019l pianto stesso qui raddoppia il duono.»',
      es: '«No me retengas: ves que soy uno\nque siempre llora y a toda hora se lamenta;\npero el llanto mismo aquí duplica el tormento.»',
      canto: 29,
    },
  ],
  traicion: [
    {
      it: '«S\'io avessi le rime aspre e chiocce,\ncome si converrebbe al tristo buco\nsovra \u2019l qual pontan tutte l\'altre rocce.»',
      es: '«Si tuviera rimas ásperas y disonantes,\ncomo convendría al triste agujero\nsobre el que se apoyan todas las demás rocas.»',
      canto: 32,
    },
    {
      it: '«Lo pianto stesso lì pianger non lascia,\ne \u2019l duol che truova in su li occhi rintoppo\nsi volge in entro a far crescer l\'ambascia.»',
      es: '«El llanto mismo allí no deja llorar,\ny el dolor que encuentra obstáculo en los ojos\nse vuelve hacia dentro para acrecentar la angustia.»',
      canto: 33,
    },
    {
      it: '«Lo imperador del doloroso regno\nda mezzo \u2019l petto uscia fuor de la ghiaccia.»',
      es: '«El emperador del doloroso reino\nasomaba desde el pecho fuera del hielo.»',
      canto: 34,
    },
    {
      it: '«Com\u2019 io divenni allor gelato e fioco,\nnol dimandar, lettor, ch\u2019i\u2019 non lo scrivo,\nperé ch\u2019ogne parlar sarebbe poco.»',
      es: '«Cómo me quedé entonces helado y sin voz,\nno lo preguntes, lector, que no lo escribo,\nporque cualquier palabra sería poco.»',
      canto: 34,
    },
    {
      it: '«Vexilla regis prodeunt inferni\nverso di noi; però dinanzi mira,\ndisse \u2019l maestro mio.»',
      es: '«Los estandartes del rey del infierno\navanzaban hacia nosotros; por eso mira hacia delante,\ndijo mi maestro.»',
      canto: 34,
    },
    {
      it: '«In quella faccia era quanto\nparevan lunghe, tanta era in larghezza;\nla testa sua aveva\npiù proporzione con un pino.»',
      es: '«En aquella cara lo que parecía de largo,\neso era de ancho;\nsu cabeza guardaba\nmás proporción con un pino.»',
      canto: 34,
    },
    {
      it: '«E quindi uscimmo a riveder le stelle.»',
      es: '«Y de allí salimos a ver de nuevo las estrellas.»',
      canto: 34,
    },
  ],
}

const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

function useQuoteCycle(pairs: QuotePair[]) {
  const [itText, setItText] = useState('')
  const [esText, setEsText] = useState('')
  const [canto, setCanto] = useState(0)
  const [itOpacity, setItOpacity] = useState(0)
  const [esOpacity, setEsOpacity] = useState(0)
  const cancelRef = useRef(false)

  useEffect(() => {
    cancelRef.current = false
    setItOpacity(0)
    setEsOpacity(0)

    let idx = 0

    async function run() {
      await sleep(600)
      while (!cancelRef.current) {
        const pair = pairs[idx % pairs.length]
        setItText(pair.it)
        setEsText(pair.es)
        setCanto(pair.canto)

        // Italian fades in
        setItOpacity(1)
        await sleep(1600)
        if (cancelRef.current) return

        // Spanish fades in — both visible together
        setEsOpacity(1)
        await sleep(3000)
        if (cancelRef.current) return

        // Italian fades out first
        setItOpacity(0)
        await sleep(1400)
        if (cancelRef.current) return

        // Spanish fades out
        setEsOpacity(0)
        await sleep(1200)
        if (cancelRef.current) return

        idx++
      }
    }

    run()
    return () => { cancelRef.current = true }
  }, [pairs])

  return { itText, esText, canto, itOpacity, esOpacity }
}

function QuotePanels({ pairs, color }: { pairs: QuotePair[]; color: string }) {
  const { itText, esText, canto, itOpacity, esOpacity } = useQuoteCycle(pairs)

  const panelStyle = (side: 'left' | 'right'): React.CSSProperties => ({
    position: 'absolute',
    [side]: 0,
    top: 0,
    bottom: 0,
    width: 'calc(50% - 210px)',
    padding: '0 2.5rem',
    zIndex: 5,
    pointerEvents: 'none',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  })

  const textStyle = (align: 'left' | 'right', op: number): React.CSSProperties => ({
    opacity: op,
    transition: 'opacity 1.2s ease',
    color: '#e8c97e',
    fontFamily: '"IM Fell English", Georgia, serif',
    fontSize: '1.15rem',
    fontStyle: 'italic',
    lineHeight: '2.1',
    letterSpacing: '0.02em',
    whiteSpace: 'pre-line',
    textAlign: align,
    textShadow: '0 0 12px rgba(220,170,80,0.5), 1px 1px 0px rgba(0,0,0,0.6)',
    filter: 'url(#ink-rough)',
    maxWidth: '280px',
    marginLeft: align === 'right' ? 'auto' : undefined,
    marginRight: align === 'left' ? 'auto' : undefined,
  })

  const cantoStyle = (align: 'left' | 'right', op: number): React.CSSProperties => ({
    opacity: op * 0.85,
    transition: 'opacity 1.2s ease',
    color: '#a07840',
    fontFamily: '"IM Fell English", Georgia, serif',
    fontSize: '0.7rem',
    fontStyle: 'normal',
    letterSpacing: '0.25em',
    textTransform: 'uppercase' as const,
    textAlign: align,
    marginTop: '0.6rem',
    marginLeft: align === 'right' ? 'auto' : undefined,
    marginRight: align === 'left' ? 'auto' : undefined,
    maxWidth: '280px',
    filter: 'url(#ink-rough)',
  })


  const labelStyle: React.CSSProperties = {
    fontSize: '0.55rem',
    letterSpacing: '0.25em',
    textTransform: 'uppercase',
    marginBottom: '0.75rem',
    opacity: 0.35,
    color,
  }

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&display=swap');`}</style>

      {/* SVG ink roughness filter */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="ink-rough" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="4" seed="8" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.8" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* Left — Italian original */}
      <div className="hidden lg:flex" style={panelStyle('left')}>
        <p style={textStyle('right', itOpacity)}>{itText}</p>
        {canto > 0 && <p style={cantoStyle('right', itOpacity)}>Canto {canto}</p>}
      </div>

      {/* Right — Spanish translation */}
      <div className="hidden lg:flex" style={panelStyle('right')}>
        <p style={textStyle('left', esOpacity)}>{esText}</p>
        {canto > 0 && <p style={cantoStyle('left', esOpacity)}>Canto {canto}</p>}
      </div>
    </>
  )
}

export default function SelectPage() {
  const router = useRouter()
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [direction, setDirection] = useState<'left' | 'right'>('right')
  const [visible, setVisible] = useState(true)
  const [prologuePlaying, setProloguePlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  function togglePrologue() {
    const audio = audioRef.current
    if (!audio) return
    if (prologuePlaying) {
      audio.pause()
      audio.currentTime = 0
      setProloguePlaying(false)
    } else {
      audio.play().then(() => setProloguePlaying(true)).catch(() => {})
    }
  }

  function slide(dir: 'left' | 'right') {
    if (animating) return
    const next =
      dir === 'right'
        ? (current + 1) % CIRCLES.length
        : (current - 1 + CIRCLES.length) % CIRCLES.length
    setDirection(dir)
    setAnimating(true)
    setVisible(false)
    setTimeout(() => {
      setCurrent(next)
      setVisible(true)
      setAnimating(false)
    }, 350)
  }

  const circle = CIRCLES[current]
  const pairs = CIRCLE_QUOTES[circle.slug] ?? CIRCLE_QUOTES['limbo']

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between overflow-hidden"
      style={{ backgroundColor: '#080604', position: 'relative' }}
    >
      {/* Background: blurred cover image */}
      <div
        className="fixed inset-0"
        style={{
          backgroundImage: `url(${circle.cover})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(18px) brightness(0.18)',
          transform: 'scale(1.08)',
          zIndex: 0,
          transition: 'background-image 0.7s ease',
        }}
      />

      {/* Top title */}
      <div className="relative z-10 text-center pt-12 pb-4 px-4">
        <p
          className="text-xs uppercase tracking-widest mb-3"
          style={{ color: '#b89a5a', letterSpacing: '0.5em' }}
        >
          Divina Comedia
        </p>
        <h1
          className="text-5xl md:text-7xl font-bold uppercase"
          style={{
            color: '#e8d5b0',
            fontFamily: 'Georgia, serif',
            letterSpacing: '0.12em',
            textShadow: '0 0 60px #c9a84c44, 0 2px 8px #000',
          }}
        >
          Dante
        </h1>
        <p
          className="text-lg md:text-2xl uppercase tracking-widest mt-1"
          style={{ color: '#8b1a1a', letterSpacing: '0.4em' }}
        >
          Infierno
        </p>

        {/* Prologue button */}
        <audio
          ref={audioRef}
          src="https://github.com/JVillacorta42/dante-app/releases/download/1.0/prologo.mp3"
          onEnded={() => setProloguePlaying(false)}
        />
        <button
          onClick={togglePrologue}
          className="mt-5 inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs uppercase tracking-widest transition-all duration-300 hover:scale-105"
          style={{
            backgroundColor: prologuePlaying ? '#3a0a0a' : 'transparent',
            border: `1px solid ${prologuePlaying ? '#8b1a1a' : '#3a2a1a'}`,
            color: prologuePlaying ? '#c97070' : '#9e8a6a',
            letterSpacing: '0.2em',
            boxShadow: prologuePlaying ? '0 0 16px #8b1a1a44' : 'none',
          }}
        >
          {prologuePlaying ? '■ Detener prólogo' : '▶ Escuchar prólogo'}
        </button>
      </div>

      {/* Carousel */}
      <div className="relative z-10 flex items-center justify-center w-full px-4 flex-1">

        {/* Quote panels — remount on circle change to restart cycle */}
        <QuotePanels key={circle.slug} pairs={pairs} color={circle.color} />

        {/* Left arrow */}
        <button
          onClick={() => slide('left')}
          disabled={animating}
          className="absolute left-4 md:left-12 z-20 flex items-center justify-center w-12 h-12 rounded-full transition-all hover:scale-110 disabled:opacity-30"
          style={{
            backgroundColor: '#1a0c04cc',
            border: `1px solid ${circle.color}44`,
            color: circle.color,
            fontSize: '1.5rem',
          }}
        >
          ‹
        </button>

        {/* Card */}
        <div
          className="flex flex-col items-center"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible
              ? 'translateX(0) scale(1)'
              : direction === 'right'
              ? 'translateX(-40px) scale(0.97)'
              : 'translateX(40px) scale(0.97)',
            transition: 'opacity 0.35s ease, transform 0.35s ease',
            maxWidth: '360px',
            width: '100%',
          }}
        >
          {/* Cover image card */}
          <div
            className="relative w-full rounded-2xl overflow-hidden cursor-pointer group"
            style={{
              boxShadow: `0 0 60px ${circle.color}44, 0 20px 60px #00000099`,
              border: `1px solid ${circle.color}33`,
              aspectRatio: circle.aspectRatio ?? '3/4',
            }}
            onClick={() => router.push(`/${circle.slug}`)}
          >
            <img
              src={circle.cover}
              alt={circle.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              style={{ objectPosition: circle.objectPosition ?? 'center' }}
            />
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(to top, #080604f0 0%, transparent 55%)` }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p
                className="text-xs uppercase tracking-widest mb-1"
                style={{ color: circle.color, letterSpacing: '0.3em' }}
              >
                Círculo {circle.id}
              </p>
              <h2
                className="text-3xl font-bold uppercase"
                style={{
                  color: '#e8d5b0',
                  fontFamily: 'Georgia, serif',
                  letterSpacing: '0.15em',
                  textShadow: '0 2px 12px #000',
                }}
              >
                {circle.name}
              </h2>
            </div>
          </div>

          {/* Enter button */}
          <button
            onClick={() => router.push(`/${circle.slug}`)}
            className="mt-6 px-10 py-3 rounded-full font-bold uppercase tracking-widest text-sm transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: circle.color,
              color: '#080604',
              boxShadow: `0 0 30px ${circle.color}55`,
              letterSpacing: '0.3em',
            }}
          >
            Entrar
          </button>

          {/* Dot indicators */}
          <div className="flex gap-2 mt-5">
            {CIRCLES.map((c, i) => (
              <button
                key={i}
                onClick={() => { if (i !== current) slide(i > current ? 'right' : 'left') }}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === current ? '24px' : '8px',
                  height: '8px',
                  backgroundColor: i === current ? circle.color : '#3a2010',
                }}
              />
            ))}
          </div>
        </div>

        {/* Right arrow */}
        <button
          onClick={() => slide('right')}
          disabled={animating}
          className="absolute right-4 md:right-12 z-20 flex items-center justify-center w-12 h-12 rounded-full transition-all hover:scale-110 disabled:opacity-30"
          style={{
            backgroundColor: '#1a0c04cc',
            border: `1px solid ${circle.color}44`,
            color: circle.color,
            fontSize: '1.5rem',
          }}
        >
          ›
        </button>
      </div>

      {/* Bottom quote */}
      <p
        className="relative z-10 text-xs italic pb-8 text-center px-4"
        style={{ color: '#3a2a18', letterSpacing: '0.1em' }}
      >
        «Abandonad toda esperanza, vosotros que entráis aquí»
      </p>
    </div>
  )
}
