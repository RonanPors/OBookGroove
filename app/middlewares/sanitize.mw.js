import sanitizeHtml from "sanitize-html";

export default function sanitizeMiddleware(req, _, next) {

  // Fonction récursive pour nettoyer un objet avec sanitize
  const sanitizeObject = (obj) => {

    // Boucler sur l'objet afin d'avoir les clés
    for (let key in obj) {

      if (obj[key] && typeof obj[key] === 'object') {

        // Va entrer dans l'objet si c'est un objet enfant
        sanitizeObject(obj[key]);

      } else if (typeof obj[key] === 'string') {

        // Va nettoyer la valeur si c'est bien une string
        obj[key] = sanitizeHtml(obj[key], {
          allowedTags: [],
          allowedAttributes: [],
        });

      }

    }

  };

  if (req.params) sanitizeObject(req.params);

  if (req.body) sanitizeObject(req.body);

  next();

}
