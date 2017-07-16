//Default SDP imports
import Context from '../../context.js';
import { getSelectedLayers, createGrid, selectLayers } from '../../library/layers'
import { populateLayers } from '../../library/populator';
import Options, * as OPTIONS from '../../library/options';

//Twitch imports
import { loadJSONData, PRESET_DATA_PATH } from '../library/data';

export default (context) => {
  Context(context);

  //get selected layers
  let selectedLayers = getSelectedLayers();
  if (!selectedLayers.length) {
    return Context().document.showMessage('Please select the layers you would like to populate.');
  }

  //get options
  let options = Options();

  //terminate if cancelled
  if (!options) {
    return
  }

  //create grid
  if (options[OPTIONS.CREATE_GRID]) {
    selectedLayers = createGrid(selectedLayers, {
      rowsCount: options[OPTIONS.ROWS_COUNT],
      rowsMargin: options[OPTIONS.ROWS_MARGIN],
      columnsCount: options[OPTIONS.COLUMNS_COUNT],
      columnsMargin: options[OPTIONS.COLUMNS_MARGIN]
    });

    //make sure that grid creation was successful
    //could have failed if zero rows were requested for example
    if (!selectedLayers) {
      return Context().document.showMessage('Grid creation failed')
    }
  }

  //load data from temp file
  let jsonData = loadJSONData(PRESET_DATA_PATH);
  if (!jsonData) {
    return Context().document.showMessage('Error loading JSON from temp file');
  }

  //populate selected layers
  populateLayers(selectedLayers, jsonData, options);

  //restore selected layers
  selectLayers(selectedLayers);
}
