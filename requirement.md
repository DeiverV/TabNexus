# Documento de Requerimiento: Extension **TabNexus**

### (Core Funcional + Estética Y2K / Frutiger Aero)

---

## 1. Objetivo del Proyecto

Desarrollar una extensión de Google Chrome que permita capturar, organizar y restaurar sesiones de pestañas, mediante una experiencia visual diferenciadora inspirada en interfaces retro-futuristas (Y2K / Frutiger Aero).

El producto no solo busca mejorar la productividad, sino también generar **engagement emocional** a través de una interfaz inmersiva tipo “dispositivo”.

---

## 2. Propuesta de Valor

* Guardar sesiones de trabajo en 1 clic.
* Recuperarlas instantáneamente.
* Diferenciarse visualmente de cualquier extensión actual (casi todas son minimalistas → aquí ganas).

---

## 3. Especificaciones Técnicas

* **Plataforma:** Google Chrome (Manifest V3)
* **Storage:** `chrome.storage.sync`
* **Permisos:**

  * `tabs`
  * `storage`
  * `contextMenus`
* **Stack recomendado:**

  * Vite + React (ideal para ti)
  * CSS avanzado (sin depender de frameworks pesados)

---

## 4. Requerimientos Funcionales (RF)

### RF-01: Captura de Sesión ("Snap")

* **Trigger:** Botón principal (circular estilo media player)

* **Acción:**

  * Captura todas las tabs de la ventana actual
  * Solicita nombre de sesión, color de fondo y color de texto
  * Guarda sin cerrar pestañas

* **Feedback UI:**

  * Animación breve tipo:

    * escaneo
    * parpadeo LED
    * glow dinámico

---

### RF-02: Biblioteca de Sesiones

* **Visualización:**

  * No usar cards planas
  * Usar “módulos” tipo panel sci-fi

* **Contenido:**

  * Nombre de sesión
  * Contador de tabs → estilo display digital (7 segmentos)

* **Personalización:**

  * Color de glow (fondo/luz)
  * Color de texto (neón)

---

### RF-03: Detalle e Inspección

* **Trigger:** Icono tipo “ojo”

* **UI:**

  * Modal estilo:

    * panel deslizante
    * consola de diagnóstico

* **Funciones:**

  * Listar URLs
  * Eliminar URLs individuales
  * Renombrar sesión

---

### RF-04: Apertura de Sesión

* **Trigger:** Click en módulo
* **Flujo:**

  1. Mostrar confirmación estilo “System Prompt”
  2. Si acepta:

     * Abrir todas las tabs en la ventana actual

---

### RF-05: Creación Manual

* **UI:**

  * Panel tipo consola antigua

* **Funciones:**

  * Definir nombre
  * Agregar URLs manualmente
  * Seleccionar colores

---

### RF-06: Eliminación de Sesión

* Botón tipo papelera
* Confirmación obligatoria
* Eliminación permanente del storage

---

## 5. Dirección de Arte (Look & Feel)

Aquí es donde haces que el producto destaque de verdad.

### Estilo General

* Frutiger Aero / Y2K Futuristic
* Skeuomorfismo (parece un objeto físico)

---

### Elementos Visuales

#### 🔘 Botones

* Glossy / efecto vidrio
* Relieve con múltiples `box-shadow`
* Estados:

  * hover → glow LED
  * active → “presionado físico”

---

#### 🧱 Paneles

* Texturas:

  * metal cepillado
  * fibra de carbono
* Bordes:

  * ultra redondeados
* Sensación:

  * módulos encapsulados

---

#### 💡 Iluminación

* Uso de:

  * `text-shadow` (glow)
  * `box-shadow` multicapa
* Colores:

  * neón (verde, azul, cyan, magenta)

---

#### 🖥 Pantallas

* Tipografía:

  * monoespaciada
* Estilo:

  * LCD / terminal
* Efectos:

  * ligero flicker o glow

---

#### 🔢 Contadores

* Estilo:

  * display digital (7 segmentos)
* Uso:

  * número de tabs

---

## 6. UX / Interacción

* Todo debe sentirse como:

  * una máquina
  * un reproductor
  * una consola

No como una web común.

---

## 7. Modelo de Datos (Unificado)

```json
{
  "sessions": [
    {
      "id": "unique_timestamp",
      "name": "Investigación AI",
      "tabs": [
        {
          "title": "OpenAI Docs",
          "url": "https://...",
          "favIcon": "https://..."
        }
      ],
      "ui_theme": {
        "glowColor": "#00ffcc",
        "textColor": "#ffffff",
        "panelTexture": "brushed-metal"
      }
    }
  ]
}
```

---
