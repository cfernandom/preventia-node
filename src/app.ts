import express from 'express'

export const app = express()

app.use(express.json())
app.get('/ping', (_, res) => {
    res.json({ message: 'pong' })
})
