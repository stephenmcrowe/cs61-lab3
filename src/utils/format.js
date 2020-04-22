export function createMySqlDate(date) {
  return date.toLocaleDateString('fr-CA');
}

export function formatResult(res) {
  return (err, results, fields) => {
    if (err) {
      console.log(err);
      res.json({ status: 500, error: err.sqlMessage, response: null });
      return;
    }
    res.json({ status: 200, error: null, response: results });
  };
}
