import { createContext, useState } from 'react'

type CreateCycleData = {
  task: string
  minutesAmount: number
}

type StatusTimer = 'interrupted' | 'finished'

type Cycle = {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

type CycleContextType = {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  controlStateTimer: (status: StatusTimer) => void
  setSecondsPassed: (seconds: number) => void
  createNewCycle: (data: CreateCycleData) => void
  interruptCurrentCycle: () => void
}

type CycleContextProviderProps = {
  children: React.ReactNode
}

const cycleContextInitialValue: CycleContextType = {
  cycles: [],
  activeCycle: undefined,
  activeCycleId: null,
  amountSecondsPassed: 0,
  controlStateTimer: () => null,
  setSecondsPassed: () => null,
  createNewCycle: () => null,
  interruptCurrentCycle: () => null,
}

export const CycleContext = createContext(cycleContextInitialValue);

export function CycleContextProvider({ children }: CycleContextProviderProps) {

  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

  function controlStateTimer(status: StatusTimer) {

    const statusTimer = {
      interrupted: 'interruptedDate',
      finished: 'finishedDate',
    }

    setCycles(state => state.map(cycle => {
      if (cycle.id === activeCycleId) {
        return { ...cycle, [statusTimer[status]]: new Date() }
      } else {
        return cycle
      }
    }))
  }

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function createNewCycle(data: CreateCycleData) {

    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date()
    }

    setCycles(state => [...state, newCycle]);
    setActiveCycleId(newCycle.id);
    setAmountSecondsPassed(0);

    //reset();
  }

  function interruptCurrentCycle() {
    setActiveCycleId(null);
    setAmountSecondsPassed(0);

    controlStateTimer('interrupted');
  }


  return (
    <CycleContext.Provider value={{
      cycles,
      activeCycle,
      activeCycleId,
      controlStateTimer,
      amountSecondsPassed,
      setSecondsPassed,
      createNewCycle,
      interruptCurrentCycle
    }}>
      {children}
    </CycleContext.Provider>
  )
}