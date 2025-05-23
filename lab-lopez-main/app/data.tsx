import React from 'react'

export type Analysis = {
  id: number
  title: string
  description: string
  image: string
  category: string
  slug: string
  content: string
  heroIcons?: string[]
  sections?: {
    title: string
    content: React.ReactNode
  }[]
  details?: {
    overview: string
    procedure: string
    indications: string[]
    interpretation: string
  }
}

export const analysisData: Analysis[] = [
  {
    id: 1,
    title: "ZUMA test no invasivo prenatal (NIPT)",
    description: "Prueba prenatal no invasiva que detecta anomalías cromosómicas a partir de una muestra de sangre materna",
    image: "/images/analisis/zuma-test.jpg",
    category: "Análisis clínicos",
    slug: "zuma-test-prenatal",
    content: "Las pruebas prenatales convencionales que permiten detectar anomalías cromosómicas fetales requieren una muestra de vellosidades coriónicas (biopsia corial) o bien una amniocentesis. Estos procedimientos son altamente invasivos y conllevan un elevado riesgo de aborto espontáneo. A pesar de ello, constituyen pruebas confirmatorias debido a sus altos niveles de precisión y variedad de anomalías que pueden detectar. ZUMA TEST NO INVASIVO PRENATAL es una prueba prenatal no invasiva que se realiza a partir de la muestra de sangre materna y que evalúa de forma rápida y precisa la mayoría de alteraciones cromosómicas más frecuentes en el feto.",
    heroIcons: ["Baby", "Dna", "Search"],
    sections: [
      {
        title: "¿Qué detecta este análisis?",
        content: (
          <div className="space-y-4">
            <p>Esta prueba analiza el material genético (ADN) fetal libre que circula en la sangre materna y determina la presencia de alteraciones en:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Cromosoma 21 (Síndrome de Down)</li>
              <li>Cromosoma 18 (Síndrome de Edwards)</li>
              <li>Cromosoma 13 (Síndrome de Patau)</li>
              <li>Cromosomas sexuales (X e Y)</li>
              <li>Identificación del sexo fetal</li>
            </ul>
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Sensibilidad y Especificidad:</h4>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border p-2 text-left">Trisomía</th>
                    <th className="border p-2 text-left">Sensibilidad</th>
                    <th className="border p-2 text-left">Especificidad</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">Trisomía 21 (Síndrome de Down)</td>
                    <td className="border p-2">99.9%</td>
                    <td className="border p-2">99.9%</td>
                  </tr>
                  <tr>
                    <td className="border p-2">Trisomía 18 (Síndrome de Edwards)</td>
                    <td className="border p-2">99.0%</td>
                    <td className="border p-2">99.9%</td>
                  </tr>
                  <tr>
                    <td className="border p-2">Trisomía 13 (Síndrome de Patau)</td>
                    <td className="border p-2">99.9%</td>
                    <td className="border p-2">99.9%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )
      },
      {
        title: "Prueba disponible",
        content: (
          <div className="space-y-4">
            <p>El procedimiento consiste en:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Extracción de sangre materna a partir de la semana 10 de gestación</li>
              <li>Análisis del ADN fetal libre circulante</li>
              <li>Detección de anomalías cromosómicas mediante tecnología de última generación</li>
              <li>Resultados con alta precisión y sin riesgos para el embarazo</li>
            </ul>
            <p>Tiempo de entrega: 5-7 días hábiles</p>
          </div>
        )
      },
      {
        title: "Indicaciones",
        content: (
          <div className="space-y-4">
            <p>Este análisis está especialmente indicado en:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Edad materna avanzada (≥35 años)</li>
              <li>Screening bioquímico de alto riesgo</li>
              <li>Hallazgos ecográficos sugestivos de cromosomopatía</li>
              <li>Antecedentes de gestación previa con cromosomopatía</li>
              <li>Ansiedad materna</li>
              <li>Como alternativa a pruebas invasivas (amniocentesis o biopsia corial)</li>
            </ul>
          </div>
        )
      },
      {
        title: "Interpretación de resultados",
        content: (
          <div className="space-y-4">
            <p>La interpretación de los resultados incluye:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Evaluación del riesgo individual para cada alteración cromosómica</li>
              <li>Determinación del sexo fetal (si se solicita)</li>
              <li>Recomendaciones sobre la necesidad de pruebas confirmatorias</li>
              <li>Asesoramiento genético personalizado</li>
            </ul>
            <p className="mt-4 text-gray-700">En caso de resultado positivo, se recomienda confirmar mediante prueba invasiva (amniocentesis o biopsia corial) antes de tomar decisiones clínicas importantes.</p>
          </div>
        )
      }
    ]
  },
  {
    id: 2,
    title: "Perfil ENA (MICROBLOT ARRAY ANA 44 antígenos)",
    description: "Panel completo para la detección y cuantificación de anticuerpos antinucleares mediante tecnología MICROBLOT ARRAY",
    image: "/images/analisis/perfil-ena.jpg",
    category: "Análisis clínicos",
    slug: "perfil-ena-microblot",
    content: "Los anticuerpos antinucleares son inmunoglobulinas que reconocen componentes celulares autólogos (nucleares y citoplasmáticos). Además de los ANA autoinmunes, pueden estar en circulación ANA infecciosos y/o naturales. Estos anticuerpos se encuentran asociados a enfermedades autoinmunes que son un grupo complejo y heterogéneo de patologías. Cerca del 5% de la población mundial se ve afectada por enfermedades autoinmunes. Hasta el momento se está en búsqueda de la prevención primaria que pueda retrasar o posponer la aparición de las enfermedades autoinmunes, basada en la determinación de anticuerpos de manera oportuna.",
    heroIcons: ["Microscope", "TestTube", "Flask"],
    sections: [
      {
        title: "Panel completo de antígenos",
        content: (
          <div className="space-y-4">
            <p className="font-semibold">ANA PLUS PANEL COMPLETO POR MICROBLOT ARRAY ANA 44 antígenos:</p>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-[#1e5fad] mb-2">ANA</h4>
                <p className="text-sm">Jo -1, PL-7, PL-12, EJ, OJ, KS, YARS, Zoa, ZoB, SAE-2, SRP54, Mi-2, TF1y, MDA5, NXP2, PMScl 75, PMScl 100, CENPA, CENPb, Scl70, POLR3A, NOR90, PDFR-β, Fibrilar, Th/To, Ro52, Ro 60, la, SmD, RNP A, RNP C, RNP 68/7, P0, Ku, Nucleolin, dsDNA, Histona, Nucleosoma, PCNA</p>
                <p className="text-sm mt-1">Antígenos complementarios: M2, DSFS 70</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-[#1e5fad] mb-2">MIOPATÍA</h4>
                <p className="text-sm">Jo-1, PL-7, PL-12, EJ, OJ, KS, YARS, ZoA, ZoB, SAE-2, SRP54, Mi2, TIFγ, MDA5, NXP2</p>
                <p className="text-sm mt-1">Antígenos complementarios: Ro 52, PMScl 75, PMScl 100, Ku</p>
              </div>

              <div>
                <h4 className="font-semibold text-[#1e5fad] mb-2">ESCLERODERMIA</h4>
                <p className="text-sm">CENP A, CENP B, Scl70, POLR3A, NOR90, PDGFR-β, Fibrillarin, Th/To, PMScl 75, PMScl 100, RNP A, RNP C, RNP 68/70</p>
                <p className="text-sm mt-1">Antígenos Suplementarios: Ro52, Ku, M2</p>
              </div>

              <div>
                <h4 className="font-semibold text-[#1e5fad] mb-2">LES y OTRAS ENFERMEDADES ASOCIADAS</h4>
                <p className="text-sm">dsDNA, Histone, Nucleosome, PCNA, SmB, SmD, RNP A, RNP C, RNP 68/70, P0, Ku, Nucleolin, Ro52, Ro60, La, NOR90</p>
              </div>
            </div>
          </div>
        )
      },
      {
        title: "Aplicaciones clínicas",
        content: (
          <div className="space-y-4">
            <p>Los anticuerpos antinucleares son herramientas complementarias útiles e importantes para el diagnóstico y seguimiento de:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Miopatías</li>
              <li>Lupus eritematoso sistémico</li>
              <li>Síndrome de Sjögren</li>
              <li>Artritis reumatoide</li>
              <li>Esclerosis sistémica</li>
              <li>Enfermedad mixta del tejido conjuntivo (EMTC)</li>
              <li>Pacientes con infecciones crónicas y cáncer</li>
              <li>Producción de ANA inducida por fármacos</li>
            </ul>
          </div>
        )
      },
      {
        title: "Ventajas del método",
        content: (
          <div className="space-y-4">
            <ul className="list-disc pl-6 space-y-2">
              <li>Detección cualitativa (positivo/negativo) y cuantitativa de cada antígeno</li>
              <li>Metodología de inmunoprecipitación – array en pocillos individuales</li>
              <li>Resultados cuantitativos que superan a los ensayos ELISA convencionales</li>
              <li>Alta especificidad y sensibilidad para cada antígeno</li>
              <li>Detección temprana para prevención primaria de enfermedades autoinmunes</li>
            </ul>
          </div>
        )
      },
      {
        title: "Interpretación de resultados",
        content: (
          <div className="space-y-4">
            <p>La interpretación incluye:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Análisis cuantitativo de cada uno de los 44 antígenos</li>
              <li>Correlación con el contexto clínico del paciente</li>
              <li>Identificación de patrones específicos de enfermedad</li>
              <li>Recomendaciones para seguimiento y monitorización</li>
            </ul>
            <p className="mt-4 text-gray-700">Los resultados deben ser interpretados en conjunto con la historia clínica, examen físico y otros hallazgos de laboratorio.</p>
          </div>
        )
      }
    ]
  },
  {
    id: 3,
    title: "Cofactor ristocetin Von Willebrand",
    description: "Prueba de coagulación específica",
    image: "/images/analisis/cofactor-ristocetin.jpg",
    category: "Análisis clínicos",
    slug: "cofactor-ristocetin",
    content: "Esta prueba evalúa la función del factor von Willebrand mediante su capacidad para unirse a las plaquetas en presencia de ristocetina, siendo fundamental para el diagnóstico de la enfermedad de von Willebrand.",
    details: {
      overview: "Prueba específica que evalúa la función del factor von Willebrand y su interacción con las plaquetas.",
      procedure: "Se realiza mediante una muestra de sangre que se procesa con ristocetina para evaluar la agregación plaquetaria.",
      indications: [
        "Sospecha de enfermedad de von Willebrand",
        "Evaluación de trastornos hemorrágicos",
        "Estudio preoperatorio en casos seleccionados"
      ],
      interpretation: "Los resultados se expresan en porcentaje de actividad, con valores de referencia específicos."
    }
  },
  {
    id: 4,
    title: "Panel completo antifosfolípidos",
    description: "Análisis de anticuerpos antifosfolípidos",
    image: "/images/analisis/panel-antifosfolipidos.jpg",
    category: "Análisis clínicos",
    slug: "panel-antifosfolipidos",
    content: "El panel completo de antifosfolípidos detecta y cuantifica diversos anticuerpos relacionados con el síndrome antifosfolípido, una condición que aumenta el riesgo de trombosis y complicaciones obstétricas.",
    details: {
      overview: "Análisis completo que detecta diversos tipos de anticuerpos antifosfolípidos.",
      procedure: "Se realiza mediante una muestra de sangre que se analiza para detectar múltiples anticuerpos.",
      indications: [
        "Trombosis inexplicada",
        "Pérdidas gestacionales recurrentes",
        "Complicaciones obstétricas",
        "Trombocitopenia inexplicada"
      ],
      interpretation: "Los resultados incluyen la cuantificación de cada anticuerpo y su significado clínico."
    }
  },
  {
    id: 5,
    title: "Despistaje de alergias",
    description: "Panel completo de detección de alergias mediante tecnología ImmunoCAP",
    image: "/images/analisis/despistaje-alergias.jpg",
    category: "Análisis clínicos",
    slug: "despistaje-alergias",
    content: "El diagnóstico de pacientes alérgicos hoy en día se ha visto revolucionado por los paneles de alérgenos preespecificados. La determinación de la IgE específica a través de la metodología ImmunoCAP es una medida objetiva de la IgE circulante y de la sensibilización del paciente a un alérgeno específico. Estos paneles utilizan el principio de ensayo de ELISA tipo sándwich a través del cual se asegura la unión específica y única de los anticuerpos pertinentes. Permiten obtener una medida cuantitativa de una amplia gama de alérgenos individuales de interés. Además, permiten al clínico predecir y realizar un seguimiento del desarrollo de la enfermedad, estimar el riesgo de una reacción grave y explicar la reactividad cruzada.",
    heroIcons: ["Microscope", "Flask", "TestTube"],
    sections: [
      {
        title: "¿Qué alérgenos detecta este panel?",
        content: (
          <div className="space-y-4">
            <p>Nuestro panel de despistaje de alergias detecta una amplia gama de alérgenos comunes, incluyendo:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Alérgenos alimentarios (leche, huevo, pescado, mariscos, frutos secos, etc.)</li>
              <li>Aeroalérgenos (pólenes, ácaros, epitelios de animales)</li>
              <li>Hongos y mohos</li>
              <li>Venenos de insectos</li>
              <li>Medicamentos</li>
              <li>Látex</li>
            </ul>
          </div>
        )
      },
      {
        title: "Prueba disponible",
        content: (
          <div className="space-y-4">
            <p>La prueba se realiza mediante:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Extracción de sangre venosa</li>
              <li>Análisis mediante tecnología ImmunoCAP</li>
              <li>Determinación cuantitativa de IgE específica</li>
              <li>Resultados expresados en kU/L</li>
            </ul>
            <p>Tiempo de entrega: 24-48 horas</p>
          </div>
        )
      },
      {
        title: "Indicaciones",
        content: (
          <div className="space-y-4">
            <p>Este análisis está indicado en las siguientes situaciones:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Sospecha de alergia alimentaria</li>
              <li>Síntomas respiratorios sugestivos de alergia</li>
              <li>Dermatitis o eccema de posible origen alérgico</li>
              <li>Reacciones adversas a medicamentos</li>
              <li>Screening previo a inmunoterapia</li>
              <li>Seguimiento de pacientes con alergias conocidas</li>
            </ul>
          </div>
        )
      },
      {
        title: "Interpretación de resultados",
        content: (
          <div className="space-y-4">
            <p>La interpretación de los resultados se basa en los siguientes criterios:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>{"< 0.35 kU/L: Negativo"}</li>
              <li>{"0.35-0.70 kU/L: Bajo"}</li>
              <li>{"0.70-3.50 kU/L: Moderado"}</li>
              <li>{"3.50-17.50 kU/L: Alto"}</li>
              <li>{"> 17.50 kU/L: Muy alto"}</li>
            </ul>
            <p>Los resultados deben ser interpretados en el contexto clínico del paciente y correlacionados con la historia clínica.</p>
          </div>
        )
      }
    ]
  },
  {
    id: 6,
    title: "Toxoplasma Gondii, prueba de avidez de IgG",
    description: "Análisis de anticuerpos específicos",
    image: "/images/analisis/toxoplasma-gondii.jpg",
    category: "Análisis clínicos",
    slug: "toxoplasma-gondii",
    content: "La prueba de avidez de IgG para Toxoplasma Gondii es fundamental para determinar el momento de la infección, especialmente importante durante el embarazo para evaluar el riesgo de transmisión al feto.",
    details: {
      overview: "Prueba que determina la avidez de los anticuerpos IgG contra Toxoplasma Gondii.",
      procedure: "Se realiza mediante una muestra de sangre que se analiza para determinar la fuerza de unión de los anticuerpos.",
      indications: [
        "Embarazo con IgG e IgM positivas para toxoplasma",
        "Sospecha de infección reciente por toxoplasma",
        "Control prenatal"
      ],
      interpretation: "Los resultados incluyen el índice de avidez y su interpretación clínica."
    }
  },
  {
    id: 7,
    title: "Cadenas ligeras libres séricas",
    description: "Análisis de proteínas en suero",
    image: "/images/analisis/cadenas-ligeras.jpg",
    category: "Análisis clínicos",
    slug: "cadenas-ligeras-libres",
    content: "El análisis de cadenas ligeras libres en suero es una herramienta fundamental para el diagnóstico, pronóstico y seguimiento de gammapatías monoclonales, incluyendo el mieloma múltiple.",
    details: {
      overview: "Análisis que cuantifica las cadenas ligeras kappa y lambda libres en suero.",
      procedure: "Se realiza mediante una muestra de sangre que se analiza para detectar y cuantificar las cadenas ligeras.",
      indications: [
        "Sospecha de gammapatía monoclonal",
        "Seguimiento de mieloma múltiple",
        "Evaluación de amiloidosis",
        "Monitorización de respuesta al tratamiento"
      ],
      interpretation: "Los resultados incluyen los niveles de cadenas kappa y lambda, así como su ratio."
    }
  },
  {
    id: 8,
    title: "Encefalitis autoinmune",
    description: "Panel de anticuerpos neurológicos",
    image: "/images/analisis/encefalitis-autoinmune.jpg",
    category: "Análisis clínicos",
    slug: "encefalitis-autoinmune",
    content: "El panel de encefalitis autoinmune detecta anticuerpos específicos asociados con diferentes formas de encefalitis autoinmune, una condición neurológica grave que requiere diagnóstico y tratamiento temprano.",
    details: {
      overview: "Panel completo que detecta anticuerpos asociados con encefalitis autoinmune.",
      procedure: "Se realiza mediante muestras de sangre y líquido cefalorraquídeo que se analizan para detectar anticuerpos específicos.",
      indications: [
        "Alteraciones neurológicas inexplicadas",
        "Cambios conductuales súbitos",
        "Convulsiones de inicio reciente",
        "Deterioro cognitivo rápido"
      ],
      interpretation: "Los resultados incluyen la detección y cuantificación de anticuerpos específicos y su relevancia clínica."
    }
  }
] 