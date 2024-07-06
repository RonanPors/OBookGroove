// Transforme une date en format ISO en un format 'année-mois-jour'
export function isoToDate(value) {
  return value.slice(0, 'yyyy-mm-dd'.length);
}
