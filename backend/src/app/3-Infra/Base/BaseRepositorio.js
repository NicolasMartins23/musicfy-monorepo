import mysql from "mysql2/promise";

const connectionString = process.env.DATABASE_URL;

const pool = connectionString
    ? mysql.createPool(connectionString)
    : mysql.createPool({
        host: process.env.DB_HOST || "localhost",
        port: parseInt(process.env.DB_PORT || "3306", 10),
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "musicfy",
        waitForConnections: true,
        connectionLimit: Number(process.env.DB_CONNECTION_LIMIT ?? 2),
        queueLimit: 0,
        connectTimeout: Number(process.env.DB_CONNECT_TIMEOUT ?? 10000),
        enableKeepAlive: true,
        ssl: process.env.DB_SSL === "true"
            ? {
                rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== "false"
            }
            : undefined,
    });

export class BaseRepositorio {
    constructor() {
        this.db = pool;
    }

    async query(sql, params = []) {
        const env = process.env.ENVIRONMENT || "dev";

        if (env === "dev") {
            const formattedSql = mysql.format(sql, params);
            console.log("\n[SQL COMMAND]:", formattedSql, "\n");
        }

        return await this.db.execute(sql, params);
    }

    async executar(callback) {
        try {
            return await callback();
        } catch (error) {
            console.error("Erro na operação de banco de dados:", error.message);
            throw error;
        }
    }

    createWhere(configuracaoFiltros = {}) {
        const conditions = [];
        const values = [];

        Object.keys(configuracaoFiltros).forEach(expressao => {
            const valor = configuracaoFiltros[expressao];

            if (valor === undefined || valor === null || valor === "") return;

            if (expressao.trim().toUpperCase().endsWith("IN")) {
                if (Array.isArray(valor) && valor.length > 0) {
                    const placeholders = valor.map(() => "?").join(", ");
                    conditions.push(`${expressao} (${placeholders})`);
                    valor.forEach(val => values.push(val));
                }
            } else {
                conditions.push(`${expressao} ?`);
                values.push(valor);
            }
        });

        return {
            whereStr: conditions.length > 0 ? ` WHERE ${conditions.join(' AND ')}` : '',
            params: values
        };
    }
}
