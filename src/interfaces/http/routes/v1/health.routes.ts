import { Router } from 'express'
import prisma from '../../../../infrastructure/db/prisma-client'
const router = Router()

router.get('/', (_, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: prisma.$queryRaw`SELECT 1`.then(() => 'CONNECTED').catch(() => 'DISCONNECTED')
  })
})

export default router
