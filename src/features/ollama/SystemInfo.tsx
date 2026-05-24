import { useTranslation } from "react-i18next"
import { getRecommendedChat, getRecommendedCode } from "./recommendations"
import { useSystemSpecs } from "./use-system-specs"

function val(v: number | null, unit: string): string {
  return v !== null ? `${v}${unit}` : `?${unit}`
}

export function SystemInfo() {
  const { t } = useTranslation()
  const specs = useSystemSpecs()

  if (!specs) return null

  const info = t("ollama.systemInfo", {
    os: specs.os,
    cores: String(specs.cores),
    ram: val(specs.ram, "GB"),
    gpu: specs.gpu,
    vram: val(specs.vram, "GB"),
  })
  const chatRec = getRecommendedChat(specs)
  const codeRec = getRecommendedCode(specs)

  return (
    <div className="text-center mb-8 text-sm text-[var(--elevate-muted)] leading-relaxed">
      <p className="mb-1">{info}</p>
      <p>
        ⭐ {t("ollama.recommended")}:{" "}
        <span className="font-[roboto-medium]">{chatRec}</span> ·{" "}
        <span className="font-[roboto-medium]">{codeRec}</span>
      </p>
    </div>
  )
}
