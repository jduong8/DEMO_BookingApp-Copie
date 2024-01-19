// Fonction pour formater une date en YYYY-MM-DD
const formatDate = (date) => {
  const d = new Date(date);
  let month = "" + (d.getMonth() + 1); // Les mois en JavaScript commencent à 0
  let day = "" + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [day, month, year].join("-");
};

// Fonction pour formater le temps en HH:MM
const formatTime = (time) => {
  // Extrait HH:MM de HH:MM:SS
  // (0, 5) correspond aux index de début et de fin
  // 0 début de la chaine
  // 5 fin de la chaine
  return time.slice(0, 5);
};

module.exports = {
  formatDate,
  formatTime,
};
