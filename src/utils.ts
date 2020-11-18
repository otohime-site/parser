export function assertNonEmpty (value: string, varName: string): asserts value {
  if (value.length === 0) {
    throw new Error(`Cannot get the value of ${varName}`)
  }
}

export function assertBetween (value: number, from: number, to: number, varName: string): asserts value {
  if (Number.isNaN(value) || value < from || value > to) {
    throw new Error(`Assert failed for ${varName}`)
  }
}
