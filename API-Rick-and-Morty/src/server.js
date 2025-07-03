const app = require('./app');
const prisma = require('./config/database');

const PORT = process.env.PORT || 3000;

// Função para inicializar o servidor
const startServer = async () => {
  try {
    // Testar conexão com o banco de dados
    await prisma.$connect();
    console.log('Conectado ao banco de dados');

    // Iniciar servidor
    const server = app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
      console.log(`API disponível em: http://localhost:${PORT}/api`);
        console.log(` Health check: http://localhost:${PORT}/api/health`);
      
      if (process.env.NODE_ENV === 'development') {
        console.log(' Documentação das rotas:');
        console.log('  POST /api/auth/register - Cadastro de usuário');
        console.log('  POST /api/auth/login - Login');
        console.log('  GET  /api/auth/profile - Perfil do usuário');
        console.log('  GET  /api/characters - Listar personagens');
        console.log('  GET  /api/characters/:id - Buscar personagem por ID');
        console.log('  GET  /api/favorites - Listar favoritos');
        console.log('  POST /api/favorites - Adicionar favorito');
        console.log('  PUT  /api/favorites/:id - Atualizar favorito');
        console.log('  DELETE /api/favorites/:id - Remover favorito');
        console.log('  GET  /api/favorites/episodes - Episódios por favorito');
        console.log('  GET  /api/favorites/episodes/unique - Episódios únicos');
        console.log('  GET  /api/episodes - Listar episódios');
        console.log('  GET  /api/locations - Listar locações');
      }
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
      console.log(`\n  Recebido sinal ${signal}. Iniciando shutdown graceful...`);
      
      server.close(async () => {
        console.log(' Servidor HTTP fechado');
        
        try {
          await prisma.$disconnect();
          console.log(' Conexão com banco de dados fechada');
          process.exit(0);
        } catch (error) {
          console.error(' Erro ao fechar conexão com banco:', error);
          process.exit(1);
        }
      });
    };

    // Handlers para sinais de shutdown
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error(' Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

// Tratar erros não capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error(' Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error(' Uncaught Exception:', error);
  process.exit(1);
});

// Inicializar servidor
startServer();