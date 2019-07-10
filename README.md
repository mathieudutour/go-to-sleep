# go-to-sleep

_If you are like me and like to slowly calm down while reading a book and listening to music before going to sleep, this might interest you._

## :rocket: QuickStart

_Requires [Node.js](https://nodejs.org/en/)_

```bash
npx go-to-sleep [options]
```

## :hammer_and_wrench: Configuration

By default, the script will play the `Sleep` playlist in iTunes while gradually lowering the volume during 30 minutes before putting the computer to sleep.
However, you can easily change those defaults by either passing some options to the command or creating a file containing your configuration if you plan to use it more often.

### CLI options

```bash
  -a, --application [application]  name of the music player. Only iTunes, Music (on macOS 10.15), and Spotify are supported for the moment.
  -m, --minutes [number]           how long before you'd like to sleep?
  -p, --playlist [playlistName]    name (or Spotify URI) of the playlist
```

#### Examples

```bash
# Play the "Sleep" playlist in iTunes for 30min
npx go-to-sleep --minutes=30 --playlist=Sleep

# Play the playlist 5aPHtZ3JXijkkCqYm6QoR1 in Spotify
npx go-to-sleep --application=Spotify --playlist=spotify:playlist:5aPHtZ3JXijkkCqYm6QoR1
```

### `.go-to-sleep` file

Create a new file `.go-to-sleep` in your home directory and the script will pick up the default configuration from there.

### Example

```toml
application=Spotify
playlist=spotify:playlist:5aPHtZ3JXijkkCqYm6QoR1
minutes=40
```

## :tm: Licence

MIT
