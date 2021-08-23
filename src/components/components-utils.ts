import { BEMBlock, BEMModifiers } from 'bem-helpers'

export type modList = (string | undefined)[]

interface BEMFunction {
  (element?: string, modifiers?: BEMModifiers | modList): string;
  (modifiers?: BEMModifiers | modList): string;
}

export const BEM = (blockName: string, styles: {[key: string]: string} = {}): BEMFunction => {
  const bem = BEMBlock(blockName)
  return (nameOrModifiers?: string | BEMModifiers | modList, modifiers?: BEMModifiers | modList) => {
    const toModifiers = (list: modList) => list
      .filter(_ => !!_)
      .reduce((acc, mod) => ({...acc, [mod as any]: true}), {})

    if (nameOrModifiers instanceof Array) {
      nameOrModifiers = toModifiers(nameOrModifiers)
    } else if(modifiers instanceof Array) {
      modifiers = toModifiers(modifiers)
    }

    return bem(nameOrModifiers as any, modifiers as any)
      .split(' ')
      .map(name => styles[name] || name)
      .join(' ')
  }
}

export function extendClassName(props: {className?: string}, className: string = '') {
  return `${className} ${props.className || ''}`
}
