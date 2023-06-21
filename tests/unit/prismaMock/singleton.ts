import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'

import prisma from './client'

jest.mock('./client', () => ({
    __esModule: true,
    // @ts-ignore
    default: mockDeep<PrismaClient>(),
}))

beforeEach(() => {
    mockReset(prismaMock)
})

// @ts-ignore
export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>