//Default SDP imports
import Context from '../../../context.js';
import { getSelectedLayers, createGrid, selectLayers } from '../../../library/layers'
import { populateLayers } from '../../../library/populator';
import Options, * as OPTIONS from '../../../library/options';

//Twitch imports
import { TWITCH_POPULATE_TYPE } from '../../library/populator';
import { twitchApi, saveJSON, loadJSONData, PRESET_DATA_PATH, getChannelId } from '../../library/data';
import { showTwitchPopulatorDialog, apiErrorMessage } from '../../library/gui';

export default (context) => {
  Context(context);

  //get selected layers
  let selectedLayers = getSelectedLayers();
  if (!selectedLayers.length) {
    return Context().document.showMessage('Please select the layers you would like to populate.');
  }

  //get options
  let options = Options();

  //get populator type
  let populatorType = TWITCH_POPULATE_TYPE.BADGES.SEARCH.CHANNEL;

  //show dialog
  options = showTwitchPopulatorDialog(
    populatorType, {
      twicthApiOptions: {
        search: {
          placeholder: 'lirik'
        },
        limitOffset: false
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
      return Context().document.showMessage('Grid creation failed')
    }
  }

  twitchApi.get({
    method: `chat/${options[OPTIONS.SEARCH_QUERY].trim()}/badges`,
    params: {
      api_verion: 3
    }
  })
  .then(data => {
    // save data to temp file
    // temp file is for populate again command
    saveJSON(data);

    //load data from temp file
    let jsonData = loadJSONData(PRESET_DATA_PATH);
    if (!jsonData) {
      return Context().document.showMessage('Error loading JSON from temp file');
    }

    if (jsonData.subscriber === null) {
      return Context().document.showMessage('This channel does not have a subscriber badge');
    }

    //save type of populate command
    options[OPTIONS.LAST_POPULATE_TYPE] = populatorType;

    //save options
    Options(options);

    //populate selected layers
    populateLayers(selectedLayers, jsonData.subscriber, options);

    //restore selected layers
    selectLayers(selectedLayers);
  })
  .catch(err => {
    // Show error if API returns error
    return apiErrorMessage(err);
  });
}
