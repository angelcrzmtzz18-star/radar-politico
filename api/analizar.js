export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  const { nombre, fecha } = req.body;
  if (!nombre) return res.status(400).json({ error: 'Falta el nombre' });

  const fechaCtx = fecha || 'abril 2026';

  // PASO 1: Buscar información real con Tavily
  let contextoReal = '';
  try {
    const tavilyRes = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: process.env.TAVILY_API_KEY,
        query: `${nombre} político México noticias ${fechaCtx}`,
        search_depth: 'advanced',
        max_results: 8,
        include_answer: true,
        include_raw_content: false
      })
    });

    if (tavilyRes.ok) {
      const tavilyData = await tavilyRes.json();
      const resultados = (tavilyData.results || []).map(r =>
        `FUENTE: ${r.title}\nURL: ${r.url}\nCONTENIDO: ${r.content}`
      ).join('\n\n---\n\n');
      const respuestaDirecta = tavilyData.answer || '';
      contextoReal = `INFORMACION REAL ENCONTRADA EN INTERNET:\n\nResumen: ${respuestaDirecta}\n\nFuentes:\n${resultados}`;
    }
  } catch (e) {
    contextoReal = 'No se pudo obtener informacion en tiempo real. Usa tu conocimiento base.';
  }

  // PASO 2: Generar análisis con GPT-4o Mini usando el contexto real
  const prompt = `Eres un analista politico-digital experto en Mexico. La fecha de consulta es: ${fechaCtx}.

INFORMACION REAL Y ACTUAL SOBRE "${nombre}" (obtenida de internet ahora mismo):
${contextoReal}

Basandote en esa informacion real, genera un perfil RADAR completo y ACTUALIZADO a ${fechaCtx} del politico: "${nombre}".

IMPORTANTE: 
- Usa la informacion real proporcionada arriba como base principal
- El cargo debe ser el correcto a ${fechaCtx} segun las fuentes
- Los eventos de la cronologia deben ser reales segun las fuentes
- Se especifico con datos verificables

Responde UNICAMENTE con un objeto JSON valido (sin markdown, sin backticks, sin texto adicional). Todos los valores numericos en "pct" deben ser numeros enteros sin signo + ni -:

{
  "nombre": "Nombre completo oficial",
  "cargo": "Cargo exacto a ${fechaCtx} · Partido · Periodo",
  "fecha_analisis": "${fechaCtx}",
  "tags": ["Tag1", "Tag2", "Tag3"],
  "clima": "MIXTO-ADVERSO",
  "kpis": [
    {"label": "SEGUIDORES TOTALES", "valor": "X.XM", "nota": "contexto", "tipo": "acc"},
    {"label": "APROBACION EST.", "valor": "XX%", "nota": "contexto", "tipo": "suc"},
    {"label": "PICOS NEGATIVOS", "valor": "X", "nota": "temas de crisis", "tipo": "dan"},
    {"label": "NARRATIVA PROPIA VS IMPUESTA", "valor": "XX/XX", "nota": "contexto", "tipo": "gld"},
    {"label": "SENTIMIENTO POSITIVO", "valor": "XX%", "nota": "conversacion favorable", "tipo": "suc"},
    {"label": "TENDENCIA", "valor": "Estable", "nota": "contexto", "tipo": "acc"}
  ],
  "sentimiento": [
    {"label": "Positivo", "pct": 40},
    {"label": "Neutro/Informativo", "pct": 28},
    {"label": "Negativo", "pct": 22},
    {"label": "Polarizado", "pct": 10}
  ],
  "temas": [
    {"tema": "Tema principal", "pct": 38, "color": "success"},
    {"tema": "Tema 2", "pct": 20, "color": "danger"},
    {"tema": "Tema 3", "pct": 14, "color": "accent"},
    {"tema": "Tema 4", "pct": 12, "color": "danger"},
    {"tema": "Tema 5", "pct": 9, "color": "gold"},
    {"tema": "Tema 6", "pct": 7, "color": "accent"}
  ],
  "narrativas_favorables": [
    {"titulo": "Narrativa positiva 1", "descripcion": "Descripcion detallada basada en fuentes reales."},
    {"titulo": "Narrativa positiva 2", "descripcion": "Descripcion detallada."},
    {"titulo": "Narrativa positiva 3", "descripcion": "Descripcion detallada."}
  ],
  "narrativas_criticas": [
    {"titulo": "Narrativa critica 1", "descripcion": "Descripcion detallada."},
    {"titulo": "Narrativa critica 2", "descripcion": "Descripcion detallada."},
    {"titulo": "Narrativa critica 3", "descripcion": "Descripcion detallada."}
  ],
  "narrativas_neutras": [
    {"titulo": "Narrativa neutral 1", "descripcion": "Descripcion detallada."},
    {"titulo": "Narrativa neutral 2", "descripcion": "Descripcion detallada."}
  ],
  "cronologia": [
    {"fecha": "Mes/Anio real", "tipo": "pos", "badge": "EVENTO POSITIVO", "evento": "Titulo real", "lectura": "Analisis del impacto."},
    {"fecha": "Mes/Anio", "tipo": "neg", "badge": "EVENTO NEGATIVO", "evento": "Titulo real", "lectura": "Analisis del dano."},
    {"fecha": "Mes/Anio", "tipo": "pos", "badge": "EVENTO POSITIVO", "evento": "Titulo", "lectura": "Analisis."},
    {"fecha": "Mes/Anio", "tipo": "neg", "badge": "EVENTO NEGATIVO", "evento": "Titulo", "lectura": "Analisis."},
    {"fecha": "Mes/Anio", "tipo": "neu", "badge": "OPORTUNIDAD", "evento": "Titulo", "lectura": "Analisis."}
  ],
  "riesgos": [
    {"nivel": "CRITICO", "titulo": "Riesgo critico", "descripcion": "Descripcion y ventana de actuacion."},
    {"nivel": "ALTO", "titulo": "Riesgo alto 1", "descripcion": "Descripcion."},
    {"nivel": "ALTO", "titulo": "Riesgo alto 2", "descripcion": "Descripcion."},
    {"nivel": "MEDIO", "titulo": "Riesgo medio", "descripcion": "Descripcion."}
  ],
  "oportunidades": [
    {"nivel": "ALTO", "titulo": "Oportunidad principal", "descripcion": "Descripcion y como capitalizarla."},
    {"nivel": "ALTO", "titulo": "Oportunidad 2", "descripcion": "Descripcion."},
    {"nivel": "MEDIO", "titulo": "Oportunidad 3", "descripcion": "Descripcion."},
    {"nivel": "MEDIO", "titulo": "Oportunidad 4", "descripcion": "Descripcion."}
  ],
  "recomendaciones_corto": [
    {"tipo": "neg", "badge": "URGENTE · REPUTACIONAL", "titulo": "Accion urgente 1", "descripcion": "Descripcion estrategica."},
    {"tipo": "neg", "badge": "URGENTE · INSTITUCIONAL", "titulo": "Accion urgente 2", "descripcion": "Descripcion."},
    {"tipo": "pos", "badge": "PRIORITARIO · NARRATIVA", "titulo": "Accion prioritaria", "descripcion": "Descripcion."},
    {"tipo": "neu", "badge": "PREVENTIVO · POLITICO", "titulo": "Accion preventiva", "descripcion": "Descripcion."}
  ],
  "recomendaciones_mediano": [
    {"tipo": "pos", "badge": "ESTRATEGICO · BLINDAJE", "titulo": "Accion estrategica 1", "descripcion": "Descripcion."},
    {"tipo": "pos", "badge": "ESTRATEGICO · PROXIMIDAD", "titulo": "Accion estrategica 2", "descripcion": "Descripcion."},
    {"tipo": "neu", "badge": "OPORTUNIDAD · TERRITORIAL", "titulo": "Accion de oportunidad", "descripcion": "Descripcion."},
    {"tipo": "pos", "badge": "DIGITAL · CONTENIDO", "titulo": "Accion digital", "descripcion": "Descripcion."}
  ],
  "dictamen": "Parrafo ejecutivo de 4-5 oraciones con analisis global de la situacion politico-digital.",
  "veredictos": [
    {"tipo": "suc", "titulo": "FORTALEZA PRINCIPAL", "cuerpo": "Descripcion."},
    {"tipo": "dan", "titulo": "VULNERABILIDAD PRINCIPAL", "cuerpo": "Descripcion."},
    {"tipo": "acc", "titulo": "NARRATIVA A REFORZAR", "cuerpo": "Descripcion."},
    {"tipo": "gld", "titulo": "NARRATIVA A DESACTIVAR", "cuerpo": "Descripcion y ventana."},
    {"tipo": "neu", "titulo": "OPORTUNIDAD INMEDIATA", "cuerpo": "Descripcion."},
    {"tipo": "ris", "titulo": "RIESGO SI NO ACTUA", "cuerpo": "Descripcion del escenario negativo."}
  ]
}`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://radar-politico.vercel.app',
        'X-Title': 'RADAR Politico'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        max_tokens: 8000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(500).json({ error: 'Error de API: ' + err });
    }

    const data = await response.json();
    const rawText = data.choices?.[0]?.message?.content || '';

    let cleaned = rawText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return res.status(500).json({ error: 'No se pudo parsear la respuesta', raw: rawText.substring(0, 300) });

    cleaned = jsonMatch[0]
      .replace(/:\s*\+(\d)/g, ': $1')
      .replace(/,\s*([}\]])/g, '$1');

    try {
      const parsed = JSON.parse(cleaned);
      return res.status(200).json(parsed);
    } catch(e) {
      return res.status(500).json({ error: 'JSON invalido: ' + e.message, raw: rawText.substring(0, 500) });
    }

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
