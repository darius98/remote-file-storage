import express from "express";
import bodyParser from "body-parser";
import {readFileSync, existsSync, writeFile, mkdirSync} from "fs";
import {join, resolve} from "path";

function isValidKey(key) {
    return /[a-zA-Z0-9_-][.a-zA-Z0-9_-]*[a-zA-Z0-9_-]/.test(key);
}

function log(message) {
    console.log(`[${(new Date()).toISOString()}] ${message}`);
}

function logReq(req, method, status) {
    log(`${req.ip} ${method} ${req.params.key} ${status}`);
}

function main() {
    const app = express();
    app.use(bodyParser.text({type: "*/*"}));
    app.use((req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        next();
    });

    const configPath = process.argv[2] || "/var/rfs/config.json";
    const config = JSON.parse(readFileSync(configPath).toString("utf-8"));
    const {port, data} = config;

    const dataDir = resolve(data);

    mkdirSync(dataDir, {
        recursive: true,
    });

    app.get("/get/:key", (req, res) => {
        const {key} = req.params;
        if (!isValidKey(key)) {
            logReq(req, "GET", 400);
            res.status(400);
            res.send();
            return;
        }
        const filePath = join(dataDir, key + ".txt");
        if (!existsSync(filePath)) {
            logReq(req, "GET", 404);
            res.status(404);
            res.send();
            return;
        }
        logReq(req, "GET", 200);
        res.status(200);
        res.sendFile(filePath);
    });

    app.post("/set/:key", (req, res) => {
        const {key} = req.params;
        const value = req.body;
        if (!isValidKey(key)) {
            logReq(req, "SET", 400);
            res.status(400);
            res.send();
            return;
        }
        const filePath = join(dataDir, key + ".txt");
        writeFile(filePath, value, () => {
            logReq(req, "SET", 200);
            res.status(200).send();
        });
    });

    app.listen(port, () => {
        log(`Remote file storage server listening at port ${port}`);
        log(`Using data directory ${dataDir}`);
    });
}

main();
