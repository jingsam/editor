import React from 'react'
import { saveAs } from 'file-saver'

import GlSpec from '../../config/v8.json'
import InputBlock from '../inputs/InputBlock'
import StringInput from '../inputs/StringInput'
import SelectInput from '../inputs/SelectInput'
import CheckboxInput from '../inputs/CheckboxInput'
import Button from '../Button'
import Modal from './Modal'
import MdFileDownload from 'react-icons/lib/md/file-download'
import style from '../../libs/style.js'
import formatStyle from 'mapbox-gl-style-spec/lib/format'


function stripAccessTokens(mapStyle) {
  const changedMetadata = { ...mapStyle.metadata }
  delete changedMetadata['maputnik:mapbox_access_token']
  delete changedMetadata['maputnik:openmaptiles_access_token']
  return {
    ...mapStyle,
    metadata: changedMetadata
  }
}

class ExportModal extends React.Component {
  static propTypes = {
    mapStyle: React.PropTypes.object.isRequired,
    onStyleChanged: React.PropTypes.func.isRequired,
    isOpen: React.PropTypes.bool.isRequired,
    onOpenToggle: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
  }

  downloadStyle() {
    const mapStyle = this.props.mapStyle

    const lastLayerId = mapStyle.metadata['zhixing:lastLayerId']
      || mapStyle.layers[mapStyle.layers.length - 1].id

    let lastLayerIndex = mapStyle.layers.findIndex(layer => layer.id === lastLayerId)
    if (lastLayerIndex === -1) lastLayerIndex = mapStyle.layers.length - 1

    const overlayLayers = mapStyle.layers.slice(lastLayerIndex + 1)
    const overlayMapStyle = {
      version: 8,
      sources: {},
      center: mapStyle.center,
      bearing: mapStyle.bearing,
      pitch: mapStyle.pitch,
      sprite: mapStyle.sprite,
      glyphs: mapStyle.glyphs,
      layers: overlayLayers
    }

    // add sources
    overlayLayers.forEach(layer => {
      const sourceId = layer.source
      if (sourceId) {
        overlayMapStyle.sources[sourceId] = mapStyle.sources[sourceId]
      }
    })

    const blob = new Blob([formatStyle(stripAccessTokens(overlayMapStyle))], {type: "application/json;charset=utf-8"});
    saveAs(blob, this.props.mapStyle.id + ".json");
  }

  render() {
    return <Modal
      isOpen={this.props.isOpen}
      onOpenToggle={this.props.onOpenToggle}
      title={'导出样式文件'}
    >

      <div className="maputnik-modal-section">
        <Button onClick={this.downloadStyle.bind(this)}>
          <MdFileDownload />
          导出叠加图层
        </Button>
      </div>

    </Modal>
  }
}

export default ExportModal
