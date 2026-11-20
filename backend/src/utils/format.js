// Small text helpers shared by the email notifications.
exports.formatDate = (iso) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

exports.SIGNATURE = 'Elite Hair & Beauty\nThe1054, 254 Main Road, Walmer, Gqeberha\n041 581 0090  |  info@elitehair.co.za';
