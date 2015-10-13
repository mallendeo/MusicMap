# Youtify
Open current YouTube song video in Spotify

I made this extension because none of the available ones was accurate enough, so I almost always ended up manually copy pasting the song title in Spotify.

Youtify should work fine for most music videos and remixes, if you find a bug/wrong result please report them here.

## Install
[Youtify: Chrome Store](https://chrome.google.com/webstore/detail/youtify/hkcmkfpmieckdagpoifmeieihclpphbg?hl=en)

## Build

    git clone https://github.com/mallendeo/Youtify.git
    cd Youtify
    npm install
    # Edit and rename .env.example.json to .env.json
    gulp build --dist

## Test

    npm test
    
## License

GNU GENERAL PUBLIC LICENSE v2
