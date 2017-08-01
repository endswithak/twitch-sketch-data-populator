/**
 * Plugin
 *
 * Defines the plugin structure and metadata.
 */

import * as commands from './commands';

export const HKSketchFusionExtension = {
  name: 'Twitch Data Populator',
  bundleName: 'Twitch Data Populator',
  description: 'Sketch Data Populator with Twitch API integration',
  author: 'Erik Myers',
  authorEmail: 'erik@erik.design',
  version: '3.0.0',
  identifier: 'com.twitch.data-populator',
  compatibleVersion: '3.7',
  menu: {
    'isRoot': false,
    'items': [
      {
        'title': 'Badges',
        'items': [
          'globalBadges',
          'searchGlobalBadgesByName',
          'searchChannelSubBadge'
        ],
      },
      {
        'title': 'Channels',
        'items': [
          'searchChannels'
        ],
      },
      {
        'title': 'Emotes',
        'items': [
          'globalEmotes',
          'searchEmotesByChannel',
          'searchGlobalEmotesByName'
        ],
      },
      {
        'title': 'Games',
        'items': [
          'topGames',
          'searchGames'
        ],
      },
      {
        'title': 'Streams',
        'items': [
          'topStreams',
          'searchStreamsByChannel',
          'searchStreamsByGame',
          'searchStreamsByLanguage'
        ],
      },
      {
        'title': 'Videos',
        'items': [
          'topVideos',
          'searchVideosById',
          'searchVideosByChannel'
        ],
      },
      'twitchPopulateAgain',
      {
        'title': 'SDP Defaults',
        'items': [
          'populateWithPreset',
          'populateWithJSON',
          'populateTable',
          'populateAgain',
          'revealPresets',
          'clearLayers'
        ]
      }
    ]
  },
  commands: {
    globalBadges: {
      name: 'Global Badges',
      shortcut: '',
      description: 'Get all the global chat badges',
      icon: '../Resources/twitch_icon.png',
      run: commands.twitchCommands.badgeCommands.globalBadges
    },
    searchChannelSubBadge: {
      name: 'Channel Subscriber Badge',
      shortcut: '',
      description: `Get a channel's subscriber badge`,
      icon: '../Resources/twitch_icon.png',
      run: commands.twitchCommands.badgeCommands.searchChannelSubBadge
    },
    searchGlobalBadgesByName: {
      name: 'Search Global Badges by Name',
      shortcut: '',
      description: 'Search individual global badges',
      icon: '../Resources/twitch_icon.png',
      run: commands.twitchCommands.badgeCommands.searchGlobalBadgesByName
    },
    searchChannels: {
      name: 'Search Channels',
      shortcut: '',
      description: 'Search for a channel',
      icon: '../Resources/twitch_icon.png',
      run: commands.twitchCommands.channelCommands.searchChannels
    },
    globalEmotes: {
      name: 'Global Emotes',
      shortcut: '',
      description: 'Get all the global Twitch emotes',
      icon: '../Resources/twitch_icon.png',
      run: commands.twitchCommands.emoteCommands.globalEmotes
    },
    searchEmotesByChannel: {
      name: 'Search Emotes by Channel',
      shortcut: '',
      description: 'Search for channel emotes',
      icon: '../Resources/twitch_icon.png',
      run: commands.twitchCommands.emoteCommands.searchEmotesByChannel
    },
    searchGlobalEmotesByName: {
      name: 'Search Global Emotes by Name',
      shortcut: '',
      description: 'Search for an individual global emote',
      icon: '../Resources/twitch_icon.png',
      run: commands.twitchCommands.emoteCommands.searchGlobalEmotesByName
    },
    topGames: {
      name: 'Top Games',
      shortcut: '',
      description: 'Get top games on Twitch',
      icon: '../Resources/twitch_icon.png',
      run: commands.twitchCommands.gameCommands.topGames
    },
    searchGames: {
      name: 'Search Games',
      shortcut: '',
      description: 'Search for game',
      icon: '../Resources/twitch_icon.png',
      run: commands.twitchCommands.gameCommands.searchGames
    },
    topVideos: {
      name: 'Top Videos',
      shortcut: '',
      description: 'Get top videos on Twitch',
      icon: '../Resources/twitch_icon.png',
      run: commands.twitchCommands.videoCommands.topVideos
    },
    searchVideosById: {
      name: 'Search Videos by ID',
      shortcut: '',
      description: 'Search videos by video ID',
      icon: '../Resources/twitch_icon.png',
      run: commands.twitchCommands.videoCommands.searchVideosById
    },
    searchVideosByChannel: {
      name: 'Search Videos by Channel',
      shortcut: '',
      description: 'Search videos by channel name',
      icon: '../Resources/twitch_icon.png',
      run: commands.twitchCommands.videoCommands.searchVideosByChannel
    },
    topStreams: {
      name: 'Top Streams',
      shortcut: '',
      description: 'Get top streams on Twitch',
      icon: '../Resources/twitch_icon.png',
      run: commands.twitchCommands.streamCommands.topStreams
    },
    searchStreamsByChannel: {
      name: 'Search Streams by Channel',
      shortcut: '',
      description: 'Search streams by channel name',
      icon: '../Resources/twitch_icon.png',
      run: commands.twitchCommands.streamCommands.searchStreamsByChannel
    },
    searchStreamsByGame: {
      name: 'Search Streams by Game',
      shortcut: '',
      description: 'Search streams by game name',
      icon: '../Resources/twitch_icon.png',
      run: commands.twitchCommands.streamCommands.searchStreamsByGame
    },
    searchStreamsByLanguage: {
      name: 'Search Streams by Language',
      shortcut: '',
      description: 'Search streams by language',
      icon: '../Resources/twitch_icon.png',
      run: commands.twitchCommands.streamCommands.searchStreamsByLanguage
    },
    twitchPopulateAgain: {
      name: 'Populate Again',
      shortcut: '',
      description: 'Populate selected layers with previous command data',
      icon: '../Resources/twitch_icon.png',
      run: commands.twitchCommands.populateAgain
    },
    populateWithPreset: {
      name: 'Populate with Preset',
      shortcut: '',
      description: 'Pick one of Data Populator\'s built in Presets',
      icon: '../Resources/populateWithPreset.png',
      run: commands.populateWithPreset
    },
    populateWithJSON: {
      name: 'Populate with JSON',
      shortcut: '',
      description: 'Pick a local JSON file',
      icon: '../Resources/populateWithJSON.png',
      run: commands.populateWithJSON
    },
    populateTable: {
      name: 'Populate Table',
      shortcut: '',
      description: 'Pick CSV file to populate a table',
      icon: '../Resources/populateTable.png',
      run: commands.populateTable
    },
    populateAgain: {
      name: 'Populate Again',
      shortcut: 'cmd shift x',
      description: 'Populate again with last used setup',
      icon: '../Resources/populateAgain.png',
      run: commands.populateAgain
    },
    revealPresets: {
      name: 'Reveal Presets',
      shortcut: '',
      description: 'Show Data Populator\'s Presets in Finder',
      icon: '../Resources/revealPresets.png',
      run: commands.revealPresets
    },
    clearLayers: {
      name: 'Clear Layers',
      shortcut: '',
      description: 'Remove all populated data from selected Layers',
      icon: '../Resources/clearLayers.png',
      run: commands.clearLayers
    }
  }
}
