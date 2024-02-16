import winston from "winston";
import { config } from "./config.js"

const loggerDev = winston.createLogger({
    transports: [
        new winston.transports.Console({level: 'info'}),
    ]
})

const loggerProd = winston.createLogger({
    transports: [
        new winston.transports.Console({level: 'info'}),
        new winston.transports.File({filename: 'error.logs', level:'error'})
    ]
})


export const addLogger = (req, res, next) =>{
    let logger = loggerDev;
    if(config.NODE_ENV === 'production'){
        logger = loggerProd;
    }
    req.logger = logger
    next()
}