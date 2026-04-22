export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  const { nombre } = req.body;
  if (!nombre) return res.status(400).json({ error: 'Falta el nombre' });

  const prompt = `Eres un analista político-digital experto en México. El usuario busca un perfil RADAR del político: "${nombre}".

Usa tu conocimiento actualizado y búsqueda web para generar un análisis político-digital completo y realista de esta persona.

Responde ÚNICAMENTE con un objeto JSON válido (sin markdown, sin backticks, sin texto adicional) con esta estructura exacta:

{
  "nombre": "Nombre completo oficial",
  "cargo": "Cargo actual y partido/coalición",
  "kpis": [
    {"label": "VISIBILIDAD MEDIÁTICA", "valor": "Alta", "nota": "breve contexto", "tipo": "acc"},
    {"label": "APROBACIÓN EST.", "valor": "62%", "nota": "breve contexto", "tipo": "suc"},
    {"label": "RIESGO DIGITAL", "valor": "Medio", "nota": "breve contexto", "tipo": "dan"},
    {"label": "TENDENCIA", "valor": "↑ Estable", "nota": "breve contexto", "tipo": "gld"}
  ],
  "posicionamiento": [
    {"tipo": "pos", "titulo": "Narrativa principal", "descripcion": "descripción"},
    {"tipo": "neu", "titulo": "Narrativa secundaria", "descripcion": "descripción"},
    {"tipo": "neg", "titulo": "Riesgo narrativo", "descripcion": "descripción"}
  ],
  "narrativas_positivas": [
    {"titulo": "Título", "descripcion": "Descripción detallada"},
    {"titulo": "Título", "descripcion": "Descripción detallada"},
    {"titulo": "Título", "descripcion": "Descripción detallada"}
  ],
  "narrativas_negativas": [
    {"titulo": "Título", "descripcion": "Descripción detallada"},
    {"titulo": "Título", "descripcion": "Descripción detallada"}
  ],
  "temas": [
    {"tema": "Tema 1", "pct": 35},
    {"tema": "Tema 2", "pct": 22},
    {"tema": "Tema 3", "pct": 18},
    {"tema": "Tema 4", "pct": 12},
    {"tema": "Tema 5", "pct": 8},
    {"tema": "Tema 6", "pct": 5}
  ],
  "redes_kpis": [
    {"label": "SEGUIDORES TOTALES", "valor": "X.XM", "nota": "suma de plataformas", "tipo": "acc"},
    {"label": "ENGAGEMENT RATE", "valor": "X.X%", "nota": "promedio plataformas", "tipo": "suc"},
    {"label": "MENCIONES/DÍA", "valor": "~X,XXX", "nota": "estimado reciente", "tipo": "gld"},
    {"label": "SENTIMIENTO NETO", "valor": "XX%", "nota": "positivo vs negativo", "tipo": "suc"}
  ],
  "plataformas": [
    {"nombre": "Facebook", "pct": 40},
    {"nombre": "X (Twitter)", "pct": 25},
    {"nombre": "Instagram", "pct": 20},
    {"nombre": "TikTok", "pct": 10},
    {"nombre": "YouTube", "pct": 5}
  ],
  "sentimiento": [
    {"label": "Positivo", "pct": 45},
    {"label": "Neutro", "pct": 30},
    {"label": "Negativo", "pct": 20},
    {"label": "Polarizado", "pct": 5}
  ],
  "recomendaciones": [
    {"tipo": "est", "titulo": "Recomendación estratégica", "descripcion": "descripción detallada"},
    {"tipo": "dig", "titulo": "Recomendación digital", "descripcion": "descripción detallada"},
    {"tipo": "nar", "titulo": "Recomendación narrativa", "descripcion": "descripción detallada"},
    {"tipo": "est", "titulo": "Recomendación adicional", "descripcion": "descripción detallada"}
  ],
  "dictamen": "Párrafo ejecutivo de 3-4 oraciones con el análisis global de la situación actual del político.",
  "veredictos": [
    {"tipo": "suc", "titulo": "FORTALEZA PRINCIPAL", "cuerpo": "descripción"},
    {"tipo": "dan", "titulo": "VULNERABILIDAD PRINCIPAL", "cuerpo": "descripción"},
    {"tipo": "acc", "titulo": "NARRATIVA A REFORZAR", "cuerpo": "descripción"},
    {"tipo": "gld", "titulo": "NARRATIVA A DESACTIVAR", "cuerpo": "descripción"},
    {"tipo": "neu", "titulo": "OPORTUNIDAD INMEDIATA", "cuerpo": "descripción"},
    {"tipo": "ris", "titulo": "RIESGO SI NO ACTÚA", "cuerpo": "descripción"}
  ]
}

Basa tus respuestas en información real y verificable sobre "${nombre}". Si es un político mexicano conocido, usa datos actuales de 2024-2026. Los porcentajes deben ser realistas y coherentes entre sí.`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://radar-politico.vercel.app',
        'X-Title': 'RADAR Político'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-001',
        max_tokens: 3000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(500).json({ error: 'Error de API: ' + err });
    }

    const data = await response.json();
    const rawText = data.choices?.[0]?.message?.content || '';
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) return res.status(500).json({ error: 'No se pudo parsear la respuesta' });

    const parsed = JSON.parse(jsonMatch[0]);
    return res.status(200).json(parsed);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
