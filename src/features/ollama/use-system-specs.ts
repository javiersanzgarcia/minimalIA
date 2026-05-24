import { useEffect, useState } from "react"
import type { SystemSpecs } from "./system"
import { getSystemSpecs } from "./system"

export function useSystemSpecs(): SystemSpecs | null {
  const [specs, setSpecs] = useState<SystemSpecs | null>(null)

  useEffect(() => {
    getSystemSpecs().then(setSpecs)
  }, [])

  return specs
}
