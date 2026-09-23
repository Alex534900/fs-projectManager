# FS Project Manager

Aplicación web para la gestión de proyectos y tareas mediante una arquitectura Full Stack con frontend React y backend Node.js utilizando Prisma ORM.

<!-- BADGE_CI -->

## 🚀 Instalación local

```bash
git clone https://github.com/Alex534900/fs-projectManager.git
cd fs-projectManager
npm install
```

### Variables de entorno

Crea un archivo `.env` en la raíz con las siguientes claves (sin valores reales en este documento):

```env
DATABASE_URL=
JWT_SECRET=
PORT=
```

## 📜 Comandos disponibles

| Comando | Descripción |

| `npm run dev` | Levanta el entorno de desarrollo |
| `npm run build` | Genera el build de producción |
| `npm test` | Corre las pruebas automatizadas  |

## 🗄️ Base de datos

PostgreSQL con migraciones y seeds gestionados con Prisma .
