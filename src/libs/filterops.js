import GlSpec from '../config/v8.json'
export const combiningFilterOps = ['all', 'any', 'none']
export const setFilterOps = ['in', '!in']
export const otherFilterOps = Object
  .keys(GlSpec.filter_operator.values)
  .filter(op => combiningFilterOps.indexOf(op) < 0)
