import Context from '../../context'
import { readFileAsText } from '../../library/data'
export const PRESET_DATA_PARENT_DIR = getTempFolderPath("com.twitch.data-populator/temp-commands/");
export const PRESET_DATA_PATH      = PRESET_DATA_PARENT_DIR + "/data.json";

// Get a temp folder path
export function getTempFolderPath(withName) {
  let fileManager = NSFileManager.defaultManager(),
      cachesURL   = fileManager.URLsForDirectory_inDomains(NSCachesDirectory, NSUserDomainMask).lastObject(),
      hasName     = (typeof withName !== 'undefined') ? withName : (Date.now() / 1000),
      folderName  = NSString.stringWithFormat("%@", hasName)
  return cachesURL.URLByAppendingPathComponent(folderName).path()
}

// Create a folder at a specified path
export function createFolderAtPath(pathString) {
  let fileManager = NSFileManager.defaultManager()
  if(fileManager.fileExistsAtPath(pathString)){
    return true
  }
  return fileManager.createDirectoryAtPath_withIntermediateDirectories_attributes_error(pathString, true, nil, nil)
}

// Create a temp folder
export function createTempFolderNamed(name) {
  let tempPath = getTempFolderPath(name);
  createFolderAtPath(tempPath);
  return tempPath;
}

// Write text to a file
export function writeTextToFile(text, filePath) {
  let t = NSString.stringWithFormat("%@", text),
      f = NSString.stringWithFormat("%@", filePath)
  return t.writeToFile_atomically_encoding_error(f, true, NSUTF8StringEncoding, nil)
}

// Save json to a file
export function saveJsonToFile(jsonObj, filePath) {
  writeTextToFile(stringify(jsonObj), filePath);
}

// Get json from a url
export function getJSONFromURL(url) {
  var request     = NSURLRequest.requestWithURL(NSURL.URLWithString(url)),
      response    = NSURLConnection.sendSynchronousRequest_returningResponse_error(request, nil, nil),
      responseObj = NSJSONSerialization.JSONObjectWithData_options_error(response, nil, nil)
  return responseObj
}

// Stringify json
export function stringify(obj, prettyPrinted) {
  var prettySetting = prettyPrinted ? NSJSONWritingPrettyPrinted : 0,
      jsonData      = NSJSONSerialization.dataWithJSONObject_options_error(obj, prettySetting, nil)
  return NSString.alloc().initWithData_encoding(jsonData, NSUTF8StringEncoding)
}

// Save JSON to a specified path
export function saveJSON(json, folderPath = PRESET_DATA_PARENT_DIR, filePath = PRESET_DATA_PATH) {
  createFolderAtPath(folderPath);
  saveJsonToFile(json, filePath);
}

// Refactor of the default loadJSONData function
// Adds support for removing characters that would crash sketch
export function loadJSONData(path) {

  //load contents
  let contents = readFileAsText(path)

  //get data from JSON
  let data
  try {
    data = JSON.parse(contents, function(key, value){
      // regex for banned characters that would crash sketch
      let bannedCharacters = new RegExp(/[^\x00-\x7F]/g);
      // check if value is a string and contains banned characters
      if (typeof value === 'string' && bannedCharacters.test(value)) {
        // remove any banned characters
        let newValue = value.replace(bannedCharacters, '').trim()
        // if string is all banned characters then add a placeholder
        return newValue.length ? newValue : '*';
      }
       else {
        return value
      }
    })
  }
  catch (e) {
    Context().document.showMessage("There was an error parsing data. Please make sure it's valid.")
    return
  }

  return data
}

// API Params loop helper function
export function param(array) {
  var i = 0;
  var result = '';

  for ( var name in array ) {
    if ( i !== 0 ) {
      result += '&';
    }

    if( typeof array[name] === 'object' ) {
      var j = 0;

      for( var key in array[name] ) {
        result += name + '[' + key + ']=' + array[name][key];
        if( j < Object.keys(array[name]).length-1 ) {
          result += '&';
        }
      }

      j++;
    }
    else {
      result += name + '=' + array[name];
    }

    i++;
  }

  return result;
}

export function getChannelId(channelName) {
  return new Promise((resolve, reject) => {
    // check if id
    if (/^\d+$/.test(channelName)) {
      resolve(channelName);
    }
    // if not id, find and return channel id
    else {
      twitchApi.get({
        method: `channels/${channelName}`,
        params: {
          api_version: 3
        }
      })
      .then(data => {
        resolve(data._id);
      })
      .catch(err => {
        reject(err);
      });
    }
  });
}

export const twitchApi = {
  baseUrl: 'https://api.twitch.tv/kraken/',
  clientId: 'ppxbwp4lswaau19fvr8q799qpe8dv9',
  get(options) {
    return new Promise((resolve, reject) => {
      var url = this.baseUrl + options.method + '?' + `client_id=${this.clientId}` + '&' + param(options.params);
      var response = getJSONFromURL(url);
      if (response.error) {
        reject(response);
      } else {
        resolve(response);
      }
    });
  }
};
