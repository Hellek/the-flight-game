import { createContext } from 'react'
import type { DIContainer } from './container'

export const ContainerContext = createContext<DIContainer | null>(null)
