export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  const { nombre } = req.body;
  if (!nombre) return res.status(400).json({ error: 'Falta el nombre' });

  const prompt = `Eres un analista político-digital experto en México. Genera un perfil RADAR completo y detallado del político: "${nombre}".

Responde ÚNICAMENTE con un objeto JSON válido (sin markdown, sin backticks, sin texto adicional):

{
  "nombre": "Nombre completo oficial",
  "cargo": "Cargo actual · Partido · Periodo",
  "tags": ["Tag1", "Tag2", "Tag3"],
  "clima": "MIXTO-ADVERSO",
  "kpis": [
    {"label": "SEGUIDORES TOTALES", "valor": "X.XM", "nota": "contexto", "tipo": "acc"},
    {"label": "APROBACIÓN EST.", "valor": "XX%", "nota": "contexto", "tipo": "suc"},
    {"label": "PICOS NEGATIVOS", "valor": "X", "nota": "temas de crisis", "tipo": "dan"},
    {"label": "NARRATIVA PROPIA VS IMPUESTA", "valor": "XX/XX", "nota": "contexto", "tipo": "gld"},
    {"label": "SENTIMIENTO POSITIVO", "valor": "XX%", "nota": "conversación favorable", "tipo": "suc"},
    {"label": "TENDENCIA", "valor": "↑ Estable", "nota": "contexto", "tipo": "acc"}
  ],
  "sentimiento": [
    {"label": "Positivo", "pct": 40},
    {"label": "Neutro/Informativo", "pct": 28},
    {"label": "Negativo", "pct": 22},
    {"label": "Polarizado", "pct": 10}
  ],
  "temas": [
    {"tema": "Tema 1", "pct": 38, "color": "success"},
    {"tema": "Tema 2", "pct": 20, "color": "danger"},
    {"tema": "Tema 3", "pct": 14, "color": "accent"},
    {"tema": "Tema 4", "pct": 12, "color": "danger"},
    {"tema": "Tema 5", "pct": 9, "color": "gold"},
    {"tema": "Tema 6", "pct": 7, "color": "accent"}
  ],
  "narrativas_favorables": [
    {"titulo": "Narrativa positiva 1", "descripcion": "Descripción detallada."},
    {"titulo": "Narrativa positiva 2", "descripcion": "Descripción detallada."},
    {"titulo": "Narrativa positiva 3", "descripcion": "Descripción detallada."}
  ],
  "narrativas_criticas": [
    {"titulo": "Narrativa crítica 1", "descripcion": "Descripción detallada."},
    {"titulo": "Narrativa crítica 2", "descripcion": "Descripción detallada."},
    {"titulo": "Narrativa crítica 3", "descripcion": "Descripción detallada."}
  ],
  "narrativas_neutras": [
    {"titulo": "Narrativa neutral 1", "descripcion": "Descripción detallada."},
    {"titulo": "Narrativa neutral 2", "descripcion": "Descripción detallada."}
  ],
  "cronologia": [
    {"fecha": "ENE 2026", "tipo": "pos", "badge": "EVENTO POSITIVO", "evento": "Título del evento", "lectura": "Análisis detallado del impacto político-digital."},
    {"fecha": "FEB 2026", "tipo": "neg", "badge": "EVENTO NEGATIVO — CRÍTICO", "evento": "Título del evento", "lectura": "Análisis del daño reputacional."},
    {"fecha": "MAR 2026", "tipo": "pos", "badge": "EVENTO POSITIVO", "evento": "Título", "lectura": "Análisis."},
    {"fecha": "MAR 2026", "tipo": "neg", "badge": "EVENTO NEGATIVO", "evento": "Título", "lectura": "Análisis."},
    {"fecha": "ABR 2026", "tipo": "neu", "badge": "OPORTUNIDAD", "evento": "Título", "lectura": "Análisis."}
  ],
  "riesgos": [
    {"nivel": "CRÍTICO", "titulo": "Riesgo crítico", "descripcion": "Descripción y ventana de actuación."},
    {"nivel": "ALTO", "titulo": "Riesgo alto 1", "descripcion": "Descripción."},
    {"nivel": "ALTO", "titulo": "Riesgo alto 2", "descripcion": "Descripción."},
    {"nivel": "MEDIO", "titulo": "Riesgo medio", "descripcion": "Descripción."}
  ],
  "oportunidades": [
    {"nivel": "ALTO", "titulo": "Oportunidad principal", "descripcion": "Descripción y cómo capitalizarla."},
    {"nivel": "ALTO", "titulo": "Oportunidad 2", "descripcion": "Descripción."},
    {"nivel": "MEDIO", "titulo": "Oportunidad 3", "descripcion": "Descripción."},
    {"nivel": "MEDIO", "titulo": "Oportunidad 4", "descripcion": "Descripción."}
  ],
  "recomendaciones_corto": [
    {"tipo": "neg", "badge": "URGENTE · REPUTACIONAL", "titulo": "Acción urgente 1", "descripcion": "Descripción y justificación estratégica."},
    {"tipo": "neg", "badge": "URGENTE · INSTITUCIONAL", "titulo": "Acción urgente 2", "descripcion": "Descripción."},
    {"tipo": "pos", "badge": "PRIORITARIO · NARRATIVA", "titulo": "Acción prioritaria", "descripcion": "Descripción."},
    {"tipo": "neu", "badge": "PREVENTIVO · POLÍTICO", "titulo": "Acción preventiva", "descripcion": "Descripción."}
  ],
  "recomendaciones_mediano": [
    {"tipo": "pos", "badge": "ESTRATÉGICO · BLINDAJE", "titulo": "Acción estratégica 1", "descripcion": "Descripción."},
    {"tipo": "pos", "badge": "ESTRATÉGICO · PROXIMIDAD", "titulo": "Acción estratégica 2", "descripcion": "Descripción."},
    {"tipo": "neu", "badge": "OPORTUNIDAD · TERRITORIAL", "titulo": "Acción de oportunidad", "descripcion": "Descripción."},
    {"tipo": "pos", "badge": "DIGITAL · CONTENIDO", "titulo": "Acción digital", "descripcion": "Descripción."}
  ],
  "dictamen": "Párrafo ejecutivo completo de 4-5 oraciones con análisis global de la situación político-digital actual.",
  "veredictos": [
    {"tipo": "suc", "titulo": "FORTALEZA PRINCIPAL", "cuerpo": "Descripción."},
    {"tipo": "dan", "titulo": "VULNERABILIDAD PRINCIPAL", "cuerpo": "Descripción."},
    {"tipo": "acc", "titulo": "NARRATIVA A REFORZAR", "cuerpo": "Descripción."},
    {"tipo": "gld", "titulo": "NARRATIVA A DESACTIVAR", "cuerpo": "Descripción y ventana."},
    {"tipo": "neu", "titulo": "OPORTUNIDAD INMEDIATA", "cuerpo": "Descripción."},
    {"tipo": "ris", "titulo": "RIESGO SI NO ACTÚA", "cuerpo": "Descripción del escenario negativo."}
  ]
}

Basa todo en información real sobre "${nombre}". Usa datos 2024-2026. Sé específico y analítico.`;

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
let jsonMatch = cleaned.match(/\{[\s\S]*\}/);
if (!jsonMatch) return res.status(500).json({ error: 'No se pudo parsear la respuesta' });
cleaned = jsonMatch[0]
  .replace(/:\s*\+(\d)/g, ': $1')
  .replace(/,\s*([}\]])/g, '$1');
try {
  const parsed = JSON.parse(cleaned);
  return res.status(200).json(parsed);
} catch(e) {
  return res.status(500).json({ error: 'JSON inválido: ' + e.message, raw: rawText.substring(0, 500) });
}

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
