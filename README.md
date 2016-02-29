# go-to-sleep

If you are like me and like to calm down slowly while reading a book and listening to music before going to sleep, this might interest you.

This script will play the `Sleep` playlist in iTunes while gradually lowering the volume during 30 minutes before putting the computer to sleep.

```
npm install -g go-to-sleep

Usage: go-to-sleep [options]

  Options:

    -h, --help                     output usage information
    -V, --version                  output the version number
    -m, --minutes [number]         How long before you'd like to go to sleep?
    -p, --playlist [playlistName]  Name of the playlist

  Example:

    $ go-to-sleep --minutes=30 --playlist=Sleep
```

# Licence

  MIT
