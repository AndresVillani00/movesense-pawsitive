import json

class Prompt:
    @staticmethod
    def build(json_data, context, tipo):
        prompt = {
            "orina": "Genera un reporte de análisis de orina detallado.",
            "incidencia": "Genera un reporte de análisis de incidencia clínica detallado.",
            "comida": "Genera un reporte de análisis de la dieta y comida de la mascota.",
            "general": "Genera un reporte general y un plan de acción basado en los tres análisis anteriores."
        }

        return f"""
Eres un sistema experto en salud veterinaria digital.
Tipo de análisis: {tipo.upper()}

Documentación adicional:
{context}

JSON recibido:
{json.dumps(json_data, indent=2)}

{prompt.get(tipo, "Genera un reporte clínico.")}
"""

