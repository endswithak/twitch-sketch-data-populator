//Default SDP imports
import Context from '../../../context.js';
import { getSelectedLayers, createGrid, selectLayers } from '../../../library/layers'
import { populateLayers } from '../../../library/populator';
import Options, * as OPTIONS from '../../../library/options';

//Twitch imports
import { TWITCH_POPULATE_TYPE } from '../../library/populator';
import { twitchApi, saveJSON, loadJSONData, PRESET_DATA_PATH } from '../../library/data';
import { showTwitchPopulatorDialog, apiErrorMessage } from '../../library/gui';

export default (context) => {
  Context(context);

  //get selected layers
  let selectedLayers = getSelectedLayers()
  if (!selectedLayers.length) {
    return Context().document.showMessage('Please select the layers you would like to populate.');
  }

  //get options
  let options = Options();

  //get populator type
  let populatorType = TWITCH_POPULATE_TYPE.VIDEOS.TOP;

  //show dialog
  options = showTwitchPopulatorDialog(
    populatorType, {
      twicthApiOptions: {
        search: false,
        limitOffset: {
          limit: true,
          offset: true
        }
      }
    }
  );

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
      return Context().document.showMessage('Grid creation failed');
    }
  }

  twitchApi.get({
    method: 'videos/top',
    params: {
      limit: options[OPTIONS.LIMIT],
      offset: options[OPTIONS.OFFSET],
      api_version: 5
    }
  })
  .then(data => {
    // save data to temp file
    // temp file is for populate again command
    saveJSON(data.vods);

    //load data from temp file
    let jsonData = loadJSONData(PRESET_DATA_PATH);
    if (!jsonData) {
      return Context().document.showMessage('Error loading JSON from temp file');
    } else if (!jsonData.length) {
      return Context().document.showMessage('No games');
    }

    //save type of populate command
    options[OPTIONS.LAST_POPULATE_TYPE] = populatorType;

    //save options
    Options(options);

    //populate selected layers
    populateLayers(selectedLayers, jsonData, options);

    //restore selected layers
    selectLayers(selectedLayers);
  })
  .catch(err => {
    return apiErrorMessage(err);
  });
}
