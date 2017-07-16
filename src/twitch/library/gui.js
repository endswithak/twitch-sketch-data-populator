import Context from '../../context'
import Options, * as OPTIONS from '../../library/options'
import { createAlert, createDataOptionsView, createLayoutOptionsView, createLabel, createCheckbox } from '../../library/gui'

export function showTwitchPopulatorDialog(type, opt) {

  //define titles
  let alertTitle = {
    badges: {
      global: 'Global Badges',
      search: {
        name: 'Search Global Badges by Name',
        channel: 'Search Channel Subscriber Badge'
      }
    },
    channels: {
      search: 'Search All Channels',
    },
    emotes: {
      global: 'Global Emotes',
      search: {
        channel: 'Search Emotes by Channel',
        name: 'Search Global Emotes by Name'
      }
    },
    games: {
      top: 'Top Games',
      search: 'Search Games'
    },
    streams: {
      top: 'Top Streams',
      search: {
        game: 'Search Top Streams by Game',
        channel: 'Search Top Streams by Channel',
        language: 'Search Top Streams by Language'
      }
    },
    videos: {
      top: 'Top Videos',
      search: {
        channel: 'Search Top Videos by Channel',
        id: 'Search Videos by ID'
      }
    }
  }

  //define descriptions
  let alertDesc = {
    badges: {
      global: 'Get all the global chat badges',
      search: {
        name: 'Search individual global badges by name (e.g. staff)',
        channel: `Get a channel's subscriber badge. Search by channel name (e.g. lirik).`
      }
    },
    channels: {
      search: 'Search for a channel by channel name or channel ID',
    },
    emotes: {
      global: 'Get all the global twitch emotes',
      search: {
        channel: 'Search for channel emotes by channel name (Returns subscriber and global emotes)',
        name: 'Get individual global emotes by name (e.g. Kappa)'
      }
    },
    games: {
      top: 'Top games on Twitch',
      search: 'Search games by game name'
    },
    streams: {
      top: 'Get the top streams on Twitch',
      search: {
        game: 'Search streams by game name',
        channel: 'Search for streams by channal name or channel ID',
        language: 'Search for streams by one or more languages (e.g. es, de)'
      }
    },
    videos: {
      top: 'Top videos on Twitch',
      search: {
        channel: 'Search for videos by channel name or channel ID',
        id: 'Search videos by video ID (e.g. v99200125)'
      }
    }
  }

  function ref(obj, str) {
    return str.split(".").reduce(function(o, x) { return o[x] }, obj);
  }

  //create alert for type
  let alert = createAlert(ref(alertTitle, type), ref(alertDesc, type), 'twitch_icon.png');

  //get saved options
  let options = Options();

  let twitchApiView;
  if (opt.twicthApiOptions) {
    twitchApiView = createTwitchApiView(opt.twicthApiOptions);
    alert.addAccessoryView(twitchApiView.view);

    let spacerView3 = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 300, 5));
    alert.addAccessoryView(spacerView3);
  }

  //create data options view (disable randomize if populating table)
  let dataOptionsView = createDataOptionsView({
    noRandomize: false
  });
  alert.addAccessoryView(dataOptionsView.view);

  //add grid layout options
  let layoutOptionsView;

  //add space
  let spacerView2 = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 300, 5));
  alert.addAccessoryView(spacerView2);

  //create layout options view
  layoutOptionsView = createLayoutOptionsView();
  alert.addAccessoryView(layoutOptionsView.view);

  //set rows text field as first responder
  let alertWindow = alert.alert().window();
  alertWindow.setInitialFirstResponder(layoutOptionsView.rowsCountTextField);
  alertWindow.setAutorecalculatesKeyViewLoop(true);

  //add bottom buttons
  alert.addButtonWithTitle('Populate');
  alert.addButtonWithTitle('Cancel');

  //show alert
  let responseCode = alert.runModal();
  if (responseCode == '1000') {

    //get twitch api view
    if (twitchApiView) {
      if (opt.twicthApiOptions.search) {
        let searchTextField = twitchApiView.searchTextField;
        let searchQuery = String(searchTextField.stringValue());
        options[OPTIONS.SEARCH_QUERY] = searchQuery;
      }

      if (opt.twicthApiOptions.limitOffset) {
        if (opt.twicthApiOptions.limitOffset.limit) {
          let limitTextField = twitchApiView.limitTextField;
          let limitCount = Number(limitTextField.stringValue().split(/[.,]/g)[0]);
          options[OPTIONS.LIMIT] = limitCount;
        }
        if (opt.twicthApiOptions.limitOffset.offset) {
          let offsetTextField = twitchApiView.offsetTextField;
          let offsetCount = Number(offsetTextField.stringValue().split(/[.,]/g)[0]);
          options[OPTIONS.OFFSET] = offsetCount;
        }
      }
    }

    //get data options
    if (dataOptionsView) {

      //get randomize checkbox state
      let randomizeCheckbox = dataOptionsView.randomizeCheckbox;
      let randomizeData = Number(randomizeCheckbox.state());

      //get trim checkbox state
      let trimCheckbox = dataOptionsView.trimCheckbox;
      let trimText = Number(trimCheckbox.state());

      //get ellipsis checkbox state
      let ellipsisCheckbox = dataOptionsView.ellipsisCheckbox;
      let insertEllipsis = Number(ellipsisCheckbox.state());

      //get default substitute
      let substituteTextField = dataOptionsView.substituteTextField;
      let defaultSubstitute = String(substituteTextField.stringValue());

      //add options to result
      options[OPTIONS.RANDOMIZE_DATA] = randomizeData;
      options[OPTIONS.TRIM_TEXT] = trimText;
      options[OPTIONS.INSERT_ELLIPSIS] = insertEllipsis;
      options[OPTIONS.DEFAULT_SUBSTITUTE] = defaultSubstitute;
    }

    //get layout options
    if (layoutOptionsView) {

      //get create grid checkbox state
      let createGridCheckbox = layoutOptionsView.createGridCheckbox;
      let isCreateGrid = Number(createGridCheckbox.state());

      //get grid config
      let rowsCountTextField = layoutOptionsView.rowsCountTextField;
      let rowsCount = Number(rowsCountTextField.stringValue().split(/[.,]/g)[0]);
      let rowsMarginTextField = layoutOptionsView.rowsMarginTextField;
      let rowsMargin = Number(rowsMarginTextField.stringValue().replace(/,/g, '.'));
      let columnsCountTextField = layoutOptionsView.columnsCountTextField;
      let columnsCount = Number(columnsCountTextField.stringValue().split(/[.,]/g)[0]);
      let columnsMarginTextField = layoutOptionsView.columnsMarginTextField;
      let columnsMargin = Number(columnsMarginTextField.stringValue().replace(/,/g, '.'));

      //add options to result
      options[OPTIONS.CREATE_GRID] = isCreateGrid;
      options[OPTIONS.ROWS_COUNT] = rowsCount;
      options[OPTIONS.ROWS_MARGIN] = rowsMargin;
      options[OPTIONS.COLUMNS_COUNT] = columnsCount;
      options[OPTIONS.COLUMNS_MARGIN] = columnsMargin;
    }

    //return configured options
    return options;
  }
}

