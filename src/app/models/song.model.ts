interface Song {
    id: string;
    name: string;
    performer: string;
    mp3Url: string;
    video: string;
    songType: string;
    user: string;
    album: string;
    country: string;
    view: number;
    like: number;
}

interface Album {
    id: string;
    name: string;
    performer: string;
    user: string;
}

interface Country {
    id: string;
    name: string;
}

interface SongType {
    id: string;
    name: string;
}

interface Video {
    id: string;
    mp4Url: string;
    song: string;
}

interface Comment {
    id: string;
    song: string;
    video: string;
    user: string;
    postDate: string;
    content: string;
    like: number;
}

interface Performer {
    id: string;
    name: string;
    birthday: string;
    country: string;
    user: string;
}

