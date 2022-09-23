import React, { useRef, useState, useEffect } from 'react'

function useDynamicSvgImport(
  name: string,
  onCompleted?: (name: string, ref: React.FC<React.SVGProps<SVGSVGElement>> | undefined) => void,
  onError?: (error: Error | unknown) => void
) {
  const ImportedIconRef = useRef<React.FC<React.SVGProps<SVGSVGElement>>>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | unknown>()

  useEffect(() => {
    const importIcon = async (): Promise<void> => {
      try {
        const svgFile = path.replace('./', '')
        const svgName = svgFile.replace(/\.(svg)$/, '')
        const Icon = (
          await import(
            /* webpackMode: "eager" */ `!@svgr/webpack!../../public/assets/logos/${svgName}.svg`
          )
        )?.default
        ImportedIconRef.current = (await import(`./${name}.svg`)).ReactComponent
        onCompleted?.(name, ImportedIconRef.current)
      } catch (err) {
        onError?.(err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }
    importIcon()
  }, [name, onCompleted, onError])

  return { error, loading, SvgIcon: ImportedIconRef.current }
}