export function createTwitchApiView(opt) {
  let options = Options();
  let twitchApiView;
  let twitchApiViewTitle;

  //create apiView
  //size depends on the number of
  //api options available
  if (opt.search && opt.limitOffset) {
    twitchApiView = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 300, 71));
    twitchApiViewTitle = createLabel('Twitch API Options', 12, true, NSMakeRect(0, 51, 300, 20));
  } else {
    twitchApiView = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 300, 49));
    twitchApiViewTitle = createLabel('Twitch API Options', 12, true, NSMakeRect(0, 29, 300, 20));
  }

  twitchApiView.addSubview(twitchApiViewTitle);

// ==============================================
// ++++++++++++++++++++++++++++++++++++++++++++++
// ==============================================
// SEARCH
// ==============================================
// ++++++++++++++++++++++++++++++++++++++++++++++
// ==============================================

  let searchTextField;
  let searchLabel;

  if (opt.search) {
    //create search label and field
    //if limitOffset if active the position
    //needs to be tweaked
    if (opt.limitOffset) {
      searchLabel = createLabel('Search:', 12, false, NSMakeRect(0, 26, 55, 20));
      searchTextField = NSTextField.alloc().initWithFrame(NSMakeRect(55, 26, 185, 22));
    } else {
      searchLabel = createLabel('Search:', 12, false, NSMakeRect(0, 0, 55, 20));
      searchTextField = NSTextField.alloc().initWithFrame(NSMakeRect(55, 0, 185, 22));
    }
    twitchApiView.addSubview(searchLabel);
    twitchApiView.addSubview(searchTextField);

    //set search
    if(options[OPTIONS.SEARCH_QUERY]) {
      searchTextField.setStringValue(options[OPTIONS.SEARCH_QUERY]);
    } else {
      searchTextField.setStringValue(opt.search.placeholder);
    }
  }

// ==============================================
// ++++++++++++++++++++++++++++++++++++++++++++++
// ==============================================
// LIMIT OFFSET
// ==============================================
// ++++++++++++++++++++++++++++++++++++++++++++++
// ==============================================

  let limitTextField;
  let limitLabel;
  let offsetTextField;
  let offsetLabel;

  if (opt.limitOffset) {
    if (opt.limitOffset.limit) {
      //create limit label
      limitLabel = createLabel('Limit:', 12, false, NSMakeRect(0, 0, 60, 20));
      limitTextField = NSTextField.alloc().initWithFrame(NSMakeRect(40, 0, 70, 22));
      //create limit text field
      twitchApiView.addSubview(limitLabel);
      twitchApiView.addSubview(limitTextField);
      //set limit
      if(options[OPTIONS.LIMIT]) {
        limitTextField.setStringValue(options[OPTIONS.LIMIT]);
      } else {
        limitTextField.setStringValue('25');
      }
    }

    //set offset
    if (opt.limitOffset.offset) {
      //create offset label
      offsetLabel = createLabel('Offset:', 12, false, NSMakeRect(122, 0, 50, 20));
      offsetTextField = NSTextField.alloc().initWithFrame(NSMakeRect(170, 0, 70, 22));
      //create offset textfield
      twitchApiView.addSubview(offsetLabel);
      twitchApiView.addSubview(offsetTextField);
      //set offset
      if(options[OPTIONS.OFFSET]) {
        offsetTextField.setStringValue(options[OPTIONS.OFFSET]);
      } else {
        offsetTextField.setStringValue('0');
      }
    }
  }

  return {
    view: twitchApiView,
    limitTextField: limitTextField,
    offsetTextField: offsetTextField,
    searchTextField: searchTextField
  }
}

export function apiErrorMessage(err) {
  // Show error if API returns error
  let error = err.error;
  let errorStatus = err.status;
  let errorMessage = err.message;
  let errorShort = Context().document.showMessage(`Twitch API Error ${errorStatus}: ${error}`);
  let errorLong = Context().document.showMessage(`Twitch API Error ${errorStatus}: ${error}, ${errorMessage}`);

  return errorMessage ? errorLong : errorShort;
}
