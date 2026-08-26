// Arranque mínimo de JSON Server: no contiene autenticación ni lógica de backend.
import jsonServer from 'json-server';

const app = jsonServer.create();
app.use(jsonServer.defaults());
app.use(jsonServer.bodyParser);
app.use(jsonServer.rewriter({ '/auth/login': '/authLogin' }));
app.use(jsonServer.router('db.json'));
app.listen(process.env.PORT || 3000, () => console.log('JSON Server en http://localhost:3000'));
