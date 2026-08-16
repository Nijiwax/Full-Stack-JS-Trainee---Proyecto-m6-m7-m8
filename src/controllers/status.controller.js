// Ruta pública que informa el estado del servidor (respuesta en JSON)
export const status = (req, res) => {
    res.json({
        status: "ok",
        message: "Servidor operativo",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
};