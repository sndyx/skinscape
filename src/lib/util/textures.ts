import PNG from 'pngjs';

function getSkin(input: string): Uint8Array {
    if (/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(input)) {
        // Link
        fetch(input).then((response) => {
            response.arrayBuffer().then((buffer) => {
                
                new PNG.PNG().parse(buffer)
            })
        })
    }
}
