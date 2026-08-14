# Primo Europa — Alumnos y trabajo en Alemania

Landing estática para hispanohablantes que llegan a Alemania por estudios, formación, Ausbildung o trabajo. La página guía el primer mes de llegada: dirección registrable, seguro médico y cuenta para nómina.

## Objetivo

La landing es reutilizable con cualquier escuela, consultoría, agencia Au Pair o recruiter. Cada socio recibe una URL propia con parámetros UTM; no se crea una landing nueva por socio.

Ejemplo para Educaro:

```text
https://alumnos-trabajo-en-alemania.primoeuropa.eu/?utm_source=educaro&utm_medium=partner_email&utm_campaign=argentina_alemania_2026&utm_content=email_2
```

## Archivos

| Archivo | Función |
|---|---|
| `index.html` | Estructura y contenido de la landing. |
| `styles.css` | Diseño responsive y estilo visual. |
| `app.js` | Selector de necesidades, atribución UTM y eventos para analítica. |
| `VALIDACION.md` | Pruebas realizadas antes de publicación. |

## Atribución

La landing interpreta estos parámetros:

- `utm_source`: socio que originó la visita, por ejemplo `educaro`.
- `utm_medium`: canal, por ejemplo `partner_email`.
- `utm_campaign`: iniciativa, por ejemplo `argentina_alemania_2026`.
- `utm_content`: pieza concreta, por ejemplo `email_2`.

`app.js` emite eventos a `window.dataLayer`. Antes de activar una plataforma de analítica o cookies no esenciales, se debe configurar el consentimiento y los avisos de privacidad correspondientes.

## Publicación posterior

1. Hacer público el repositorio cuando la landing esté aprobada.
2. Activar GitHub Pages desde la rama `main` y la carpeta raíz.
3. Publicar primero en la URL temporal de GitHub Pages.
4. Configurar el subdominio `alumnos-trabajo-en-alemania.primoeuropa.eu` mediante un registro CNAME en el proveedor DNS de `primoeuropa.eu`.
5. Añadir `CNAME` al repositorio solamente después de configurar y verificar el DNS.
6. Probar una URL de socio en incógnito antes de enviar correos.

## Desarrollo local

```bash
python3 serve_landing.py
```

Después abre `http://localhost:4173/?utm_source=educaro&utm_medium=partner_email&utm_campaign=argentina_alemania_2026&utm_content=email_2`.
