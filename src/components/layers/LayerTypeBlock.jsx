import React from 'react'

import GlSpec from '../../config/v8.json'
import InputBlock from '../inputs/InputBlock'
import SelectInput from '../inputs/SelectInput'

class LayerTypeBlock extends React.Component {
  static propTypes = {
    value: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,
  }

  render() {
    return <InputBlock label={"图层类型"} doc={GlSpec.layer.type.doc}>
      <SelectInput
        options={[
          ['background', '背景'],
          ['fill', '填充'],
          ['line', '线'],
          ['symbol', '符号'],
          ['raster', '栅格'],
          ['circle', '圆'],
          ['fill-extrusion', '3D'],
        ]}
        onChange={this.props.onChange}
        value={this.props.value}
      />
    </InputBlock>
  }
}

export default LayerTypeBlock
