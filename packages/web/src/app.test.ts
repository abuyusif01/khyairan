import { describe, it, expect } from 'vitest'
import { initApp } from './main'

describe('Web app', () => {
  it('initApp does not throw', () => {
    expect(() => initApp()).not.toThrow()
  })
})
